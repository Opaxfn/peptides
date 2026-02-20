import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  modules: [
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "medusa-payment-solana",
            id: "solana",
            options: {
              passPhrase: process.env.SOLANA_MNEMONIC,
              coldStorageWallet: process.env.SOLANA_COLD_STORAGE_WALLET,
              rpcUrl: process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com",
              sessionExpirationSeconds: 600,
              currencyConverter: {
                provider: "coingecko",
                apiKey: process.env.COINGECKO_API_KEY,
              },
            },
          },
          {
            resolve: "./src/modules/etransfer-payment",
            id: "etransfer",
            options: {
              email: "info@deuswarehouse.com",
            },
          },
        ],
      },
    },
  ],
})
