import express from "express";
const router = express.Router();
import db from "../database/index.js";

router.get("/", (req, res) => {
  res.render("index");
});

router.post("/reset-passwords", async (req, res) => {
  const sql = `UPDATE USERS
  SET password = 
      CASE 
          WHEN username = 'Bob' THEN 'teardrop01'
          WHEN username = 'Michael' THEN 'bulls1991'
          WHEN username = 'Leo' THEN 'goat10'
          WHEN username = 'Alice' THEN 'sunshine02'
      END
  WHERE username IN ('Bob', 'Michael', 'Leo', 'Alice');
  `;
  try {
    const result = await db.query(sql, []);
    console.log(result);
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.redirect(500, "/");
  }
});

export default router;
