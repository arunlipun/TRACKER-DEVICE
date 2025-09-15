import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

// Static files serve
app.use(express.static(path.join(__dirname, "public")));

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get("/", (req, res) => {
    res.render("index");
});

// Socket.io
io.on("connection", (socket) => {
    console.log("user connected", socket.id);

    socket.on("send-location", (data) => {
        io.emit("receive-location", { id: socket.id, ...data });
    });

    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.id);
    });
});


server.listen(3220, "0.0.0.0", () => {
  console.log("Server running at http://localhost:3220");
});

// const PORT = process.env.PORT || 3220; // Render ke liye dynamic, local ke liye 3220
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
