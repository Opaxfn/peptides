import { AbstractPaymentProvider } from "@medusajs/framework/utils"
import {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  ProviderWebhookPayload,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
} from "@medusajs/framework/types"

type ETransferPaymentOptions = {
  email: string
}

class ETransferPaymentProviderService extends AbstractPaymentProvider<ETransferPaymentOptions> {
  static identifier = "etransfer"

  protected options_: ETransferPaymentOptions

  constructor(container: any, options: ETransferPaymentOptions) {
    super(container, options)
    this.options_ = options
  }

  async initiatePayment(
    input: InitiatePaymentInput
  ): Promise<InitiatePaymentOutput> {
    return {
      id: `etransfer-${Date.now()}`,
      data: {
        email: this.options_.email,
        status: "pending",
        amount: input.amount,
        currency_code: input.currency_code,
      },
    }
  }

  async authorizePayment(
    input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    return {
      status: "authorized",
      data: {
        ...(input.data as Record<string, unknown>),
        status: "authorized",
      },
    }
  }

  async capturePayment(
    input: CapturePaymentInput
  ): Promise<CapturePaymentOutput> {
    return {
      data: {
        ...(input.data as Record<string, unknown>),
        status: "captured",
      },
    }
  }

  async cancelPayment(
    input: CancelPaymentInput
  ): Promise<CancelPaymentOutput> {
    return {
      data: {
        ...(input.data as Record<string, unknown>),
        status: "canceled",
      },
    }
  }

  async refundPayment(
    input: RefundPaymentInput
  ): Promise<RefundPaymentOutput> {
    return {
      data: {
        ...(input.data as Record<string, unknown>),
        status: "refunded",
      },
    }
  }

  async getPaymentStatus(
    input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput> {
    const data = input.data as Record<string, unknown> | undefined
    const status = (data?.status as string) || "pending"

    if (status === "captured") return { status: "captured" }
    if (status === "canceled") return { status: "canceled" }
    if (status === "authorized") return { status: "authorized" }

    return { status: "pending" }
  }

  async retrievePayment(
    input: RetrievePaymentInput
  ): Promise<RetrievePaymentOutput> {
    return input.data as Record<string, unknown>
  }

  async updatePayment(
    input: UpdatePaymentInput
  ): Promise<UpdatePaymentOutput> {
    return {
      data: {
        ...(input.data as Record<string, unknown>),
        amount: input.amount,
        currency_code: input.currency_code,
      },
    }
  }

  async deletePayment(
    input: DeletePaymentInput
  ): Promise<DeletePaymentOutput> {
    return {}
  }

  async getWebhookActionAndData(
    payload: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    return { action: "not_supported" }
  }
}

export default ETransferPaymentProviderService
