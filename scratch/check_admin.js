const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:f49YacyrwGrHDi5REIirX7w9TMByR4Dx@185.207.107.58:5432/postgres'
});

async function run() {
  await client.connect();
  const res = await client.query(`
    SELECT au.*, au.role 
    FROM auth.users au 
    WHERE au.email = 'baritoutara@kemenag.go.id'
  `);
  console.log("Auth user:", res.rows);
  
  if (res.rows.length > 0) {
    const userId = res.rows[0].id;
    const adminRes = await client.query(`
      SELECT * FROM kemenag_website.admin_users 
      WHERE user_id = $1
    `, [userId]);
    console.log("Admin user:", adminRes.rows);
  }
  await client.end();
}

run().catch(console.error);
