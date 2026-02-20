"use client"

import { isETransfer, isSolana, isStripeLike } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useEffect, useMemo, useState } from "react"
import ErrorMessage from "../error-message"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

type SolanaPaymentSessionData = {
  id?: string
  sol_amount?: number
  received_sol_amount?: number
  solana_one_time_address?: string
  expiration_date?: string
}

const SOLANA_POLL_INTERVAL_MS = 7000

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (session) => session.status === "pending"
  )

  switch (true) {
    case isStripeLike(paymentSession?.provider_id):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isSolana(paymentSession?.provider_id):
      return (
        <SolanaPaymentButton
          notReady={notReady}
          cartId={cart.id}
          sessionId={paymentSession?.id}
          initialSession={paymentSession}
          data-testid={dataTestId}
        />
      )
    case isETransfer(paymentSession?.provider_id):
      return (
        <ETransferPaymentButton
          notReady={notReady}
          data-testid={dataTestId}
        />
      )
    case !!paymentSession?.provider_id:
      return (
        <GenericPaymentButton
          notReady={notReady}
          data-testid={dataTestId}
          providerId={paymentSession.provider_id}
        />
      )
    default:
      return <Button disabled>Select a payment method</Button>
  }
}

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const disabled = !stripe || !elements ? true : false

  const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }

    await stripe
      .confirmCardPayment(session?.data.client_secret as string, {
        payment_method: {
          card: card,
          billing_details: {
            name:
              cart.billing_address?.first_name +
              " " +
              cart.billing_address?.last_name,
            address: {
              city: cart.billing_address?.city ?? undefined,
              country: cart.billing_address?.country_code ?? undefined,
              line1: cart.billing_address?.address_1 ?? undefined,
              line2: cart.billing_address?.address_2 ?? undefined,
              postal_code: cart.billing_address?.postal_code ?? undefined,
              state: cart.billing_address?.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billing_address?.phone ?? undefined,
          },
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent

          if (
            (pi && pi.status === "requires_capture") ||
            (pi && pi.status === "succeeded")
          ) {
            onPaymentCompleted()
          }

          setErrorMessage(error.message || null)
          return
        }

        if (
          (paymentIntent && paymentIntent.status === "requires_capture") ||
          paymentIntent.status === "succeeded"
        ) {
          return onPaymentCompleted()
        }

        return
      })
  }

  return (
    <>
      <Button
        disabled={disabled || notReady}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="stripe-payment-error-message"
      />
    </>
  )
}

const SolanaPaymentButton = ({
  notReady,
  cartId,
  sessionId,
  initialSession,
  "data-testid": dataTestId,
}: {
  notReady: boolean
  cartId?: string
  sessionId?: string
  initialSession?: HttpTypes.StorePaymentSession
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [checking, setChecking] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [session, setSession] = useState<HttpTypes.StorePaymentSession | undefined>(
    initialSession
  )

  const data = session?.data as SolanaPaymentSessionData | undefined
  const expectedAmount = Number(data?.sol_amount || 0)
  const receivedAmount = Number(data?.received_sol_amount || 0)
  const remainingAmount = Math.max(0, expectedAmount - receivedAmount)
  const address = data?.solana_one_time_address
  const isPaidEnough = expectedAmount > 0 && receivedAmount >= expectedAmount
  const isAuthorized = session?.status === "authorized" || session?.status === "captured"
  const isConfirmed = isPaidEnough || isAuthorized

  const paymentUri = useMemo(() => {
    if (!address) {
      return ""
    }

    return `solana:${address}?amount=${remainingAmount.toFixed(9)}`
  }, [address, remainingAmount])

  const qrCodeUrl = useMemo(() => {
    if (!paymentUri) {
      return ""
    }

    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
      paymentUri
    )}`
  }, [paymentUri])

  const refreshSession = async () => {
    if (!cartId || !sessionId) {
      return
    }

    setChecking(true)
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }

      if (process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY) {
        headers["x-publishable-api-key"] =
          process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
      }

      const response = await fetch(
        `${backendUrl}/store/carts/${cartId}?fields=*payment_collection,*payment_collection.payment_sessions`,
        {
          method: "GET",
          headers,
        }
      )

      if (!response.ok) {
        throw new Error("Failed to refresh Solana payment status")
      }

      const result = await response.json()
      const latestSession = result?.cart?.payment_collection?.payment_sessions?.find(
        (paymentSession: HttpTypes.StorePaymentSession) => paymentSession.id === sessionId
      )

      if (latestSession) {
        setSession(latestSession)
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Could not refresh Solana payment status")
    } finally {
      setChecking(false)
    }
  }

  useEffect(() => {
    setSession(initialSession)
  }, [initialSession])

  useEffect(() => {
    if (!cartId || !sessionId || isConfirmed) {
      return
    }

    const interval = setInterval(() => {
      void refreshSession()
    }, SOLANA_POLL_INTERVAL_MS)

    void refreshSession()

    return () => {
      clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartId, sessionId, isConfirmed])

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = () => {
    setSubmitting(true)
    onPaymentCompleted()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-ui-border-base p-4">
        <p className="txt-small text-ui-fg-subtle mb-2">Send SOL to this wallet</p>
        {qrCodeUrl ? (
          <img
            src={qrCodeUrl}
            alt="Solana payment QR code"
            className="h-44 w-44 rounded-md border border-ui-border-base"
          />
        ) : (
          <p className="txt-small text-ui-fg-subtle">Waiting for payment session details…</p>
        )}

        <div className="mt-3 space-y-1">
          <p className="txt-small text-ui-fg-base break-all">
            Address: {address || "Unavailable"}
          </p>
          <p className="txt-small text-ui-fg-base">
            Amount due: {expectedAmount.toFixed(9)} SOL
          </p>
          <p className="txt-small text-ui-fg-base">
            Received: {receivedAmount.toFixed(9)} SOL
          </p>
          <p className="txt-small text-ui-fg-base">
            Remaining: {remainingAmount.toFixed(9)} SOL
          </p>
        </div>
      </div>

      <Button
        type="button"
        variant="secondary"
        onClick={() => void refreshSession()}
        isLoading={checking}
      >
        Refresh payment status
      </Button>

      <Button
        disabled={notReady || !isConfirmed}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid={dataTestId || "submit-order-button"}
      >
        {isConfirmed ? "Place order" : "Waiting for Solana confirmation"}
      </Button>

      <ErrorMessage
        error={errorMessage}
        data-testid="solana-payment-error-message"
      />
    </div>
  )
}

const ETransferPaymentButton = ({
  notReady,
  "data-testid": dataTestId,
}: {
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handlePayment = async () => {
    setSubmitting(true)
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-ui-border-base p-4 bg-ui-bg-subtle">
        <p className="txt-medium-plus text-ui-fg-base mb-1">E-Transfer Instructions</p>
        <p className="txt-small text-ui-fg-subtle mb-2">
          Please send your e-transfer to:
        </p>
        <p className="txt-medium text-ui-fg-base font-semibold">
          info@deuswarehouse.com
        </p>
        <p className="txt-small text-ui-fg-subtle mt-2">
          Once you click &quot;Place order&quot;, your order will be placed. Please send the e-transfer promptly — your order will be processed once payment is received.
        </p>
      </div>

      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid={dataTestId || "submit-order-button"}
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="etransfer-payment-error-message"
      />
    </div>
  )
}

const GenericPaymentButton = ({
  notReady,
  providerId,
  "data-testid": dataTestId,
}: {
  notReady: boolean
  providerId?: string
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = () => {
    setSubmitting(true)

    onPaymentCompleted()
  }

  return (
    <>
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid={dataTestId || "submit-order-button"}
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid={`${providerId || "generic"}-payment-error-message`}
      />
    </>
  )
}

export default PaymentButton
