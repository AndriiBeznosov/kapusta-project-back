require("dotenv").config();

const app = require("./src/app");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const { URL_DB_MONGODB, PORT } = process.env;

app.listen(PORT, () => {
  console.log("Server running. Use our API on port: 3000");
  mongoose
    .connect(URL_DB_MONGODB)
    .then(() => console.log("DB OK"))
    .catch((err) => console.error("DB error", err));
});
