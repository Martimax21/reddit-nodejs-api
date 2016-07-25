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


// redditAPI.getCommentsForPost(5, function(err, result) {
//   console.log(JSON.stringify(result, null, 4));
// })

// redditAPI.getAllPostsForUser(3, {}, function(err, result) {
//   console.log(JSON.stringify(result, null, 4))
// })

// redditAPI.getAllPosts({},"Hotness ranking", function(err, result) {
//   console.log(JSON.stringify(result, null, 4))
// })



// It's request time!
// redditAPI.createUser({
//   username: 'TD',
//   password: 'xxx'
// }, function(err, user) {
//   if (err) {
//     console.log(err);
//   }
//   else {
//     redditAPI.createPost({
//       title: 'Tonic Dev',
//       url: 'https://www.tonicdev.com',
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

// redditAPI.createPost(
//     {userId: 1, title: "https://www.hackernews.com", url: "https://www.hackernews.com"},6, function(err, post) {
//       if (err) {
//         console.log(err);
//       }
//       else {
//         console.log(post);
//       }});

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

// redditAPI.createComment({
//   text: "I've never been been to Sumac and I will never go. :)",
//   userId: 3,
//   postId: 5,
//   parentId: 3
// }, function(err, comment) {
//   if (err) {
//     console.log(err);
//   }
//   else {
//     console.log(JSON.stringify(comment, null, 4))
//   }
// });

// redditAPI.createOrUpdateVote({
//   userId: 7,
//   postId: 1,
//   vote: 1
// }, function(err, vote) {
//   if (err) {
//     console.log(err);
//     console.log(vote);
//   }
//   else {
//     console.log(JSON.stringify(vote, null, 4))
//   }
// });


// redditAPI.getSinglePost(5, function(err, result) {
//     // console.log(result);
//   console.log(JSON.stringify(result, null, 4));
// })