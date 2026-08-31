
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

// 👇 NEW — handle EADDRINUSE explicitly instead of letting it crash
// silently as an unhandled 'error' event. This also logs clearly
// WHICH process/port collided, useful if this happens again.
server.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    logger.error(
      { port },
      "Port already in use — a previous process likely didn't shut down cleanly. Exiting so the platform can retry.",
    );
  } else {
    logger.error({ err }, "Server error");
  }
  process.exit(1);
});

// 👇 NEW — graceful shutdown on Render's restart/redeploy signal.
// Without this, the old process can keep holding the port for a
// moment after Render sends SIGTERM, causing the NEW process's
// app.listen() to fail with EADDRINUSE (the exact error seen in logs).
const shutdown = (signal: string) => {
  logger.info({ signal }, "Shutdown signal received, closing server gracefully");
  server.close((err) => {
    if (err) {
      logger.error({ err }, "Error during graceful shutdown");
      process.exit(1);
    }
    logger.info("Server closed cleanly");
    process.exit(0);
  });

  // Safety net — if close() hangs (e.g. a lingering open connection),
  // force-exit after 10s instead of leaving a zombie process behind.
  setTimeout(() => {
    logger.warn("Forcing shutdown after timeout");
    process.exit(1);
  }, 10_000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));