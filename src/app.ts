import express, { Application } from "express";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });
import colors from "colors";
import cors from "cors";

import db from "./config/db";
import usersRoute from "./routes/Auth/user";
import authRoute from "./routes/Auth/auth";
import todoRoute from "./routes/Todos/todos";

const app: Application = express();

app.use(express.json());
app.use(cors());

db();

app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/todo", todoRoute);

const PORT: number = parseInt(process.env.PORT!) || 5000;
app.listen(PORT, () =>
  console.log(colors.bgBlue(`Server running on port:${PORT}`))
);
