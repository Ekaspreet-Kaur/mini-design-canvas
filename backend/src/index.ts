import mongoose from "mongoose";
import { app } from "./app";
import { env } from "./config/env";

async function startServer() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("MongoDB connected");

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

void startServer();
