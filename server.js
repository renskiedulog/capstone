import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  ``;
  io.on("connection", (socket) => {
    socket.on("tellerRefresh", (data) => {
      io.emit("tellerRefresh", data);
    });

    socket.on("newActivity", (data) => {
      io.emit("newActivity", data);
    });
  });

  httpServer
    .once("error", (err) => {
      process.exit(1);
    })
    .listen(port, async () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
