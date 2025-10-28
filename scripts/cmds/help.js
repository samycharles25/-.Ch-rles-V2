const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "2.0-charles",
    author: "さꜛ.Chαrles ꜝꜝ ぐ・",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Affiche le panneau d’aide stylé 🌙" },
    longDescription: { en: "Affiche les commandes du bot avec un style luxueux et organisé." },
    category: "info",
    guide: { en: "{p}help [nom_commande]" },
  },

  onStart: async function ({ message, args, event, role }) {
    const { threadID, senderID } = event;
    const prefix = await getPrefix(threadID);
    const userName = event.senderName || "Utilisateur inconnu";

    if (args.length === 0) {
      // 🧭 Liste de toutes les commandes par catégorie
      const categories = {};
      for (const [name, value] of commands) {
        if (value.config.role > role) continue;
        const category = value.config.category || "Autres";
        if (!categories[category]) categories[category] = [];
        categories[category].push(name);
      }

      let msg = "";
      msg += `╔   〔   さꜛ.Chαrles ꜝꜝ ぐ・ 𓆩ꨄ︎𓆪 〕   ╗\n`;
      msg += `👋 𝗛𝗲𝗹𝗹𝗼, **${userName}** !\n`;
      msg += `╚═════════════════════════╝\n`;
      msg += `╭─「 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 𝗣𝗔𝗡𝗘𝗟 」\n`;
      msg += `│🔹 𝗣𝗿𝗲𝗳𝗶𝘅 : ${prefix}\n`;
      msg += `│🔹 𝗢𝘄𝗻𝗲𝗿 : SamyCharles\n`;
      msg += `│🔹 𝗩𝗲𝗿𝘀𝗶𝗼𝗻 : 2.0.0\n`;
      msg += `│🔹 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝗲𝘀 : ${commands.size}\n`;
      msg += `╰─────────────●●►\n\n`;

      for (const category of Object.keys(categories).sort()) {
        msg += `╭──❖『 ${category.toUpperCase()} 』❖──╮\n`;
        for (const cmd of categories[category].sort()) {
          msg += `│ 💫 ${cmd}\n`;
        }
        msg += `╰─────────────────────╯\n\n`;
      }

      msg += `┋ ᴍᴀᴅᴇ ʙʏ さꜛ.Chαrles ꜝꜝ ぐ・𓆩ꨄ︎𓆪`;

      await message.reply(msg);
    } else {
      // 📘 Aide sur une commande spécifique
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) return message.reply(`❌ Commande "${commandName}" introuvable.`);

      const c = command.config;
      const usage = (c.guide?.en || "").replace(/{p}/g, prefix).replace(/{n}/g, c.name);

      const detail = 
`╔══『 ℹ️ 𝗜𝗡𝗙𝗢 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗘 』══╗
🌿 Nom : ${c.name}
💠 Description : ${c.longDescription?.en || "Aucune description"}
🪷 Alias : ${c.aliases?.join(", ") || "Aucun"}
📀 Version : ${c.version || "1.0"}
👑 Rôle : ${roleTextToString(c.role)}
🕰️ Cooldown : ${c.countDown || 2}s
💫 Auteur : ${c.author || "Inconnu"}
📘 Usage : ${usage}
╚════════════════════════════╝`;

      await message.reply(detail);
    }
  }
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0: return "👤 Tous les utilisateurs";
    case 1: return "👑 Admins de groupe";
    case 2: return "⚙️ Admins du bot";
    default: return "🌫️ Rôle inconnu";
  }
}
