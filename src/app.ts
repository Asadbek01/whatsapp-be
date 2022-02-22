
import express from "express";

import usersRouter from "./services/users/index"

const server = express();

process.env.TS_NODE_DEV && require("dotenv").config();

server.use(express.json());

// cors middleware's
// server.use(cors);

// Endpoints
server.use("/users", usersRouter );
// server.use('/)
export { server };