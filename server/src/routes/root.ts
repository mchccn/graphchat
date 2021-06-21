import { Router } from "express";
import auth from "./auth";

const root = Router();

root.use("/auth", auth);

export default root;
