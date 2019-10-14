var http = require('http');
var fs = require('fs');

var tabJoke;

http.createServer(function (req, res) {
    var indexM = req.rawHeaders.indexOf("method");
    if(indexM != -1){
        loadJokes().then(() => {
            res.write(responseJson(tabJoke,req.rawHeaders[indexM + 1]));
            console.log("request " + req.rawHeaders[indexM + 1]);
            res.end();
        }).catch(err => {
            res.write(err);
            res.end();
        })
    } else {
        res.write("Error, No Method found");
        res.end();
    }
}).listen(4242); 

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min +1)) + min;
}

function loadJokes() {
    return new Promise(function(res,rej) {
        fs.readFile('jokes.json', 'utf8', (err, jsonString) => {
            if (err) {
                rej("Jokes file read failed:" + err.message);
            } else {
                try {
                    tabJoke = JSON.parse(jsonString)
                    res();
            } catch(err) {
                    rej('Error parsing Jokes JSON string:' + err.message)
                } 
            }
        });
    })
}

function responseJson(tablal, method) {
    switch(method) {
        case 'all' :
            return JSON.stringify(tablal);
        case 'random':
            return JSON.stringify(tablal.jokes[getRandom(0,tablal.jokes.length)]);
        default:
            return "An error has been found in the method";
    }
}