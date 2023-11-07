import express from "express";
const router = express.Router();
import db from "../database/index.js";

router.get("/", async (req, res, next) => {
  res.render("task1", {
    username: undefined,
    error: undefined,
    isSecure: true,
  });
});

router.post("/unsecure", async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const sql = `SELECT * FROM users WHERE username = '${username}'`;
  let error = "";

  try {
    const result = await db.query(sql, []);
    const users = result.rows;

    if (users.length > 0) {
      let userFound = false;

      for (let user of users) {
        if (user.username === username && user.password === password) {
          userFound = true;
          res.render("task1", { username: user.username, isSecure: false });
          break; // Exit the loop since we found a valid user
        } else {
          error += `Invalid combination for username: ${user.username}\n`;
        }
      }

      if (!userFound) {
        res.render("task1", {
          username: null,
          error: error,
          isSecure: false,
        });
      }
    } else {
      error = `Invalid combination for username: ${username}`;
      res.render("task1", { username: null, error: error, isSecure: false });
    }
  } catch (err) {
    error = err;
    res.render("task1", { username: null, error: error, isSecure: false });
  }
});

router.post("/secure", async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const sql = "SELECT * FROM users WHERE username = $1";
  let error = "";

  try {
    const result = await db.query(sql, [username]);
    const users = result.rows;

    if (users.length > 0) {
      let userFound = false;

      for (let user of users) {
        if (user.username === username && user.password === password) {
          userFound = true;
          res.render("task1", { username: user.username, isSecure: true });
          break; // Exit the loop since we found a valid user
        } else {
          error += `Invalid combination for username: ${user.username}\n`;
        }
      }

      if (!userFound) {
        res.render("task1", {
          username: null,
          error: error,
          isSecure: true,
        });
      }
    } else {
      error = `Invalid combination for username: ${username}`;
      res.render("task1", { username: null, error: error, isSecure: true });
    }
  } catch (err) {
    error = err;
    res.render("task1", { username: null, error: error, isSecure: true });
  }
});

export default router;
