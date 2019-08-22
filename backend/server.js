const request = require('request');
const express = require("express");
const app = express();

var bodyParser = require('body-parser')

//******************************  Init Configuration Stuff    *************************************/
//bodyParser shit

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//express shit
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const options = {
    url: 'http://181.114.27.114:8000/api/v1/vehicles/',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token 69cec5a91966e436c97c995f2a356f01dad69c32',
    }
};


app.get("/get_plates", function(req, rest) {
    request(options, function(err, res, body) {
        let json = JSON.parse(body);
        rest.json(json)
    });
})

app.post("/openDevice", function(req, rest) {
    var mall = req.body.mall;
    var plate = req.body.plate;
    var computerCamera = req.body.computerCamera;
    var ipToken = mall.split('|')
    console.log(ipToken)
    request({
        url: 'http://'+ipToken[0]+':8000/api/v1/gates/gate-trigger/?plate='+ plate +'&camera_code='+ computerCamera +'',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Token '+ipToken[1]+'',
        }
    }, function(err, res, body) {
        rest.status(200).send("OK");
    });

})

app.listen(5000, function () {
    console.log('Lumation backend running!');
})