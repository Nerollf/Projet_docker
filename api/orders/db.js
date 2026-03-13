const { Pool } = require("pg");

const pool = new Pool({
  connrectionString: "postgresql://postgres:password@db:5432/postgres",
});

module.exports = pool;
