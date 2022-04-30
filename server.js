require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", ""],
    credentials: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// root routes
app.use("/user", require("./routes/userRouter"));
app.use("/api", require("./routes/categoryRoute"));
app.use("/api", require("./routes/divisionRoute"));
app.use("/api", require("./routes/districtRoute"));
app.use("/api", require("./routes/productRoute"));
app.use("/api/media", require("./routes/mediaRouter"));

const PORT = process.env.PORT;
const URI = process.env.MONGO_URI;

mongoose.connect(
  URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("DATABASE CONNECTED...");
  }
);

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNNING ON PORT ${PORT}`);
});
