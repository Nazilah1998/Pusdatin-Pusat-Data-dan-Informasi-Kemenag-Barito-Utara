const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:f49YacyrwGrHDi5REIirX7w9TMByR4Dx@185.207.107.58:5432/postgres'
});

async function run() {
  await client.connect();
  const res = await client.query(`
    SELECT * FROM kemenag_website.admin_users LIMIT 5;
  `);
  console.log(res.rows);
  await client.end();
}

run().catch(console.error);
