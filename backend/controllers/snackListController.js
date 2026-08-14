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

    const { listName, rows } = req.body;

    if (!Array.isArray(rows)) {
      return res.status(400).json({
        message: "Rows must be an array.",
      });
    }

    // ===============================
    // CHECK IF THIS USER ALREADY
    // HAS A SNACK LIST
    // ===============================
    const existingSnackList = await SnackList.findOne({
      owner: ownerId,
    });

    // ===============================
    // CREATE SLUG ONLY ONCE
    // ===============================
    let slug = existingSnackList?.slug;

    if (!slug) {
      const baseSlug = listName
        .toLowerCase()
        .trim()
        .replace(/['’]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const randomPart = Math.random()
        .toString(36)
        .substring(2, 8);

      slug = `${baseSlug}-${randomPart}`;
    }

    // ===============================
    // SAVE / UPDATE SNACK LIST
    // ===============================
    const snackList = await SnackList.findOneAndUpdate(
      { owner: ownerId },
      {
        owner: ownerId,
        listName,
        slug,
       
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

    // Get the logged-in user's ID from the JWT
    const ownerId = req.user.userId;

    const snackList = await SnackList.findOne({
      owner: ownerId,
    });

    if (!snackList) {
      return res.status(200).json(null);
    }

    // Return the snack list INCLUDING the slug
    res.status(200).json({
      ...snackList.toObject(),
      slug: snackList.slug,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to load snack list.",
    });
  }
};






const getPublicSnackList = async (req, res) => {
  try {
    const client = req.params.client;
    const slug = req.params.slug;

    const db = await getTenantDB(client);

    const SnackList =
      db.models.SnackList ||
      db.model("SnackList", snackListSchema);

    const snackList = await SnackList.findOne({
      slug: slug,
    });

    if (!snackList) {
      return res.status(404).json({
        message: "Snack list not found.",
      });
    }

    res.status(200).json(snackList);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to load public snack list.",
    });
  }
};


// ===============================
// SEND SNACK REMINDER EMAILS
// SAME DAY + 3 DAYS BEFORE
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

    // Calculate the date 3 days from today
    const threeDaysFromNow = new Date(`${today}T00:00:00`);

    threeDaysFromNow.setDate(
      threeDaysFromNow.getDate() + 3
    );

    const threeDaysDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/New_York",
    }).format(threeDaysFromNow);

    console.log(
      "📅 Checking 3-day reminders for:",
      threeDaysDate
    );

    for (const snackList of snackLists) {
      for (const row of snackList.rows) {
        if (!row.email || !row.date) continue;

        console.log(
          `👀 ${row.parent}: ${row.date}`
        );

        // ===============================
        // SAME-DAY REMINDER
        // ===============================
        if (row.date === today) {
          console.log(
            `📧 Sending SAME-DAY reminder to ${row.parent} (${row.email})`
          );

          await sendReminderEmail({
            client,
            to: row.email,
            parentName: row.parent,
            studentName: row.student,
            snackDate: row.date,
            organizer: snackList.organizer,
            listName: snackList.listName,
            reminderType: "today",
          });

          console.log(
            `✅ Same-day reminder sent to ${row.email}`
          );
        }

        // ===============================
        // 3-DAY REMINDER
        // ===============================
        if (row.date === threeDaysDate) {
          console.log(
            `📧 Sending 3-DAY reminder to ${row.parent} (${row.email})`
          );

          await sendReminderEmail({
            client,
            to: row.email,
            parentName: row.parent,
            studentName: row.student,
            snackDate: row.date,
            organizer: snackList.organizer,
            listName: snackList.listName,
            reminderType: "threeDays",
          });

          console.log(
            `✅ 3-day reminder sent to ${row.email}`
          );
        }
      }
    }

    console.log("✅ Reminder job completed.");

  } catch (err) {
    console.error(
      "❌ Reminder job failed:",
      err
    );
  }
};

module.exports = {
  saveSnackList,
  getSnackList,
  getPublicSnackList,
  sendReminders,
};