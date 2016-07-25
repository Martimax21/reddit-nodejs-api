//from reddit.js
var reddit = require('./reddit');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root', // CHANGE THIS :)
  password : '',
  database: 'reddit'
});
var redditAPI = reddit(connection);
// copied from expressjs workshop index.js file
var express = require('express');
var app = express();
// var operator, firstOperand, secondOperand, solution;

app.get('/createContent', function(req, res) {
    // console.log('request', req.query);
    res.send(`
    <form action="/createContent" method="POST">
        <div>
            <input type="text" name="url" placeholder="Enter a URL to content">
        </div>
        <div>
            <input type="text" name="title" placeholder="Enter the title of your content">
        </div>
        
        <button type="submit">Create!</button>
    </form>
    `);
});
app.post('/createContent', function(req, res) {
    res.send("Thank you!")
})


/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */
// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

/*
In this exercise, we're going to use Express to simply send an HTML file to our 
user containing a <form>. To do this, let's write a little HTML file that looks 
like this:

<form action="/createContent" method="POST"> <!-- what is this method="POST" thing? you should know, or ask me :) -->
  <div>
    <input type="text" name="url" placeholder="Enter a URL to content">
  </div>
  <div>
    <input type="text" name="title" placeholder="Enter the title of your content">
  </div>
  <button type="submit">Create!</button>
</form>
You can use template strings (with backticks) to write the HTML code directly in 
your web server file on multiple lines. Then, using ExpressJS create a GET 
endpoint called createContent. When someone requests this URL, send the HTML 
form to them.
*/
