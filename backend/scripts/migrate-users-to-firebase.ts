// One-off migration: import existing Mongo users (with their bcrypt
// password hashes from the old JWT auth system) into Firebase Auth, so
// they can keep using their existing password after the switch — nobody
// has to reset anything.
//
// Firebase's admin.auth().importUsers() supports bcrypt hashes natively
// (hash.algorithm: "BCRYPT"), so this is a straight import, not a
// re-hash — the actual password Firebase ends up verifying against is
// identical to what the old system verified against.
//
// Each migrated user's Firebase uid is set to their existing Mongo _id
// (as a string). That's just a convenient, human-traceable choice — new
// signups after this point get Firebase's own auto-generated uid instead,
// and every lookup in the app goes through the firebaseUid field either
// way, so the two ID schemes never need to line up again after this.
//
// Usage:
//   cd backend
//   MONGODB_URI="..." FIREBASE_PROJECT_ID="..." FIREBASE_CLIENT_EMAIL="..." FIREBASE_PRIVATE_KEY="..." \
//     npx tsx scripts/migrate-users-to-firebase.ts
//
// Safe to re-run: importUsers upserts by uid, and this script skips any
// Mongo user that already has a firebaseUid set.

import mongoose from "mongoose";
import { User } from "../src/models/User";
import { firebaseAuth } from "../src/config/firebase";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set.");
  process.exit(1);
}

const BATCH_SIZE = 500; // importUsers' documented per-call limit

async function run() {
  await mongoose.connect(MONGODB_URI!);

  const usersToMigrate = await User.find({
    firebaseUid: { $exists: false },
    passwordHash: { $exists: true, $ne: null },
  }).select("+passwordHash");

  console.log(`Found ${usersToMigrate.length} user(s) to migrate.\n`);

  if (usersToMigrate.length === 0) {
    console.log("Nothing to do.");
    await mongoose.disconnect();
    process.exit(0);
  }

  let totalSuccess = 0;
  let totalFailed = 0;

  for (let i = 0; i < usersToMigrate.length; i += BATCH_SIZE) {
    const batch = usersToMigrate.slice(i, i + BATCH_SIZE);

    const importRecords = batch.map((user) => ({
      uid: String(user._id),
      email: user.email,
      displayName: user.name,
      photoURL: user.avatarUrl || undefined,
      passwordHash: Buffer.from(user.passwordHash as string, "utf8"),
      disabled: user.status === "deactivated",
    }));

    const result = await firebaseAuth.importUsers(importRecords, {
      hash: { algorithm: "BCRYPT" },
    });

    console.log(
      `Batch ${i / BATCH_SIZE + 1}: ${result.successCount} succeeded, ${result.failureCount} failed`
    );
    totalSuccess += result.successCount;
    totalFailed += result.failureCount;

    if (result.failureCount > 0) {
      for (const failure of result.errors) {
        const failedUser = batch[failure.index];
        console.error(`  - ${failedUser.email}: ${failure.error.message}`);
      }
    }

    // Only mark the ones that actually succeeded as migrated, so a
    // re-run will retry anyone who failed.
    const failedIndexes = new Set(result.errors.map((e) => e.index));
    const succeeded = batch.filter((_, idx) => !failedIndexes.has(idx));
    await User.updateMany(
      { _id: { $in: succeeded.map((u) => u._id) } },
      [{ $set: { firebaseUid: { $toString: "$_id" } } }]
    );
  }

  console.log(`\nDone. ${totalSuccess} migrated, ${totalFailed} failed.`);
  if (totalFailed > 0) {
    console.log("Re-run this script to retry the ones that failed.");
  }

  await mongoose.disconnect();
  process.exit(totalFailed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
