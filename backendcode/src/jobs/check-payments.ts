import { checkPaymentsJob } from "medusa-payment-solana/job"

export default checkPaymentsJob

export const config = {
  name: "check-solana-payments",
  schedule: "*/1 * * * *",
}
