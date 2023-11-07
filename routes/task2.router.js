import express from "express";
import db from "../database/index.js";
import cookieParser from "cookie-parser";
import crypto from "crypto";
const router = express.Router();
router.use(cookieParser());

router.get("/", async (req, res, next) => {
  if (req.cookies.user) {
    const username = req.cookies.user.username;
    let token = await db.query("SELECT * FROM tokens WHERE username = $1", [
      username,
    ]);

    if (token.rows.length > 0) {
      token = token.rows[0].token;
    } else {
      token = undefined;
    }
    console.log(token);
    res.render("task2", {
      username: username,
      error: undefined,
      isLoggedIn: true,
      token: token,
    });
  } else {
    res.render("task2", {
      username: undefined,
      error: undefined,
      isLoggedIn: false,
      token: undefined,
    });
  }
});

async function clearCookiesAndLogout(res) {
  const username = res.req.cookies.user.username;
  const sql = "DELETE FROM tokens WHERE username = $1";
  try {
    await db.query(sql, [username]);
  } catch (err) {
    console.log(err);
  }
  res.clearCookie(Object.keys(res.req.cookies)); // Clear all cookies
  res.redirect("/task2"); // Redirect to the desired route after logging out
}

router.post("/logout", (req, res, next) => {
  clearCookiesAndLogout(res);
});

router.post("/login", async (req, res, next) => {
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
          res.cookie("user", { username });

          if (req.body.isSecure && req.body.isSecure == "on") {
            console.log("in safe");
            const token = username + password + new Date().toISOString();
            const hash = crypto.createHash("sha256");
            const hashedToken = hash.update(token).digest("hex");
            const sql_insert =
              "INSERT INTO tokens (username, token) VALUES ($1, $2)";
            await db.query(sql_insert, [username, hashedToken]);
          }

          userFound = true;
          res.redirect("/task2");
          break; // Exit the loop since we found a valid user
        } else {
          error += `Invalid combination for username: ${user.username}\n`;
        }
      }

      if (!userFound) {
        res.render("task2", {
          username: null,
          error: error,
          isSecure: true,
          isLoggedIn: false,
        });
      }
    } else {
      error = `Invalid combination for username: ${username}`;
      res.render("task2", {
        username: null,
        error: error,
        isSecure: true,
        isLoggedIn: false,
      });
    }
  } catch (err) {
    error = err;
    res.render("task2", {
      username: null,
      error: error,
      isSecure: true,
      isLoggedIn: false,
    });
  }
});

router.post("/change-password", async (req, res, next) => {
  const password = req.body.password;
  const confirm_password = req.body.confirm_password;
  const username = req.cookies.user.username;

  const token = req.body.token;
  const result = await db.query("SELECT * FROM tokens WHERE username = $1", [
    username,
  ]);
  let token_db = undefined;
  if (result.rows.length > 0) {
    token_db = result.rows[0].token;
  }

  if (token_db) {
    //secure, token postoji, ide secure prijava
    if (token === token_db) {
      const sql = "UPDATE users SET password = $1 WHERE username = $2";
      let error = "";
      if (password === confirm_password && username) {
        try {
          await db.query(sql, [password, username]);
          clearCookiesAndLogout(res);
        } catch (err) {
          error = err;
          res.redirect("/task2");
        }
      } else {
        console.log("Passwords do not match");
        res.render("task2", {
          username: username,
          token: token_db,
          error: "Passwords do not match",
          isLoggedIn: true,
        });
      }
    } else {
      //tokens do not match, redirect back
      console.log("Tokens do not match");
      clearCookiesAndLogout(res);
    }
  } else {
    //unsecure, nema tokena, moze se hakirati
    const sql = "UPDATE users SET password = $1 WHERE username = $2";
    let error = "";
    if (password === confirm_password && username) {
      try {
        await db.query(sql, [password, username]);
        clearCookiesAndLogout(res);
      } catch (err) {
        error = err;
        res.redirect("/task2");
      }
    } else {
      console.log("Passwords do not match");
      res.render("task2", {
        username: username,
        token: token_db,
        error: "Passwords do not match",
        isLoggedIn: true,
      });
    }
  }
});
export default router;
