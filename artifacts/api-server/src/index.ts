
// import "dotenv/config";
// import app from "./app";
// import { logger } from "./lib/logger";

// const rawPort = process.env["PORT"];

// if (!rawPort) {
//   throw new Error(
//     "PORT environment variable is required but was not provided.",
//   );
// }

// const port = Number(rawPort);

// if (Number.isNaN(port) || port <= 0) {
//   throw new Error(`Invalid PORT value: "${rawPort}"`);
// }

// app.listen(port, (err) => {
//   if (err) {
//     logger.error({ err }, "Error listening on port");
//     process.exit(1);
//   }

//   logger.info({ port }, "Server listening");
// });
import "dotenv/config";
import app from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const server = app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});

// Graceful shutdown - old process port-a properly release pannum
const shutdown = (signal: string) => {
  logger.info({ signal }, "Shutdown signal received, closing server");
  server.close((err) => {
    if (err) {
      logger.error({ err }, "Error during shutdown");
      process.exit(1);
    }
    logger.info("Server closed gracefully");
    process.exit(0);
  });

  // Force exit if it hangs more than 10s
  setTimeout(() => {
    logger.warn("Forcing shutdown after timeout");
    process.exit(1);
  }, 10000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));