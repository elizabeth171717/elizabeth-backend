const getTenantDB = require("../utils/getTenantDB");
const snackListSchema = require("../models/SnackList");

const sendReminderEmail = require("../utils/sendReminderEmail");
// ===============================
// SAVE / UPDATE SNACK LIST
// ===============================
const saveSnackList = async (req, res) => {
  try {
    const client = req.params.client;

    const db = await getTenantDB(client);

    const SnackList =
      db.models.SnackList ||
      db.model("SnackList", snackListSchema);

const ownerId = req.user.userId;

const { listName, organizer, rows } = req.body;

if (!Array.isArray(rows)) {
  return res.status(400).json({
    message: "Rows must be an array.",
  });
}

const snackList = await SnackList.findOneAndUpdate(
  { owner: ownerId },
  {
    owner: ownerId,
    listName,
    organizer,
    rows,
  },
  {
    new: true,
    upsert: true,
  }
);

res.status(200).json(snackList);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to save snack list.",
    });
  }
};


// ===============================
// GET SNACK LIST
// ===============================
const getSnackList = async (req, res) => {
  try {
    const client = req.params.client;

    const db = await getTenantDB(client);

    const SnackList =
      db.models.SnackList ||
      db.model("SnackList", snackListSchema);

    // ✅ Get the logged-in user's ID from the JWT
    const ownerId = req.user.userId;

    const snackList = await SnackList.findOne({
      owner: ownerId,
    });

    if (!snackList) {
      return res.status(200).json(null);
    }

    res.status(200).json(snackList);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to load snack list.",
    });
  }
};


// ===============================
// SEND TODAY'S REMINDER EMAILS
// ===============================
// ===============================
// SEND TODAY'S REMINDER EMAILS
// ===============================
const sendReminders = async () => {
  try {
    const client = "snacks";

    const db = await getTenantDB(client);

    const SnackList =
      db.models.SnackList ||
      db.model("SnackList", snackListSchema);

    // Get every snack list
    const snackLists = await SnackList.find();

    // Today's date in Atlanta timezone
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/New_York",
    }).format(new Date());

    console.log("📅 Today's date:", today);

    for (const snackList of snackLists) {
      for (const row of snackList.rows) {
        if (!row.email || !row.date) continue;

        // row.date is already stored as YYYY-MM-DD
        console.log(`👀 ${row.parent}: ${row.date}`);

        // Skip if today's date doesn't match
        if (row.date !== today) continue;

        console.log(
          `📧 Sending reminder to ${row.parent} (${row.email})`
        );

        await sendReminderEmail({
          client,
          to: row.email,
          parentName: row.parent,
          studentName: row.student,
          snackDate: row.date,
          organizer: snackList.organizer,
          listName: snackList.listName,
        });

        console.log(`✅ Reminder sent to ${row.email}`);
      }
    }

    console.log("✅ Daily reminder job completed.");
  } catch (err) {
    console.error("❌ Daily reminder job failed:", err);
  }
};


module.exports = {
  saveSnackList,
  getSnackList,
  sendReminders,
};