const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./App");

//CONNECT TO MONGODB ONLINE
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connection Succesful"));

//START A SERVER
const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
  console.log(`Server running on ${port}...`);
});
