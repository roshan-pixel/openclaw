// scrape-contacts.js
const fs = require("fs");
const path = require("path");

async function scrapeContacts() {
  try {
    const sessionPath = path.join(
      process.env.USERPROFILE || process.env.HOME,
      ".openclaw",
      "whatsapp-sessions",
    );

    console.log("🦞 Scraping WhatsApp contacts...\n");

    const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");

    const { state } = await useMultiFileAuthState(sessionPath);
    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
    });

    const contacts = (await sock.store?.contacts) || {};

    const contactList = Object.entries(contacts).map(([jid, contact]) => ({
      number: jid.split("@")[0],
      name: contact.name || contact.notify || "Unknown",
      jid: jid,
    }));

    fs.writeFileSync("whatsapp-contacts.json", JSON.stringify(contactList, null, 2));

    console.log("✅ Found " + contactList.length + " contacts");
    console.log("📁 Saved to: whatsapp-contacts.json\n");

    contactList.forEach((contact) => {
      console.log(contact.name + ": " + contact.number);
    });

    await sock.logout();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error scraping contacts:", error.message);
    process.exit(1);
  }
}

void scrapeContacts();
