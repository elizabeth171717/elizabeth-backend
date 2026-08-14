const cron = require("node-cron");
const { sendReminders } = require("../controllers/snackListController");

cron.schedule(
  
    "10 11 * * *",
  async () => {
    console.log("⏰ Running daily snack reminder job...");

    try {
      await sendReminders();
      console.log("✅ Daily reminder job finished.");
    } catch (err) {
      console.error("❌ Daily reminder job failed:", err);
    }
  },
  {
    timezone: "America/New_York",
  }
);