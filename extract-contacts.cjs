const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
} = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const fs = require("fs");
const path = require("path");

async function extractGroupContacts() {
  console.log("🔄 Connecting to WhatsApp...");

  // Path to your WhatsApp session
  const authPath = path.join(
    process.env.USERPROFILE || process.env.HOME || "C:\\Users\\user",
    ".openclaw",
    "whatsapp",
    "default",
  );
  console.log(`📂 Auth path: ${authPath}`);

  const { state, saveCreds } = await useMultiFileAuthState(authPath);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    console.log(`📡 Connection status: ${connection}`);

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error instanceof Boom
          ? lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut
          : false;

      console.log("❌ Connection closed");
      if (!shouldReconnect) {
        console.log("Not reconnecting - logged out");
        process.exit(1);
      }
    } else if (connection === "open") {
      console.log("✅ Connected to WhatsApp\n");

      try {
        // Fetch all groups
        console.log("📥 Fetching groups...");
        const groups = await sock.groupFetchAllParticipating();

        console.log(`Found ${Object.keys(groups).length} groups\n`);

        // Find your specific group
        const targetGroup = Object.values(groups).find(
          (group) =>
            group.subject.toUpperCase().includes("BANGALORE") &&
            group.subject.toUpperCase().includes("MIZORAM"),
        );

        if (!targetGroup) {
          console.log("❌ Group not found!");
          console.log("\n📋 Available groups:");
          Object.values(groups).forEach((g) => console.log(`  - ${g.subject}`));
          process.exit(0);
        }

        console.log(`📱 Found group: ${targetGroup.subject}`);
        console.log(`👥 Total participants: ${targetGroup.participants.length}\n`);

        // Extract participant details
        const contacts = targetGroup.participants.map((p) => ({
          number: p.id.split("@")[0],
          isAdmin: p.admin === "admin" || p.admin === "superadmin",
          role: p.admin || "member",
        }));

        // Display contacts
        console.log("📞 Contacts:\n");
        contacts.forEach((contact, index) => {
          console.log(`${index + 1}. +${contact.number} (${contact.role})`);
        });

        // Save to file
        const outputFile = "group-contacts.json";
        fs.writeFileSync(
          outputFile,
          JSON.stringify(
            {
              groupName: targetGroup.subject,
              groupId: targetGroup.id,
              totalParticipants: contacts.length,
              extractedAt: new Date().toISOString(),
              contacts: contacts,
            },
            null,
            2,
          ),
        );

        console.log(`\n✅ Contacts saved to ${outputFile}`);

        // Also save as CSV
        const csvFile = "group-contacts.csv";
        const csvContent =
          "Number,Role,IsAdmin\n" +
          contacts.map((c) => `+${c.number},${c.role},${c.isAdmin}`).join("\n");
        fs.writeFileSync(csvFile, csvContent);

        console.log(`✅ Contacts saved to ${csvFile}`);

        process.exit(0);
      } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
      }
    }
  });
}

extractGroupContacts().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});
