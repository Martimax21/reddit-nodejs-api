var express = require('express');
var mysql = require('mysql');

var app = express();

var balance = 100;

app.get('/', function(request, response) {
    console.log('i received a request!');

    response.send('Hello! I received your request. This is a response');
});

app.get('/money/:account', function(request, response) {

    var amount = request.query.amount;


    if (!amount) {
        response.send('you have to tell me how much you want');
    }
    else if (request.query.amount <= balance) {

        balance = balance - request.query.amount;

        response.send(
            `
            ok here you go! here are ${request.query.amount}
            remaining balance: ${balance};
            `
        );

        console.log('dispensed ' + request.query.amount + '$ from ' + request.params.account + ' remaining: ' + balance);
    }
    else {
        response.send('i dont have enough');
    }
});

app.listen(process.env.PORT);