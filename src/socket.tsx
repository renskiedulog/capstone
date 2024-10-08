"use client";
import { io } from "socket.io-client";

const socket = io({
  transports: ["polling"],
});

export default socket;
