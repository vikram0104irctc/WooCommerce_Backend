import cron from "node-cron";
import { PeriodicIngestion } from "../../utils/periodicingestion.js";

class IngestionCronJobClass {
  start() {
    // Schedule to run every 5 minutes
    cron.schedule("*/5 * * * *", async () => {
      try {
        console.log("Running scheduled product ingestion...");
        PeriodicIngestion.periodicIngestionProducts();
      } catch (error) {
        console.error("Cron job error:", error.message);
      }
    });

    console.log("Product ingestion cron job started (runs every 5 minutes)");
  }
}

export const IngestionCronJob = new IngestionCronJobClass();
