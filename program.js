require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const token = process.env.DISCORD_TOKEN;

var c = 0;
var tabJoke;

try {
bot.on('ready', function () {
  c = getRandom(0,2);
  console.log("Francisco-Bot connecté !");
  fs.readFile('jokes.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log("File read failed:", err)
        return
    } else {
        try {
            tabJoke = JSON.parse(jsonString)
    } catch(err) {
            console.log('Error parsing Jokes JSON string:', err)
        } 
    }
});

})
} catch (exc) { console.log(exc); }

try {
bot.on('message', msg => {
if(msg.author.id !== bot.user.id && msg.author.id != 131930102224125954) { // Ici j'empeche le bot de se répondre a lui même et a mon compte
    getmsg(msg).then( function(res) { 
    
    if(res.substring(res.length - 3) === "ein") {
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
        msg.reply("stiti !");
    } 
    else if(res.substring(res.length - 3) === "pas") {
        msg.reply("stèque !");
    }
    else if(res === "re") {
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
        msg.reply("3 !");
    }
    else if(res.substring(res.length - 4) === "quoi") {
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
    else if(res.substring(res.length - 5) === "ouais") {
            msg.reply("stern !");
    }
    else if(res === "o" || res === "oo" || res === "ooo" || res === "oooo" || res === "ooooo" || res === "oooooo") {
            msg.reply("bama !");
    }
    else if(res.substring(res.length - 7) === "comment" || res.substring(res.length - 6) === "commen") {
        msg.reply("do Ghost Recon !");
    }
    else if(res.substring(res.length - 4) === "fort" || res.substring(res.length - 3) === "for") {
        msg.reply("midable");
    }
    else if(res === "a" || res === "aa" || res === "aaa" || res === "aaaa" || res === "aaaaa" || res === "aaaaaa") {

        if(res.substring(res.length - 2) === "ba") {
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
    else if(res.substring(res.length - 9) === "t'esmoche" || res.substring(res.length - 8) === "tesmoche" || res.substring(res.length - 6) === "tmoche" || res.substring(res.length - 5) === "tpabo") {
        msg.reply("Toi aussi :p");
    } else {
        if(getRandom(0,100) === 69) { 
            joke(msg);
        }
    }
        }).catch(function(err) {
        console.log(err);
            })
    
} else if(msg.author.id == 131930102224125954) {
        if(msg.content.includes(bot.user.id) && msg.content.includes("blague")) {
            joke(msg);
        } else if(msg.content.includes(bot.user.id) && !msg.content.includes("blague")) {
            msg.reply("Lui c'est un bon !");
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
                if(getRandom(0,3) == 2) {
                    chainmsg += " ";
                    var splitmsg = "k";
                    Array.from(chainmsg).forEach(char => {
                        if(char !== '?' && char !== '!' && char !== '.' && char !== '*' && char !== ' ' && char.toLowerCase() !== 'h') {
                        splitmsg += char.toLowerCase(); 
                        }
                    });
                    resolve(splitmsg.substring(1));
                }
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

bot.login(token);

