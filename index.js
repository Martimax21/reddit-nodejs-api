// load the mysql library
var mysql = require('mysql');
var bodyParser = require("body-parser");
var express = require("express");
// var ejs = require("ejs");
var dateFormat = require("dateformat");
var cookieParser = require("cookie-parser");
var secureRandom = require('secure-random');
var engine = require('ejs-mate'); 
var cheerio = require('cheerio');
var npmrequest = require('request');
// var sha1 = require("sha1");
var del = function(req, res) { res.cookie('SESSION', "", {expires: new Date()}); res.redirect('/'); };

// create a connection to our Cloud9 server
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root', 
  password : '',
  database: 'reddit'
});

// load our API and pass it the connection
var reddit = require('./reddit');
var redditAPI = reddit(connection);
var app = express();

app.set("view engine", "ejs"); //setting up ejs file to be recognized
app.locals.dateFormat = dateFormat; //for date formatting in ejs file
app.use(express.static(__dirname + '/public')); //for CSS file
app.use(bodyParser.urlencoded({ extended: true })); //parsing posts
app.use(cookieParser());

require("jsdom").env("", function(err, window) {
    if (err) {
        console.error(err);
        return;
    }
    var $ = require("jquery")(window);
});


function checkLoginToken(request, response, next) {
  if (request.cookies.SESSION) {
    redditAPI.getUserFromSession(request.cookies.SESSION, function(err, user) {
      if (user) {
        request.loggedInUser = user;
      }
      next();
    });
  }
  else {
    next();
  }
}
app.use(checkLoginToken);

app.get('/createPost', function (req, res) {
  console.log(req.user)
  if (!req.loggedInUser) {
    res.status(401).send('You must be logged in to create content!');
  }
  else {
    redditAPI.getAllSubreddits(function(err, sub) {
      if (err) {
        console.log("Whoopsy! Something went wrong! :'(");
      }
      else {
        var subs = sub.map(function(subreddit) {
          return subreddit.name;
        });
      }
       res.render("newpost", {subs: subs});
    });
   
  }
});


app.post('/createPost', function(req, res) {
  if (!req.loggedInUser) {
    res.status(401).send('You must be logged in to create content!');
  }
  else {
    redditAPI.createPost({
      title: req.body.title,
      url: req.body.url,
      userId: req.loggedInUser[0].id
    }, req.body.subredditDropDown, function(err, post) {
      res.redirect('/sort/newestRanking');
      }
  )}
})

app.post('/vote', function(req, res) {
  if (!req.loggedInUser) {
    res.status(401).send('You must be logged in to vote!');
  }
  else {
    redditAPI.createOrUpdateVote({
     userId: parseInt(req.loggedInUser[0].id),
     postId: parseInt(req.body.postId),
     vote: parseInt(req.body.vote)
     }, function(err, vote) {
      res.redirect('/');
    })
  }
})
app.post('/del', del);
// app.post('/logout', function(req, res) {
//     res.clearCookie(req.cookies.SESSION);
// //  res.cookies.set('SESSION', {maxAge: Date.now()});
// //  res.redirect('/');
// })

app.get("/", function(req, res) {
  redditAPI.getAllPosts({}, "hotnessRanking", function(err, posts) {
    if (err) {
      console.log(err);
      res.status(400).send("Please try again!");
    }
    else {
        var sort = "hotnessRanking";
        res.render("homepage", {posts: posts, sort: sort});
    }
  });
});

app.get("/comments/:postId", function(req, res) {
  console.log(req.params.postId);
  redditAPI.getCommentsForPost(req.params.postId, function(err, comments) {
    if (err) {
      console.log(err);
      res.status(400).send("Please try again!");
    }
    else {
        res.render("displaycomments", {comments: comments});
    }
  });
});

app.get("/sort/:sort", function(req, res) {
  var sort = req.params.sort;
  //console.log(sort);
  redditAPI.getAllPosts({}, sort, function(err, posts) {
    if (err) {
      console.log(err);
      res.status(400).send("Please try again!");
    }
    else{
      res.render("homepage", 
        {posts: posts,
        sort: sort
        });
    }
  });
});

app.get("/signup", function (req, res) {
  res.render("signup");
});

app.get("/suggestTitle", function (req, res) {
  var url = req.query.url;
  console.log("URL QUERY PARAM: "+url);
  var title;
  npmrequest(url, function (error, response, html) {
      var $ = cheerio.load(html);
      title = $('title').text();
      console.log("TITLE INNER: "+ title);
      res.send({success:true, title: title});
  });
  
});

app.post("/signup", function (req, res) {
  var username = req.body.username;
  var password = req.body.password; 
  var user = {username: username, password: password};
  
  redditAPI.createUser(user, function (err, user) {
    if (err) {
      console.log(err);
      res.status(400).send("Whoopsy! Something went wrong!");
    }
    else {
      res.redirect("/");
    }
  });
});

app.get("/createcomment", function (req, res) {
  res.render("createcomment", {postId: req.query.postId});
});

app.post("/createcomment", function (req, res) {
  redditAPI.createComment({
    text: req.body.commentText,
    userId: parseInt(req.loggedInUser[0].id),
    postId: req.body.postId,
    parentId: null
  }, function (err, user) {
    if (err) {
      console.log(err);
      res.status(400).send("Whoopsy! Something went wrong!");
    }
    else {
      res.redirect("/");
    }
  });
});



app.get("/login", function (req, res) {
    res.render("login", {message: req.query.message});
});



app.post("/login", function(req, res) {
  var username = req.body.username;
  var password = req.body.password; 
  
  redditAPI.checkLogin(username, password, function (err, user) {
    if (err) {
      console.log(err);
      //res.status(400).send(err.toString());
      res.redirect('/login?message=' + err.toString())
    }
    else {
      redditAPI.createSession(user.id, function(err,token){
        if (err) {
          res.status(500).send('an error occurred. please try again later!');
        }
        else {
          res.cookie('SESSION', token); 
          res.redirect('/');
        }
      })
      
    }
  }
);
});














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

var server = app.listen(process.env.PORT, process.env.IP, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});