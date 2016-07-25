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

app.get('/post', function(req, res) {
    // console.log('request', req.query);
    redditAPI.get5Posts({}, function(err, result) {
        console.log(result);
        
        function createLi(post){
            return `
            <li>
                <p>Username: ${post.username} Post: ${post.postTitle}</p>
            </li>
            `;
        }
        
        res.send(
            `
    <div id="contents">
        <h1>5 Posts from User # ${result[0].userId}</h1>
            <ul>
                ${result.map(function(post){
                    return createLi(post);
                }).join("")}
            </ul>
    </div>
`);
    });
});


/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */
// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});


/*Exercise 4: Retrieving data from our database

Before doing this exercise, go back to your reddit clone MySQL database from the 
CLI. Using a few INSERT statements, put up a few posts in the posts table. Have 
at least 10-15 posts in there with various titles and urls. For the userId, set 
it to 1. Also create a user with ID 1 and call him John Smith or something.

Once you have inserted a few posts in the database, it's now time to retrieve 
the contents from our web server and display them to the user using an HTML 
<ul> list with a bunch of <li>s.

Using something similar to your getHomepage function, or even directly the 
function itself, retrieve the latest 5 posts by createdAt date, including the 
username who created the content.

Once you have the query, create an endpoint in your Express server which will 
respond to GET requests to /posts. The Express server will use the MySQL query 
function to retrieve the array of contents. Then, you should build a string of 
HTML that you will send with the request.send function.


<div id="contents">
  <h1>List of contents</h1>
  <ul class="contents-list">
    <li class="content-item">
      <h2 class="content-item__title">
        <a href="http://the.post.url.value/">The content title</a>
      </h2>
      <p>Created by CONTENT AUTHOR USERNAME</p>
    </li>
    ... one <li> per content that your Sequelize query found
  </ul>
</div>

*/
