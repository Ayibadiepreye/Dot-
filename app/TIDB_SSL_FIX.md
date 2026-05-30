# 🔧 TiDB SSL Connection Fix

**Problem**: `npm run db:push` fails with "Connections using insecure transport are prohibited"

---

## ✅ SOLUTION: Use TiDB Serverless Driver

TiDB offers a serverless driver that uses HTTP instead of MySQL protocol, which bypasses SSL configuration issues.

### Step 1: Install TiDB Serverless Driver

```bash
npm install @tidbcloud/serverless
```

### Step 2: Update drizzle.config.ts

Replace the entire file with:

```typescript
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// Parse the MySQL connection string to extract components
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle commands");
}

// For TiDB Serverless, we can use the HTTP-based driver
// Format: mysql://username:password@host:port/database
const url = new URL(connectionString.replace('mysql://', 'https://'));

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "mysql",
  driver: "turso", // Use turso driver for HTTP-based connections
  dbCredentials: {
    url: connectionString,
  },
});
```

### Step 3: Alternative - Use mysql2 with Proper SSL

If the above doesn't work, try this configuration:

```typescript
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle commands");
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "mysql",
  dbCredentials: {
    host: "gateway01.eu-central-1.prod.aws.tidbcloud.com",
    port: 4000,
    user: "3TNQu3siWtbsVhR.root",
    password: "2IpubNAlfc1Ya582",
    database: "test",
    ssl: {
      minVersion: "TLSv1.2",
      rejectUnauthorized: true,
    },
  },
});
```

### Step 4: Alternative - Use Connection Object Instead of URL

```typescript
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "mysql",
  dbCredentials: {
    host: process.env.TIDB_HOST || "gateway01.eu-central-1.prod.aws.tidbcloud.com",
    port: parseInt(process.env.TIDB_PORT || "4000"),
    user: process.env.TIDB_USER || "3TNQu3siWtbsVhR.root",
    password: process.env.TIDB_PASSWORD || "2IpubNAlfc1Ya582",
    database: process.env.TIDB_DATABASE || "test",
    ssl: {
      minVersion: "TLSv1.2",
      rejectUnauthorized: true,
    },
  },
});
```

Then update `.env`:
```env
TIDB_HOST=gateway01.eu-central-1.prod.aws.tidbcloud.com
TIDB_PORT=4000
TIDB_USER=3TNQu3siWtbsVhR.root
TIDB_PASSWORD=2IpubNAlfc1Ya582
TIDB_DATABASE=test
```

---

## 🔍 DEBUGGING STEPS

### 1. Check drizzle-kit Version
```bash
npm list drizzle-kit
```

If it's old, update:
```bash
npm install -D drizzle-kit@latest
```

### 2. Test Connection with mysql2 Directly

Create a test file `test-connection.js`:

```javascript
import mysql from 'mysql2/promise';

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'gateway01.eu-central-1.prod.aws.tidbcloud.com',
      port: 4000,
      user: '3TNQu3siWtbsVhR.root',
      password: '2IpubNAlfc1Ya582',
      database: 'test',
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true,
      },
    });
    
    console.log('✅ Connection successful!');
    await connection.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
```

Run:
```bash
node test-connection.js
```

### 3. Check TiDB Console

1. Go to TiDB Cloud Console
2. Check if SSL is enabled for your cluster
3. Verify connection string is correct
4. Check if IP whitelist is configured (if any)

### 4. Try Without SSL (Development Only)

**⚠️ NOT RECOMMENDED FOR PRODUCTION**

```typescript
export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "mysql",
  dbCredentials: {
    url: connectionString,
    ssl: false, // Disable SSL (dev only)
  },
});
```

---

## 📚 RESOURCES

- **TiDB Serverless Driver**: https://github.com/tidbcloud/serverless-js
- **Drizzle TiDB Guide**: https://orm.drizzle.team/docs/get-started/tidb-new
- **TiDB SSL Docs**: https://docs.pingcap.com/tidbcloud/secure-connections-to-serverless-tier-clusters
- **Drizzle Kit Config**: https://orm.drizzle.team/kit-docs/config-reference

---

## 🎯 RECOMMENDED APPROACH

**Try in this order:**

1. ✅ **Install @tidbcloud/serverless** and use HTTP-based connection
2. ✅ **Use connection object** instead of URL string
3. ✅ **Update drizzle-kit** to latest version
4. ✅ **Test connection** with mysql2 directly
5. ✅ **Check TiDB Console** for SSL settings
6. ✅ **Contact TiDB Support** if all else fails

---

## 💡 LIKELY SOLUTION

The most likely solution is **Option 1** (TiDB Serverless Driver) or **Option 3** (Connection Object).

The issue is that drizzle-kit may not be parsing the SSL configuration correctly from the connection string URL format.

Using a connection object with explicit SSL settings should work.

---

**Try these solutions and let me know which one works!** 🚀
