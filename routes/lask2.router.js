import express from "express";
const router = express.Router();

router.get("/coupon", (req, res, next) => {
  res.render("lask2");
});

export default router;
