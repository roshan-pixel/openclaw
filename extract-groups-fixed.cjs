const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const fs = require("fs");
const path = require("path");
const P = require("pino");

async function extractGroupContacts() {
  console.log("🔄 Connecting to WhatsApp...");

  const authPath = path.join(process.env.USERPROFILE, ".openclaw", "whatsapp", "default");
  console.log(`📂 Auth path: ${authPath}`);

  if (!fs.existsSync(authPath)) {
    console.log("❌ Auth folder not found!");
    return;
  }

  const { state, saveCreds } = await useMultiFileAuthState(authPath);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    logger: P({ level: "silent" }), // Suppress Baileys logs
    browser: ["OpenClaw", "Chrome", "1.0.0"],
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("\n⚠️  Session expired! You need to scan QR code again.");
      console.log("Please restart the gateway and run: node dist/index.js channels login");
      process.exit(1);
    }

    if (connection === "close") {
      const statusCode =
        lastDisconnect?.error instanceof Boom ? lastDisconnect.error.output.statusCode : 0;

      console.log(`\n❌ Connection closed (code: ${statusCode})`);

      if (statusCode === DisconnectReason.loggedOut) {
        console.log("You have been logged out. Please re-link WhatsApp.");
      }
      process.exit(1);
    } else if (connection === "open") {
      console.log("✅ Connected to WhatsApp!\n");

      try {
        console.log("📥 Fetching all groups...");
        const groups = await sock.groupFetchAllParticipating();
        const groupList = Object.values(groups);

        console.log(`Found ${groupList.length} total groups\n`);

        // Find the target group
        const targetGroup = groupList.find(
          (group) =>
            group.subject &&
            (group.subject.toUpperCase().includes("BANGALORE") ||
              group.subject.toUpperCase().includes("MIZORAM") ||
              group.subject.toUpperCase().includes("AWPL") ||
              group.subject.toUpperCase().includes("FIGHTERS")),
        );

        if (!targetGroup) {
          console.log("❌ Target group not found!\n");
          console.log("📋 Available groups:");
          groupList.forEach((g, i) => console.log(`  ${i + 1}. ${g.subject}`));
          process.exit(0);
        }

        console.log(`📱 Found group: "${targetGroup.subject}"`);
        console.log(`👥 Total participants: ${targetGroup.participants.length}\n`);

        // Extract contacts
        const contacts = targetGroup.participants.map((p) => ({
          number: p.id.replace("@s.whatsapp.net", ""),
          isAdmin: ["admin", "superadmin"].includes(p.admin),
          role: p.admin || "member",
        }));

        // Display
        console.log("📞 Contacts:\n");
        contacts.forEach((c, i) => {
          const role = c.isAdmin ? "👑 " + c.role : "   " + c.role;
          console.log(`${String(i + 1).padStart(3)}. +${c.number.padEnd(15)} (${role})`);
        });

        // Save JSON
        const result = {
          groupName: targetGroup.subject,
          groupId: targetGroup.id,
          totalParticipants: contacts.length,
          extractedAt: new Date().toISOString(),
          contacts: contacts,
        };

        fs.writeFileSync("group-contacts.json", JSON.stringify(result, null, 2));
        console.log(`\n✅ Saved to: group-contacts.json`);

        // Save CSV
        const csv =
          "Number,Role,IsAdmin\n" +
          contacts.map((c) => `+${c.number},${c.role},${c.isAdmin}`).join("\n");
        fs.writeFileSync("group-contacts.csv", csv);
        console.log(`✅ Saved to: group-contacts.csv`);

        process.exit(0);
      } catch (error) {
        console.error("\n❌ Error fetching groups:", error.message);
        process.exit(1);
      }
    }
  });

  // Timeout after 30 seconds
  setTimeout(() => {
    console.log("\n⏱️  Connection timeout - session may be invalid");
    console.log("Try re-linking WhatsApp: node dist/index.js channels login");
    process.exit(1);
  }, 30000);
}

extractGroupContacts().catch((err) => {
  console.error("❌ Fatal error:", err.message);
  process.exit(1);
});
