import express from "express";
import { addQuery, getUserQueries, getUserRelatedQueries } from "../controller/queryController.js";

const queryRouter = express.Router();

// Route for user registration
queryRouter.post("/post", addQuery);
queryRouter.get("/getUserQueries/:userId", getUserQueries);
queryRouter.get("/getUserRelatedQueries/:userId", getUserRelatedQueries);

export default queryRouter;