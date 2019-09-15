const mongoose = require("mongoose");
const config = require("config");

const db = config.get("mongoURI");

// Connect to the database
// Whenever used async rapit with try and catch
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify : false
    });
    // message when the database is successful connected
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    //Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
