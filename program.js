require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const token = process.env.DISCORD_TOKEN;

var c = 0;
var tabJoke;
var tabStats;
var pathStatsRecap = "Stats-Recap/";
var adagio; // Serveur de l'ami qui ne veut plus du mot "charo"

try {
bot.on('ready', function () {
    c = getRandom(0,2);
    setInterval(resetStats, 10000); // 3 days = 259200000 ms
    console.log("Francisco-Bot connecté !");
    adagio = bot.guilds.find("id", "627657355764695040");
    loadJokes();
    loadStats();

})
} catch (exc) { console.log(exc); }

try {
bot.on('message', msg => {
if(msg.author.id !== bot.user.id && msg.author.id != 131930102224125954) { // Ici j'empeche le bot de se répondre a lui même et a mon compte
    if(msg.content.toLowerCase().includes("charo ") && msg.guild.id == adagio.id || msg.content.toLowerCase() == "charo" && msg.guild.id == adagio.id) { // Demande d'un ami pour empêcher ce mot sur son serv
        msg.delete();
    } else {
        getmsg(msg).then( function(res) { 
        
        if(res.substring(res.length - 3) === "ein") {
            addStats("hein");
            if(c === 1) {
                msg.reply("dien !");
            }
            else if(c === 2) {
                msg.reply("bécile ?");
            }
            else {
                msg.reply("2 !")
            }
        c = getRandom(0,2);
        }
        else if(res.substring(res.length - 3) === "oui")  {
            if(getRandom(0,2) == 1) {
                addStats("oui");
                msg.reply("stiti !");
            }
        } 
        else if(res.substring(res.length - 3) === "pas") {
            if(getRandom(0,3) == 2) {
                addStats("pas");
                msg.reply("stèque !");
            }
        }
        else if(res === "re") {
            addStats("re");
            if(c === 1) {
                msg.reply("nard !");
            }
            else if(c === 2) {
                msg.reply("quin ?");
            }
            else {
                msg.reply("né LA TAUPE !")
            }
            c = getRandom(0,2);
        }
        else if(res === "de" || res.substring(res.length - 3) === "deu" || res.substring(res.length - 4) === "deux") {
            addStats("de");
            msg.reply("3 !");
        }
        else if(res.substring(res.length - 4) === "quoi") {
            if(getRandom(0,2) == 1) {
                addStats("quoi");
                    if(c === 1) {
                        msg.reply("fure !");
                    }
                    else if(c === 2) {
                        msg.reply("feur ?");
                    }
                    else {
                        msg.reply("feuse !")
                    }
                c = getRandom(0,2);
            }
        }
        else if(res.substring(res.length - 5) === "ouais") {
            addStats("ouais");
            msg.reply("stern !");
        }
        else if(res === "o" || res === "oo" || res === "ooo" || res === "oooo" || res === "ooooo" || res === "oooooo") {
            addStats("o");
            msg.reply("bama !");
        }
        else if(res.substring(res.length - 7) === "comment" || res.substring(res.length - 6) === "commen") {
            addStats("comment");
            msg.reply("do Ghost Recon !");
        }
        else if(res.substring(res.length - 4) === "fort" || res.substring(res.length - 3) === "for") {
            addStats("fort");
            msg.reply("midable");
        }
        else if(res === "a" || res === "aa" || res === "aaa" || res === "aaaa" || res === "aaaaa" || res === "aaaaaa") {

            if(res.substring(res.length - 2) === "ba") {
                addStats("ba");
                if(c === 1) {
                    msg.reply("nane !");
                }
                else if(c === 2) {
                    msg.reply("bar !");
                }
                else {
                    msg.reply("bôrd !");
                }
                c = getRandom(0,2);
            }
            else {
                if(getRandom(0,4) == 2) {
                    addStats("a");
                    if(c === 1) {
                        msg.reply("raignée !");
                    }
                    else if(c === 2) {
                        msg.reply("rtichaud !");
                    }
                    else {
                        msg.reply("rabe :O");
                    }
                    c = getRandom(0,2);
                }
            }
        }
        else if(res.substring(res.length - 9) === "t'esmoche" || res.substring(res.length - 8) === "tesmoche" || res.substring(res.length - 6) === "tmoche" || res.substring(res.length - 5) === "tpabo") {
            addStats("moche");
            msg.reply("Toi aussi :p");
        } else if(res.includes("stats") && res.includes(bot.user.id)) {
            var statResult = "Reset le 1 et le 16 du mois";
            tabStats.stats.forEach(stat => {
                statResult += "\n" + stat.id + ": " + stat.count;
            });
            msg.author.sendMessage(statResult);
        } else {
            if(getRandom(0,400) === 69) {
                addStats("jokes"); 
                joke(msg);
            }
        }
            }).catch(function(err) {
            console.log(err);
                })
    } 
} else if(msg.author.id == 131930102224125954) {
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

function getmsg(chainmsg) { 
        
        return new Promise(function (resolve, reject) {
            try {
                    chainmsg += " ";
                    var splitmsg = "k";
                    Array.from(chainmsg).forEach(char => {
                        if(char !== '?' && char !== '!' && char !== '.' && char !== '*' && char !== ' ' && char.toLowerCase() !== 'h') {
                        splitmsg += char.toLowerCase(); 
                        }
                    });
                    resolve(splitmsg.substring(1));
                }
        catch(error) {reject(error);}
        })
}


function joke(msg) {
    var random = getRandom(0, tabJoke.jokes.length -1);
    var jokeuh;
    tabJoke.jokes.forEach(joke => {
        if(joke.id == random) {
            jokeuh = joke;
        }
    })
    msg.reply("**" + jokeuh.question + "**" + "\n" + '_' + jokeuh.answer + '_');

}

function loadJokes() {
    fs.readFile('jokes.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log("Jokes file read failed:", err)
            return
        } else {
            try {
                tabJoke = JSON.parse(jsonString)
        } catch(err) {
                console.log('Error parsing Jokes JSON string:', err)
            } 
        }
    });
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

