const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT;
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());  


mongoose
  .connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  
  })
  .catch((error) => console.log(error.message));



// Serve images from the images directory
app.use('/uploads', express.static(__dirname + '/uploads'));
const userRouter = require("./routes/user.routes");
const movieRoute = require('./routes/movie.routes');


app.use('/api/movie', movieRoute);
app.use("/api/user", userRouter);
app.get('', function (req, res) {
  res.send("hi");
}
  )
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});