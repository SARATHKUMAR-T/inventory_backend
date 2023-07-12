import express from "express";
import dbConnnection from "./database/db.js";
import { userRouter } from "./Routers/UserRouter.js";
import cors from "cors";
import { isAuthenticated } from "./Controllers/auth.js";
import { ItemRouter } from "./Routers/ItemsRouter.js";
import { customerRouter } from "./Routers/CustomerRouter.js";
import { salesRouter } from "./Routers/SalesRouter.js";
import { purchaseRouter } from "./Routers/PurchaseRouter.js";

// server
const app = express();

// middlewares
app.use(cors());

app.use(express.json());
// app.use(cors());
app.use(express.urlencoded({ extended: false }));

// connecting to DB
dbConnnection();

// listening to port
app.listen(process.env.PORT, () => {
  console.log("Server Started");
});

app.use("/api", userRouter);
app.use("/api",isAuthenticated, ItemRouter);
app.use("/api",isAuthenticated, customerRouter);
app.use("/api",isAuthenticated, salesRouter);
app.use("/api",isAuthenticated, purchaseRouter);

