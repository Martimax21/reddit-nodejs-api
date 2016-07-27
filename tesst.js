    // functions.getComments(commentsLink, function(err, comments) {
      
    //   function getReplies(arr, level){
    //     arr.forEach(function(reply){
    //       var indent = '';
    //       for(var i = 0; i < level; i++){
    //         indent = indent + '   ';
    //       }
          
    //       if(reply.data.body){
    //         console.log(wrap(reply.data.body, {indent: indent}));
    //       }
    //       if(reply.data.replies) {
    //         getReplies(reply.data.replies.data.children, level + 1);
    //       }
    //     });
    //   }
    
  
      
      
    //   //code test from Thursday July 21st
      
    //               var commentsAndReplies = {};
    //         results.forEach(function(topComment) {
    //           if (topComment.parentId === null) {
    //             var topCommentObj = {
    //               id: topComment.id,
    //               text: topComment.text,
    //               createdAt: topComment.createdAt,
    //               updatedAt: topComment.updatedAt,
    //               user: topComment.username,
    //               reply: []
    //             };

    //             results.forEach(function(reply) {
    //               if (reply.parentId === topComment.id) {
    //                 var replyObj = {
    //                   id: reply.id,
    //                   text: reply.text,
    //                   createdAt: reply.createdAt,
    //                   updatedAt: reply.updatedAt,
    //                   user: reply.username,
    //                   reply: []
    //                 };
    //                 commentsAndReplies[topComment.id] = topCommentObj;
                      
    //                   commentsAndReplies[topComment.id].reply.push(replyObj);
    //                 // commentsAndReplies[topComment.id].reply.forEach(function(reply1) {
    //                 //       if (reply1.id === reply.parentId) {
    //                 //         reply1.reply.push(replyObj);
    //                 //       }
    //                 //     });

    //                 results.forEach(function(someReplies) {
    //                   if (someReplies.parentId === reply.id) {
    //                     var reply2Obj = {
    //                       id: someReplies.id,
    //                       text: someReplies.text,
    //                       createdAt: someReplies.createdAt,
    //                       updatedAt: someReplies.updatedAt,
    //                       user: someReplies.username,
    //                       reply: []
    //                     };
    //                     commentsAndReplies[topComment.id].reply.forEach(function(moreReplies) {
    //                       if (moreReplies.id === someReplies.parentId) {
    //                         moreReplies.reply.push(reply2Obj)
    //                       }
    //                     });
    //                   }
    //                 });
    //               }
    //               else {
    //                 commentsAndReplies[topComment.id] = topCommentObj;
    //               }
    //             });
    //           }

    //         });
            
            
  // var express = require('express');
// var app = express();
// var mysql = require('mysql');


// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root', // CHANGE THIS :)
//   password : '',
//   database: 'reddit'
// });

// var reddit = require('./reddit');
// var redditAPI = reddit(connection);

// var bodyParser = require('body-parser');
// app.use(bodyParser.json()); // support json encoded bodies
// app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });

// redditAPI.createPost({
//       title: 'fav montreal restaurant55!',
//       url: 'https://www.reddit22.com',
//       userId: 1,
//     }, 6, function(err, post) {
//       if (err) {
//         console.log(err);
//       }
//       else {
//         console.log(post);
//       }
//     });


/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */

// Boilerplate code to start up the web server


//Exercise 1: Getting started!

// app.get('/hello',function (request,response) {
//     response.send('<h1>Hello World!</h1>');
// });

//Exercise 2: A wild parameter has appeared!
// Create a web server that can listen to requests for /hello?name=firstName, 
// and respond with some HTML that says <h1>Hello _name_!</h1>. For example, 
// if a client requests /hello/John, the server should respond with <h1>Hello 
// John!</h1>
// THE QUERY STRING IS NOT PART OF THE RESOURCE PATH THAT YOU ARE FILTERING 
// WITH EXPRESS*​

// app.get('/hello',function (request,response) {
    
//     if(!request.query.name || request.query.name === ""){
//         response.send('<h1>Hello World!</h1>');
//     }
//     else {
//     response.send(`
    
//     <h1>Hello ${request.query.name}!</h1>
    
//     `);
//     }
// });

// // Create a web server that can listen to requests for /calculator/:operation?
// // num1=XX&num2=XX and respond with a JSON object that looks like the following.
// // For example, /op/add?num1=31&num2=11:

// // {
// //   "operator": "add",
// //   "firstOperand": 31,
// //   "secondOperand": 11,
// //   "solution": 42
// // }

// app.get('/calculator/:operation', function (request,response) {
//             var num1 = Number(request.query.num1);
//             var num2 = Number(request.query.num2);
//             var operator = request.params.operation;
//             var solution;
            
//             switch(operator) {
//             case "add":
//                  solution = num1 + num2;
//                  break;
//             case "sub":
//                  solution = num1 - num2;
//                  break;
//             case "mult":
//                  solution = num1 * num2;
//                  break;
//             case "div":
//                  solution = num1 / num2;
//                  break;
//             default:
//                 response.status(400).json({ error: 'You have passed a wrong message' });
//             }
        
        
//             response.send(
             
//              {
//                 "operator" : operator,
//                 "firstOperand" : num1 ,
//                 "secondOperand" : num2 ,
//                 "solution" : solution 
                
//              }
             
//             );
// });

// Exercise 4: Retrieving data from our database


// Using something similar to your getHomepage function, or even directly 
// the function itself, retrieve the latest 5 posts by createdAt date, including
// the username who created the content.

// Once you have the query, create an endpoint in your Express server which 
// will respond to GET requests to /posts. The Express server will use the MySQL 
// query function to retrieve the array of contents. Then, you should build a string
// of HTML that you will send with the request.send function.

// function getRequests(callback) {
//     connection.query(`
//         SELECT 
//           posts.id,
//           posts.title,
//           posts.url,
//           posts.userId,
//           u.username,
//           posts.createdAt,
//           posts.updatedAt
//         FROM posts
//           JOIN users u ON posts.userId=u.id
//         ORDER BY posts.createdAt DESC Limit 5`,
//         function(err, results) {
//             if (err) {
//                 console.log(err);
//                 callback(err);
//             }
//             else {
//                 callback(null, results);
//             }
//         }
//     );
// };

// getRequests(function(err, result) {
//     console.log(JSON.stringify(result, null, 4));
// });

// app.get('/post', function(request, response) {
//     getRequests(function(err, result) {
//         if (err) {
//             response.status(500).send("try again later");
//             console.log(err);
//         }
//         else {


//             function createLi(post) {
//                 return `
//             <li class="content-item">
//                 <h2 class="${post.title}">
//                 <a href="${post.url}">${post.title}</a>
//                 </h2>
//                 <p>Created by ${post.username}</p>
//             </li>
//             `;
//             }

//             response.send(
//                 `
//             <div id="contents">
//             <h1>List of contents</h1>
//             <ul class="contents-list">
//                 ${result.map(function(post){
//                     return createLi(post);
//                 }).join("")}
                
//             </ul>
//             </div> 
//         `
//             );
//         }
//     });
// });

// Exercise 5: Creating a "new content" form
// In this exercise, we're going to use Express to simply send an 
// HTML file to our user containing a <form>. To do this, let's write 
// a little HTML file that looks like this:
// <form action="/createContent" method="POST"> <!-- what is this method="POST" 
// thing? you should know, or ask me :) -->
//   <div>
//     <input type="text" name="url" placeholder="Enter a URL to content">
//   </div>
//   <div>
//     <input type="text" name="title" placeholder="Enter the title of your content">
//   </div>
//   <button type="submit">Create!</button>
// </form>
// You can use template strings (with backticks) to write the HTML code 
// directly in your web server file on multiple lines. Then, using ExpressJS
// create a GET endpoint called createContent. When someone requests this URL, 
// send the HTML form to them

// app.get('/createcontent', function (req, res) {
//   res.send(`
//     <form action="/createContent" method="POST"> 
//       <div>
//          <input type="text" name="url" placeholder="Enter a URL to content">
//       </div>
//       <div>
//           <input type="text" name="title" placeholder="Enter the title of your content">
//       </div>
//           <button type="submit">Create!</button>
//         </form>
//     `);
// });

// //Exercice 6
// function makeAPost(title, url, callback) {
//     redditAPI.createPost({
//         title: title,
//         url: url,
//         userId: 1,
//     }, 6, function(err, post) {
//         if (err) {
//             callback(err);
//         }
//         else {
//             callback(null,post);
//         }
//     })
// };

// app.post('/createcontent',function(req,res){
    
//     makeAPost(req.body.title,req.body.url,function(err,post){
        
//         if(err) {
//             res
//               .status(500).json({ error: 'message' });
//         }
//         else {
        
//         //res.send({status:"ok", post: post});
//         res.redirect("/post");
//         }
//     });
    
// });




// app.get('/money/:account', function(request, response) {
    
//     var amount = request.query.amount;
    
    
//     if (!amount) {
//         response.send('you have to tell me how much you want');
//     }
//     else if (request.query.amount <= balance) {
        
//         balance = balance - request.query.amount;
        
//         response.send(
//             `
//             ok here you go! here are ${request.query.amount}
//             remaining balance: ${balance};
//             `
//         );
        
//         console.log('dispensed ' + request.query.amount + '$ from ' + request.params.account + ' remaining: ' + balance);
//     }
//     else {
//         response.send('i dont have enough');
//     }
// });





// var server = app.listen(process.env.PORT, process.env.IP, function () {
//   var host = server.address().address;
//   var port = server.address().port;

//   console.log('Example app listening at http://%s:%s', host, port);
// });