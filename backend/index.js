const express = require("express");
const cors = require("cors");
const JWT_SECRET = require("./config")
const PORT = 3000


const app = express();

app.use(cors());
app.use(express.json());

const mainRouter = require("./routes/index");

app.use("/api/v1", mainRouter);

app.listen(PORT, () => console.log("Server listening on Port ",PORT))

