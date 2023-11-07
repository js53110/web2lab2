import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  user: "web2lab2",
  host: "dpg-cl51ess72pts739pbrbg-a",
  database: "web2lab2_m4n1",
  password: "DOZu47OQr8GMDaJDGNNULANL9ZRD4m6V",
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
