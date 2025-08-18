import "dotenv/config";
import "./config/passport.config";
import express, { NextFunction, Request, Response } from "express";
import { Env } from "./config/env.config";
import cors from "cors";
import passport from "passport";
import { HTTPSTATUS } from "./config/http.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { BadRequestException } from "./utils/app-error";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import connectDatabase from "./config/database.config";
import authRoutes from "./routes/auth.route";
import { passportAuthenticateJwt } from "./config/passport.config";
import userRoutes from "./routes/user.route";

const app = express();
const BASE_PATH = Env.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use(
  cors({
    origin: Env.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    throw new BadRequestException("Hmmmm");
    res.status(HTTPSTATUS.OK).json({ message: "Hello Hire Me" });
  })
);

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, passportAuthenticateJwt, userRoutes);

app.use(errorHandler);

app.listen(Env.PORT, async () => {
  await connectDatabase();
  console.log(`Server is running on port ${Env.PORT} in ${Env.NODE_ENV} mode`);
});
