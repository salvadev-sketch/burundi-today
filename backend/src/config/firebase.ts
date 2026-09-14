import admin from "firebase-admin";

// Split env vars (rather than one JSON blob) so each value can be rotated
// independently and doesn't need JSON-escaping in .env files. The private
// key specifically needs its literal "\n" sequences converted back to real
// newlines — that's how it always arrives from environment variables.
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  throw new Error(
    "Missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY env vars."
  );
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
  });
}

export const firebaseAuth = admin.auth();
export default admin;
