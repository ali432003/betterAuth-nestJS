import { PrismaClient } from "../../generated/prisma";

declare global {
  var prisma: PrismaClient;
}

const prisma = new PrismaClient({log:[ "warn"]});
global.prisma = prisma;

export const connectDB = async (retries = 3, delay = 2000) => {
    console.log("Connecting to database...");
    let attempts = 0;
  
    while (attempts < retries) {
      try {
        await prisma.$connect();
        console.log("✅ Connected to the database");
        return;
      } catch (err) {
        attempts++;
        console.error(`❌ Database connection failed (attempt ${attempts}/${retries}):`, err);
  
        if (attempts >= retries) {
          console.error("🚨 Max retries reached. Exiting process.");
          process.exit(1);
        }
  
        console.log(`⏳ Retrying in ${delay / 1000}s...`);
        await new Promise((res) => setTimeout(res, delay));
      }
    }
};
export const disconnectDB = async () => {
    try {
        await prisma.$disconnect();
        console.log("Disconnected from the database 🔴");
    } catch (error) {
        console.error("Error disconnecting from the database:", error);
    }
}

export default prisma;
