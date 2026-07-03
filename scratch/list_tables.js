const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:f49YacyrwGrHDi5REIirX7w9TMByR4Dx@185.207.107.58:5432/postgres'
});

async function run() {
  await client.connect();
  const res = await client.query(`
    SELECT table_schema, table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
       OR table_schema = 'pusdatin'
  `);
  console.log(res.rows);
  await client.end();
}

run().catch(console.error);
