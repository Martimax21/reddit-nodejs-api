// copied from expressjs workshop index.js file

var express = require('express');
var app = express();
var operator, firstOperand, secondOperand, solution;

app.get('/calculator/:operation', function (req, res) {
    // console.log('request', req.query);
//   res.send(`<h1>Hello ${req.query.name}!</h1>`);
    operator = req.params.operation;
    firstOperand = req.query.num1;
    secondOperand = req.query.num2;
    
    switch(operator) {
    case "add":
        solution = Number(firstOperand) + Number(secondOperand);
        break;
    case "sub":
        solution = Number(firstOperand) - Number(secondOperand);
        break;
    case "mult":
        solution = Number(firstOperand) * Number(secondOperand);
        
        break;
    case "div":
        solution = Number(firstOperand) / Number(secondOperand);
    default:
        console.log("whoops!");
}
    var finalResult = {
        operator: operator,
        firstOperand: firstOperand,
        secondOperand: secondOperand,
        solution: solution
    };
    res.send(finalResult);

});

/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */

// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});


/*Exercise 3: Operations

Create a web server that can listen to requests for /calculator/:operation?num1
=XX&num2=XX and respond with a JSON object that looks like the following. 
For example, /op/add?num1=31&num2=11:

{
  "operator": "add",
  "firstOperand": 31,
  "secondOperand": 11,
  "solution": 42
}
NOTE: query string parameters -- the part after the ? in a URL -- are different 
conceptually from the request parameters, which are part of the path. For 
example here you are asked to use :operation as request parameter. In express, 
you do this by making your app.get('/op/:operation', ...). The : before operation 
will tell Express that this is a request parameter. You can access it using the 
request.params object instead of request.query which would be for the query 
string. In general, while the query string is reserved for either optional 
values or values that can vary wildly, we will use request parameters when 
they can themselves represent a resource. Here, we are looking for the 
calculator resource, and under it for the add "sub-resource". Of course this is 
our own terminology and in general it's up to us to decide what our URL schema 
represents.

Your program should work for add,sub,mult,div and return the appropriate solution 
in a JSON string. If operation is something other than these 4 values, you 
should use res.status to send an appropriate error code. First, figure out the 
category of error code you need to send, then find an appropriate code using 
the provided link.*/