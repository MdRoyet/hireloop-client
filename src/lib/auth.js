import dns from "dns";

// 1. Core Priority: Override the local network DNS resolver immediately
if (typeof window === "undefined") {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

// 2. Safe Fallback extraction parameters to prevent initialization failures
const uri = process.env.MONGODB_URI || "";
const dbName = process.env.MONGODB_DB_NAME || "hireloop";

if (!uri) {
  console.error(
    "⚠️ Environment Alert: MONGODB_URI is missing from your configuration env file.",
  );
}

// 3. Connect to the Atlas cluster using the parsed SRV discovery routing layers
const client = new MongoClient(uri);
const db = client.db(dbName);

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: mongodbAdapter(db, {
    client,
  }),

  // FIXED: Standardized Better-Auth dynamic schema parameters
  user: {
    fields: {
      role: {
        type: "string",
        defaultValue: "job_seeker", // This matches your front-end selection block
      },
    },
  },
});
