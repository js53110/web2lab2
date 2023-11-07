import express from "express";
import router from "./routes/router.js";
import task1router from "./routes/task1.router.js";
import task2router from "./routes/task2.router.js";
import lask2router from "./routes/lask2.router.js";

const app = express();
const port = 3000;

// Set the view engine to EJS
app.set("view engine", "ejs");

// Serve static files (e.g., styles, scripts)
app.use(express.static("public"));

// Use express.urlencoded middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Define a route that renders the EJS template
app.use("/", router);
app.use("/task1", task1router);
app.use("/task2", task2router);

app.use("/lask2", lask2router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
