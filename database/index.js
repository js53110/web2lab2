import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "web2lab2",
  password: "bazepodataka",
  port: 5432,
});

export default {
  query: (text, params) => {
    const start = Date.now();
    return pool.query(text, params).then((res) => {
      const duration = Date.now() - start;
      console.log("executed query", { text, params, duration, rows: res.rows });
      return res;
    });
  },
  pool: pool,
};
