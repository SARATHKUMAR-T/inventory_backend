import mongoose from "mongoose";

export function dbConnnection() {
  const params = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    mongoose.connect(
      "mongodb+srv://sarathkumartk98:z5Zcg0CPUOtktvr9@cluster0.ao98qkc.mongodb.net/?retryWrites=true&w=majority",
      params
    );
    console.log("Database connected successfully");
  } catch (error) {
    console.log("error connecting Db", error);
  }
}

export default dbConnnection;
