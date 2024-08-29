const mongoose = require("mongoose");

async function mongoConnection(url) {
  mongoose
    .connect(url)
    .then(() => {
      console.log("Mongodb Connected!");
    })
    .catch((error) => {
      console.log("Failed to connect mongodb!!", error);
    });
}

module.exports = { mongoConnection };
