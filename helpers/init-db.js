import dbConnect from "./db-connect";

export async function initializeDatabase() {
  try {
    await dbConnect();
    console.log("Database initialized successfully");
    return true;
  } catch (error) {
    console.error("Failed to initialize database:", error);
    return false;
  }
}

export default initializeDatabase;
