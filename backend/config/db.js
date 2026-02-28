const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",        // your pg username
  host: "localhost",
  database: "swachhsetu",  // we will create this DB
  password: "pallu123",
  port: 5432,
});

module.exports = pool;