import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000", // Your site's base domain
});

// Destructure cleanly from the configured instance
export const { signIn, signUp, useSession, forgotPassword } = authClient;
