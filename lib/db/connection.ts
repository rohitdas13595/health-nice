
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { settings } from "../settings";

const pool = new pg.Pool({
  user: settings.postgresUser,
  host: settings.postgresHost,
  database: settings.postgresDatabase,
  password: settings.postgresPassword,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
    ca: settings.caCertificate,
  },
});

const db = drizzle(pool, { schema });

const connection = pool.connect();

export { db, connection, pool };
