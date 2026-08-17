// import express, { type Express } from "express";
// import cors from "cors";
// import notificationsRouter from './routes/notifications';
// import pinoHttp from "pino-http";
// import router from "./routes";
// import { logger } from "./lib/logger";


// const app: Express = express();

// app.use(
//   pinoHttp({
//     logger,
//     serializers: {
//       req(req) {
//         return {
//           id: req.id,
//           method: req.method,
//           url: req.url?.split("?")[0],
//         };
//       },
//       res(res) {
//         return {
//           statusCode: res.statusCode,
//         };
//       },
//     },
//   }),
// );
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use('/api/notifications', notificationsRouter);
// app.get("/hello", (req, res) => {
//   res.send("Hello Backend");
// });

// // app.use("/api", router);
// app.use("/", router);
// app.use("/api", router);
// export default app;
// backend/src/app.ts
import express, { type Express } from "express";
import cors from "cors";
import notificationsRouter from './routes/notifications';
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Register notifications route
console.log('📬 Registering notifications route at /api/notifications');
app.use('/api/notifications', notificationsRouter);

app.get("/hello", (req, res) => {
  res.send("Hello Backend");
});

// These should be AFTER specific routes
app.use("/", router);
app.use("/api", router);

export default app;