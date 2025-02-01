const fs = require("fs-extra")
const axios = require("axios")
module.exports = {
	config: {
		name: "pinterest",
    aliases: ["pint","Pint"],
		version: "1.1",
		author: "Loid Butter",
		countDown: 5,
		role: 0,
		shortDescription: {
			vi: "Img Search",
			en: "Img Search"
		},
		longDescription: {
			uid: "Pinterest Search",
			en: "Pinterest Search"
		},
		category: "images search",
		guide: {
			vi: "   {pn}: enter in the format, example: Pinterest Naruto - 10 (it depends on you how many images you want to appear in the result)",
			en: "   {pn}: enter in the format, example: Pinterest Naruto - 10 (it depends on you how many images you want to appear in the result)"
		}
	},

	langs: {
		vi: {
			syntaxError: "Server Busy"
		},
		en: {
			syntaxError: "Server Busy"
		}
	},

	onStart: async function ({ api, message, event, args, getLang }) 
  {
    
    const keySearch = args.join(" ");
    if(keySearch.includes("-") == false) return api.sendMessage('❌️Please enter in the format, example: Pinterest Naruto - 10 (it depends on you how many images you want to appear in the result)❌️', event.threadID, event.messageID)
    const keySearchs = keySearch.substr(0, keySearch.indexOf('-'))
    let numberSearch = keySearch.split("-").pop() || 6
    if(numberSearch>20){
      numberSearch = 20
    }
    const res = await axios.get(`https://loidapi.wetthebed.repl.co/pinterest?search=${encodeURIComponent(keySearchs)}`);
    const data = res.data.data;
    var num = 0;
    var imgData = [];
    for (var i = 0; i < parseInt(numberSearch); i++) {
      let path = __dirname + `/tmp/${num+=1}.jpg`;
      let getDown = (await axios.get(`${data[i]}`, { responseType: 'arraybuffer' })).data;
      fs.writeFileSync(path, Buffer.from(getDown, 'utf-8'));
      imgData.push(fs.createReadStream(__dirname + `/tmp/${num}.jpg`));
    }
    api.sendMessage({
        attachment: imgData,
        body: numberSearch + '▣𝗣𝗜𝗡𝗧𝗘𝗥𝗘𝗦𝗧🔖🪄: '+ keySearchs
    }, event.threadID, event.messageID)
    for (let ii = 1; ii < parseInt(numberSearch); ii++) {
        fs.unlinkSync(__dirname + `/tmp/${ii}.jpg`)
    }
}
  
};