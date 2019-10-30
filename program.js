require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const axios = require('axios');
const token = process.env.DISCORD_TOKEN;

var TITOS = 131930102224125954;
var rateJoke = 400; // 100 = Each msg have 1% to trigger joke()
var tabStats;
var tabResponses;
var pathStatsRecap = "Stats-Recap/";
var adagio; // Serveur de l'ami qui ne veut plus du mot "charo"

try {
bot.on('ready', function () {
    setInterval(resetStats, 86400000); // 1 day = 86 400 000 ms
    console.log("Francisco-Bot connecté !");
    adagio = bot.guilds.find("id", "627657355764695040");
    loadStats();
    loadResponses();

})
} catch (exc) { console.log(exc); }

try {
bot.on('message', msg => {
    //Prevent the bot to do a infinity loop, TITOS is my user id
    if(msg.author.id !== bot.user.id && msg.author.id != TITOS) { 
        if(msg.content.toLowerCase().includes("charo ") && msg.guild.id == adagio.id || msg.content.toLowerCase() == "charo" && msg.guild.id == adagio.id || msg.content.toLowerCase().includes(" charo") && msg.guild.id == adagio.id) {
            msg.delete();
        } else {
            if(getRandom(0, rateJoke) === 42) {
                joke(msg);
                addStats("jokes");
            }

            getmsg(msg).then( function(res) {
                // 1st loop : enter in each JSON object in responses array 
                for(var i = 0; i < tabResponses.responses.length; i++) {
                    // 2nd loop : enter in each properties of the object JSON
                    for (var j = 0; j < tabResponses.responses[i].idArr.length; j++) {
                        //Verification of the user's msg & reponses objects AND if the entire msg need to be compare or not
                        if (tabResponses.responses[i].idArr[j].id === res.substring(res.length - tabResponses.responses[i].idArr[j].id.length) && tabResponses.responses[i].unique === "false") {
                            if(getRandom(0, tabResponses.responses[i].rate) === 0) {
                                addStats(tabResponses.responses[i].idArr[0].id);
                                getResponse(tabResponses.responses[i].replyArr).then(arrayReply => {
                                    msg.reply(arrayReply);
                                }).catch(err => { console.log(err); });
                            }
                            i = Number.MAX_SAFE_INTEGER;
                            break;
                        } 
                        // Verfication of the entire msg and each JSON object who have unique = true
                        else if(tabResponses.responses[i].idArr[j].id ===  res && tabResponses.responses[i].unique === "true") {
                            if(getRandom(0, tabResponses.responses[i].rate) === 0) {
                                addStats(tabResponses.responses[i].idArr[0].id);
                                getResponse(tabResponses.responses[i].replyArr).then(arrayReply => {
                                    msg.reply(arrayReply);
                                }).catch(err => { console.log(err); });
                            }
                            i = Number.MAX_SAFE_INTEGER;
                            break;
                        }
                    }
                }
            }).catch(function(err) {
            console.log(err);
                })
    } 
} else if(msg.author.id == TITOS) {
        if(msg.content.includes(bot.user.id) && msg.content.includes("blague")) {
            addStats("jokes");
            joke(msg);
        } else if(msg.content.includes(bot.user.id) && msg.content.includes("stats")) {
            var statResult = "Reset le 1 et le 16 du mois";
            tabStats.stats.forEach(stat => {
                statResult += "\n" + stat.id + ": " + stat.count;
            });
            msg.author.sendMessage(statResult);
        }      
    }
  });
}catch(exc) { 
    if(exc instanceof WebSocket) {
    } else {
        console.log(exc);
    }
}

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min +1)) + min;
}

function loadResponses() {
    fs.readFile('response.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("Responses file read failed:", err)
            return
        } else {
            try {
                tabResponses = JSON.parse(jsonString)
        } catch(err) {
                console.log('Error parsing Responses JSON string:', err)
            } 
        }
    });
}

function getResponse(respArr) {
    return new Promise(function (resolve, reject) {
        try {
            var tabResp = new Array();
            respArr.forEach(resp => {
                tabResp.push(resp.reply);
            });
            resolve(tabResp[getRandom(0, tabResp.length - 1)]);
        } catch(err) { reject(err); }
    })
}

function getmsg(chainmsg) {     
    return new Promise(function (resolve, reject) {
        try {
                chainmsg += " ";
                var splitmsg = "k";
                Array.from(chainmsg).forEach(char => {
                    if(char !== '?' && char !== '!' && char !== '.' && char !== '*' && char !== ' ' && char.toLowerCase() !== 'h')
                        splitmsg += char.toLowerCase(); 
                });
                resolve(splitmsg.substring(1));
            }
    catch(error) {reject(error);}
    })
}

async function joke(msg) {
    const config = {
        method: 'get',
        // the API that give jokes is on the same server than the bot
        //https://github.com/Mr-Titos/API-Jokes 
        url: 'http://localhost:4242',
        headers: { 'method': 'random' }
    }
    let res = await axios(config);
    var toSendJoke = res.data; // Axios has already do JSON.parse()
    msg.reply("**" + toSendJoke.question + "**" + "\n" + '_' + toSendJoke.answer + '_');

}

function loadStats() {
    fs.readFile('stats.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("Stats file read failed:", err)
            return
        } else {
            try {
                tabStats = JSON.parse(jsonString)
        } catch(err) {
                console.log('Error parsing Stats JSON string:', err)
            } 
        }
    });
}

function addStats(id) {
    tabStats.stats.forEach(stat => {
        if(stat.id === id)
            stat.count += 1;
    });
    var stringifyStats = JSON.stringify(tabStats, null, 2);
    fs.writeFile('stats.json', stringifyStats, (err) => {
        if (err) throw err;
    });
}

function resetStats() {
    var date = new Date();
    if(date.getUTCDate() == 1 || date.getUTCDate() == 16) {
        var statResult = "Recap "+ date.getUTCDate() + '-' + date.getUTCMonth() + '-' + date.getUTCFullYear();
        tabStats.stats.forEach(stat => {
            statResult += "\n" + stat.id + ": " + stat.count;
        });
        fs.writeFile(pathStatsRecap + date.getUTCDate() + '-' + date.getUTCMonth() + '-' + date.getUTCFullYear() +".txt", statResult, (err) => {
            if (err) throw err;
            console.log('Stats recap written to file');
            tabStats.stats.forEach(stat => {
                stat.count = 0;
            });
            var stringifyStats = JSON.stringify(tabStats, null, 2);
            fs.writeFile('stats.json', stringifyStats, (err) => {
                if (err) throw err;
            });
        });
    }
}

bot.login(token);