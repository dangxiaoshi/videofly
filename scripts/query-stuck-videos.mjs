import dotenv from "dotenv";
import postgres from "postgres";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const sql = postgres(process.env.DATABASE_URL, {
  ssl: "require",
  connect_timeout: 5,
  idle_timeout: 5,
  max: 1,
});

try {
  const rows = await sql`
    select
      uuid,
      status,
      provider,
      "externalTaskId",
      "createdAt",
      "updatedAt"
    from videos
    where status in ('PENDING', 'GENERATING', 'UPLOADING')
    order by "createdAt" desc
    limit 10
  `;

  console.log(JSON.stringify(rows, null, 2));
} finally {
  await sql.end();
}
