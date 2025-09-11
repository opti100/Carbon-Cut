import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  plugins: [
    inferAdditionalFields(),
  ],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
  resetPassword,
  changePassword,
//   sendPasswordResetEmail,
  verifyEmail,
//   resendVerificationEmail,
  linkSocial,
//   unlinkSocial,
//   enableTwoFactor,
//   disableTwoFactor,
//   verifyTwoFactor,
} = authClient;
