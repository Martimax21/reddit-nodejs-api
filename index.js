// load the mysql library
var mysql = require('mysql');

// create a connection to our Cloud9 server
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root', // CHANGE THIS :)
  password : '',
  database: 'reddit'
});

// load our API and pass it the connection
var reddit = require('./reddit');
var redditAPI = reddit(connection);


redditAPI.getAllPosts(function(err, result) {
  console.log(JSON.stringify(result, null, 4))
})

// redditAPI.getAllPostsForUser(3, {}, function(err, result) {
//   console.log(JSON.stringify(result, null, 4))
// })



// It's request time!
// redditAPI.createUser({
//   username: 'hello233437',
//   password: 'xxx'
// }, function(err, user) {
//   if (err) {
//     console.log(err);
//   }
//   else {
//     redditAPI.createPost({
//       title: 'fav montreal restaurant!',
//       url: 'https://www.reddit.com',
//       userId: user.id,
//     }, 6, function(err, post) {
//       if (err) {
//         console.log(err);
//       }
//       else {
//         console.log(post);
//       }
//     });
//   }
// });

// redditAPI.createSubreddit({
//   name: "halifax",
//   description: "all things halifax"
// }, function(err, sub) {
//   if (err) {
//     console.log(err);
//   }
//   else {
//     console.log(JSON.stringify(sub, null, 4))
//   }
// });


// redditAPI.getAllSubreddits(function(err, result) {
//     // console.log(result);
//   console.log(JSON.stringify(result, null, 4));
// })