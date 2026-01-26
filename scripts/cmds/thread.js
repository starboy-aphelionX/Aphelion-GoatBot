const { getTime } = global.utils;

module.exports = {
	config: {
		name: "thread",
		version: "1.6",
		author: "Cid",
		countDown: 5,
		role: 2, // Bot Admin/Owner only
		description: "Manage group chats in the bot system",
		category: "owner",
		guide: "{pn} [find | -f] <name>: Search group\n"
			+ "{pn} [ban | -b] [tid] <reason>: Ban a group\n"
			+ "{pn} unban [tid]: Unban a group"
	},

	langs: {
		en: {
			noPermission: "⚡️ You don't have permission to use this feature",
			found: "🔎 Found %1 groups matching \"%2\":\n%3",
			notFound: "❌ No groups found matching: \"%1\"",
			hasBanned: "🚫 Group [%1] was already banned.\n» Reason: %2\n» Date: %3",
			banned: "✅ Banned group [%1].\n» Reason: %2\n» Date: %3",
			notBanned: "🛡️ Group [%1] is not banned.",
			unbanned: "🔓 Unbanned group [%1].",
			missingReason: "⚠️ Ban reason cannot be empty.",
			info: "\n╭──『 𝐓𝐇𝐑𝐄𝐀𝐃 𝐈𝐍𝐅𝐎 』\n│ ID: %1\n│ Name: %2\n│ Memb: %4 (M: %5 | F: %6)\n│ Msgs: %7\n╰───────────◊"
		}
	},

	onStart: async function ({ args, threadsData, message, role, event, getLang }) {
		if (role < 2) return message.reply(getLang("noPermission"));
		const type = args[0]?.toLowerCase();

		switch (type) {
			// --- FIND / SEARCH ---
			case "find":
			case "search":
			case "-f":
			case "-s": {
				let allThread = await threadsData.getAll();
				let keyword = args.slice(1).join(" ");
				
				// Optional: Filter by groups the bot is still currently in
				if (['-j', '-join'].includes(args[1])) {
					allThread = allThread.filter(t => t.members.some(m => m.userID == global.GoatBot.botID && m.inGroup));
					keyword = args.slice(2).join(" ");
				}

				const result = allThread.filter(item => 
					(item.threadName || "Unnamed").toLowerCase().includes(keyword.toLowerCase())
				);

				if (result.length === 0) return message.reply(getLang("notFound", keyword));

				const resultText = result.map(t => `╭──『 ${t.threadName || "Unnamed"} 』\n╰ ID: ${t.threadID}`).join("\n");
				return message.reply(getLang("found", result.length, keyword, resultText));
			}

			// --- BAN THREAD ---
			case "ban":
			case "-b": {
				let tid, reason;
				// Check if the second argument is a Thread ID (number)
				if (!isNaN(args[1])) {
					tid = args[1];
					reason = args.slice(2).join(" ");
				} else {
					// If not a number, use current thread ID
					tid = event.threadID;
					reason = args.slice(1).join(" ");
				}

				if (!reason) return message.reply(getLang("missingReason"));

				const threadData = await threadsData.get(tid);

				if (threadData.banned?.status) {
					return message.reply(getLang("hasBanned", tid, threadData.banned.reason, threadData.banned.date));
				}

				const time = getTime("DD/MM/YYYY HH:mm:ss");
				await threadsData.set(tid, {
					banned: { status: true, reason, date: time }
				});

				return message.reply(getLang("banned", tid, reason, time));
			}

			// --- UNBAN THREAD ---
			case "unban":
			case "-u": {
				let tid = !isNaN(args[1]) ? args[1] : event.threadID;
				const threadData = await threadsData.get(tid);

				if (!threadData.banned?.status) {
					return message.reply(getLang("notBanned", tid));
				}

				await threadsData.set(tid, {
					banned: { status: false, reason: null, date: null }
				});

				return message.reply(getLang("unbanned", tid));
			}

			default:
				return message.reply("💡 Usage: thread [find | ban | unban] [details]");
		}
	}
};
