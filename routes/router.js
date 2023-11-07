import express from "express";
const router = express.Router();
import db from "../database/index.js";

router.get("/", (req, res) => {
  res.render("index");
});

export default router;
