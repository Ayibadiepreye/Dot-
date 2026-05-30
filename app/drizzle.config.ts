import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// Parse connection string to extract components
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle commands");
}

// Extract connection details from URL
// Format: mysql://username:password@host:port/database
const match = connectionString.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
if (!match) {
  throw new Error("Invalid DATABASE_URL format");
}

const [, user, password, host, port, database] = match;

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "mysql",
  dbCredentials: {
    host,
    port: parseInt(port),
    user,
    password,
    database,
    ssl: {
      minVersion: "TLSv1.2",
      rejectUnauthorized: true,
    },
  },
});
