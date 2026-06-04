import express from "express";
import cors from "cors";
import { requestIdMiddleware } from "./middleware/requestId.middleware";
import { loggerMiddleware } from "./middleware/logger.middleware";
import studentRoutes from "./routes/student.routes";
import { errorMiddleware } from "./middleware/error.middleware";
const app: express.Application = express();

app.use(requestIdMiddleware);
app.use(loggerMiddleware);
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.use('/students', studentRoutes);

app.use(errorMiddleware);

export default app;