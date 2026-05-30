import "dotenv/config";
import mysql from "mysql2/promise";

async function addHasPaidField() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required");
  }

  // Parse connection string
  const match = connectionString.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!match) {
    throw new Error("Invalid DATABASE_URL format");
  }

  const [, user, password, host, port, database] = match;

  console.log("Connecting to database...");
  const connection = await mysql.createConnection({
    host,
    port: parseInt(port),
    user,
    password,
    database,
    ssl: {
      minVersion: "TLSv1.2",
      rejectUnauthorized: true,
    },
  });

  try {
    console.log("Checking if has_paid column exists...");
    
    // Check if column already exists
    const [columns] = await connection.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'has_paid'",
      [database]
    );

    if (columns.length > 0) {
      console.log("✅ has_paid column already exists!");
      return;
    }

    console.log("Adding has_paid column...");
    await connection.query(
      "ALTER TABLE `users` ADD COLUMN `has_paid` boolean DEFAULT false AFTER `email_verified`"
    );

    console.log("✅ Successfully added has_paid column!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

addHasPaidField()
  .then(() => {
    console.log("\n✅ Done! You can now run: npm run dev");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Failed:", error);
    process.exit(1);
  });
