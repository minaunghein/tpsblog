const express = require("express");
const cors = require("cors");
const connectDB = require("./Config/db");
const errorHandler = require("./Utils/middleware/errorHandler");
const userRoute = require("./Routes/user");
const postRoute = require("./Routes/post");
const path = require("path");
const app = express();

app.use(express.json());
app.use(cors());

//connect mongodb
connectDB();
app.use(
  "/resources/images",
  express.static(path.join(__dirname, "resources/images"))
);
app.get("/", (req, res) => {
  res.send("Hello World...");
  
});

app.use("/api/user", userRoute);
app.use("/api/post", postRoute);

app.use(errorHandler);
 
const PORT = 5002;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
