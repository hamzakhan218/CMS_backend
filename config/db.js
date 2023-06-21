const mongoose = require("mongoose");

const connectDB = async () => {
  return (
    mongoose
      // .connect("mongodb://127.0.0.1/contact_management_system")
      .connect(
        "mongodb+srv://hamzabashir218:hamzabashir218@cluster0.fcc9y2i.mongodb.net/?retryWrites=true&w=majority"
      )
      .then(() => console.log("Connection to database is established"))
      .catch((error) => console.log(error))
  );
};

module.exports = connectDB;
