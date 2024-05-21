const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

async function main() {
  await mongoose.connect(
    "mongodb+srv://manthanks0606:QfQSEbYXKrY3URWw@cluster0.ofrg2ob.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
}
main()
  .then(() => {
    console.log("DB connected succesfully");
  })
  .catch((err) => {
    console.log(err);
  });

// Initializing the DataBase
const initDB = async () => {
  await Listing.insertMany(initData.data);
  console.log("DataBase Initialized succesfully");
};

initDB();
