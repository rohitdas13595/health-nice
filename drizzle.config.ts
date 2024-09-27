// import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  
  // url:`postgresql://postgres:mysecretpassword@localhost:5432/house_listings`,
  dbCredentials: {
    host: process.env.DB_HOST ?? "localhost",
    port: (process.env.DB_PORT ?? 5432) as number,
    user: process.env.DB_USER ?? "postgres",
    password: process.env.DB_PASSWORD ?? "mysecretpasword",
    database: process.env.DB_NAME ?? "health_nice",
  },
} satisfies Config;
