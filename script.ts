import { db } from "./src/prisma/db";

async function main() {
  const user = await db.orm.user.where({ email: "existing@example.com" }).first();
  console.log(user);

  await db.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});