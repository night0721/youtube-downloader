import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", require("./download"));

app.listen(852, () => {
  console.log("Server running on port 852");
});

process.on("uncaughtException", err => {
  console.log(err);
});
