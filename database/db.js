import mongoose from "mongoose";

export function dbConnnection() {
  const params = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    mongoose.connect(
      "mongodb://sarath:9865713966@docdb-2024-04-24-10-41-30.cluster-cfmisyy248e7.us-east-1.docdb.amazonaws.com:27017/?tls=true&tlsCAFile=global-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false",
      params
    );
    console.log("Database connected successfully");
  } catch (error) {
    console.log("error connecting Db", error);
  }
}

export default dbConnnection;
