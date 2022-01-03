import express from "express";
import { createServer } from "http";
import path from "path";
import { Server } from "socket.io";
import { onPlayerConnected, onPlayerDisconnected } from "./eventsFiltering.js";

const app = express();
const server = createServer(app);
export const io = new Server(server);
const __dirname = path.resolve();

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
app.use(express.static("public"));

io.on("connection", (socket) => {
    onPlayerConnected(socket);
    socket.on("disconnect", () => {
        onPlayerDisconnected(socket);
    });
    socket.on("receivePlayerPosition", (x, y) => {
        socket.broadcast.emit("setPlayerPosition", socket.id, x, y);
    });
});

server.listen(3000, () => {
    console.log("listening on *:3000");
});
