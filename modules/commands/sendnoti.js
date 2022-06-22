module.exports.config = {
	name: "sendnoti",
	version: "1.0.1",
	hasPermssion: 2,
	credits: "Shiron",
	description: "Phiên Bản Vippro của sendnoti!",
	commandCategory: "Admin",
	usages: "[Text]",
	cooldowns: 0
};

module.exports.languages = {
	"vi": {
		"sendSuccess": "Đã gửi tin nhắn đến %1 nhóm!",
		"sendFail": "[!] Không thể gửi thông báo tới %1 nhóm"
	},
	"en": {
		"sendSuccess": "Sent message to %1 thread!",
		"sendFail": "[!] Can't send message to %1 thread"
	}
}

module.exports.run = async ({ api, event, args, getText }) => {
	if (event.type == "message_reply") {
		const request = global.nodemodule["request"];
		const fs = require('fs')
		const axios = require('axios')


		var getURL = await request.get(event.messageReply.attachments[0].url);

		var pathname = getURL.uri.pathname;

		var ext = pathname.substring(pathname.lastIndexOf(".") + 1);

		var path = __dirname + `/cache/snoti` + `.${ext}`;



		var abc = event.messageReply.attachments[0].url;
		let getdata = (await axios.get(`${abc}`, { responseType: 'arraybuffer' })).data;

		fs.writeFileSync(path, Buffer.from(getdata, 'utf-8'));


		var allThread = global.data.allThreadID || [];
		var count = 1,
			cantSend = [];
		for (const idThread of allThread) {
			if (isNaN(parseInt(idThread)) || idThread == event.threadID) ""
			else {
				api.sendMessage({ body: "» 𝑻𝒉𝒐̂𝒏𝒈 𝒃𝒂́𝒐 𝒕𝒖̛̀ 𝒄𝒉𝒖̉ 𝑩𝒐𝒕 «\n\n" + args.join(` `), attachment: fs.createReadStream(path) }, idThread, (error, info) => {
					if (error) cantSend.push(idThread);
				});
				count++;
				await new Promise(resolve => setTimeout(resolve, 500));
			}
		}
		return api.sendMessage(getText("sendSuccess", count), event.threadID, () => (cantSend.length > 0) ? api.sendMessage(getText("sendFail", cantSend.length), event.threadID, event.messageID) : "", event.messageID);

	}
	else {
		var allThread = global.data.allThreadID || [];
		var count = 1,
			cantSend = [];
		for (const idThread of allThread) {
			if (isNaN(parseInt(idThread)) || idThread == event.threadID) ""
			else {
				api.sendMessage("» FROM ADMIN «\n\n" + args.join(` `), idThread, (error, info) => {
					if (error) cantSend.push(idThread);
				});
				count++;
				await new Promise(resolve => setTimeout(resolve, 500));
			}
		}
		return api.sendMessage(getText("sendSuccess", count), event.threadID, () => (cantSend.length > 0) ? api.sendMessage(getText("sendFail", cantSend.length), event.threadID, event.messageID) : "", event.messageID);
	}
}