var bcrypt = require('bcrypt');
var HASH_ROUNDS = 10;

module.exports = function RedditAPI(conn) {
  return {
    createUser: function(user, callback) {
      
      // first we have to hash the password...
      bcrypt.hash(user.password, HASH_ROUNDS, function(err, hashedPassword) {
        if (err) {
          callback(err);
        }
        else {
          conn.query(
            'INSERT INTO users (username,password, createdAt) VALUES (?, ?, ?)', [user.username, hashedPassword, new Date()],
            function(err, result) {
              if (err) {
                /*
                There can be many reasons why a MySQL query could fail. While many of
                them are unknown, there's a particular error about unique usernames
                which we can be more explicit about!
                */
                if (err.code === 'ER_DUP_ENTRY') {
                  callback(new Error('A user with this username already exists'));
                }
                else {
                  callback(err);
                }
              }
              else {
                /*
                Here we are INSERTing data, so the only useful thing we get back
                is the ID of the newly inserted row. Let's use it to find the user
                and return it
                */
                conn.query(
                  'SELECT id, username, createdAt, updatedAt FROM users WHERE id = ?', [result.insertId],
                  function(err, result) {
                    if (err) {
                      callback(err);
                    }
                    else {
                      /*
                      Finally! Here's what we did so far:
                      1. Hash the user's password
                      2. Insert the user in the DB
                      3a. If the insert fails, report the error to the caller
                      3b. If the insert succeeds, re-fetch the user from the DB
                      4. If the re-fetch succeeds, return the object to the caller
                      */
                        callback(null, result[0]);
                    }
                  }
                );
              }
            }
          );
        }
      });
    },
    createPost: function(post, subredditId, callback) {
      conn.query(
        'INSERT INTO posts (userId, title, url, createdAt, subredditId) VALUES (?, ?, ?, ?, ?)', [post.userId, post.title, post.url, new Date(), subredditId],
        function(err, result) {
          console.log(result);
          if (err) {
            callback(err);
          }
          else {
            /*
            Post inserted successfully. Let's use the result.insertId to retrieve
            the post and send it to the caller!
            */
            conn.query(
              'SELECT id,title,url,userId, createdAt, updatedAt, subredditId FROM posts WHERE id = ?', [result.insertId],
              function(err, result) {
                if (err) {
                  callback(err);
                }
                else {
                  callback(null, result[0]);
                }
              }
            );
          }
        }
      );
    },
    getAllPosts: function(options, callback) {
      // In case we are called without an options parameter, shift all the parameters manually
      if (!callback) {
        callback = options;
        options = {};
      }
      var limit = options.numPerPage || 25; // if options.numPerPage is "falsy" then use 25
      var offset = (options.page || 0) * limit;
      
      conn.query(`
        SELECT p.id,
          p.title AS postTitle, 
          p.url AS postURL, 
          p.userId AS postUserId, 
          p.createdAt AS postCreatedAt, 
          p.updatedAt AS postUpdatedAt, 
          u.id AS userId, 
          u.username, 
          u.createdAt AS userCreatedAt, 
          u.updatedAt AS userUpdatedAt,
          s.id AS subId,
          s.name,
          s.description AS des,
          s.createdAt AS subCreatedAt,
          s.updatedAt AS subUpdatedAt
        FROM posts p
          JOIN users u ON p.userId=u.id
          LEFT JOIN subreddits s ON p.subredditId = s.id
        ORDER BY postCreatedAt DESC
        LIMIT ? OFFSET ?`
        , [limit, offset],
        function(err, results) {
          if (err) {
            callback(err);
          }
          else {
            
            var mappedResults = results.map(function(res){
              return {
                id: res.id,
                title: res.postTitle,
                url: res.postURL,
                createdAt: res.postCreatedAt,
                updatedAt: res.postUpdatedAt,
                userId: res.userId,
                user: {
                  id: res.userId,
                  username: res.username,
                  createdAt: res.userCreatedAt,
                  updatedAt: res.userUpdatedAt
                },
                subreddit: {
                  id: res.subId,
                  name: res.name,
                  description: res.des,
                  createdAt: res.subCreatedAt,
                  updatedAt: res.subUpdatedAt
                }
              }
            })
            
            callback(null, mappedResults);
          }
        }
      );
    },
    getAllPostsForUser: function (userID, options, callback) {
      if (!callback) {
        callback = options;
        options = {};
      }
      var userr = userID;
      var limit = options.numPerPage || 25; // if options.numPerPage is "falsy" then use 25
      var offset = (options.page || 0) * limit;
      
      conn.query(`
        SELECT p.id,
          p.title AS postTitle, 
          p.url AS postURL, 
          p.userId AS postUserId, 
          p.createdAt AS postCreatedAt, 
          p.updatedAt AS postUpdatedAt, 
          u.id AS userId, 
          u.username, 
          u.createdAt AS userCreatedAt, 
          u.updatedAt AS userUpdatedAt
        FROM posts p
          JOIN users u ON p.userId=u.id
          WHERE userId = ?
        ORDER BY postCreatedAt DESC
        LIMIT ? OFFSET ?`
        , [userr, limit, offset],
        function(err, results) {
          if (err) {
            callback(err);
          }
          else {
            
            var mappedResults = results.map(function(res){
              return {
                id: res.id,
                title: res.postTitle,
                url: res.postURL,
                createdAt: res.postCreatedAt,
                updatedAt: res.postUpdatedAt,
                userId: res.userId,
                user: {
                id: res.userId,
                username: res.username,
                createdAt: res.userCreatedAt,
                updatedAt: res.userUpdatedAt
                  
                }
              }
            })
            
            callback(null, mappedResults);
          }
        }
      );
    },
    createSubreddit: function(sub, callback) {
      conn.query(
        'INSERT INTO subreddits (name, description, createdAt, updatedAt) VALUES (?, ?, ?, ?)', [sub.name, sub.description, new Date(), new Date()],
        function(err, result) {
          if (err) {
            callback(err);
          }
          else {
            /*
            Post inserted successfully. Let's use the result.insertId to retrieve
            the post and send it to the caller!
            */
            conn.query(
              'SELECT id, name, description, createdAt, updatedAt FROM subreddits WHERE id = ?', [result.insertId], 
              function(err, result) {
                if (err) {
                  callback(err);
                }
                else {
                  callback(null, result[0]);
                }
              }
            );
          }
        }
      );
    },
    getAllSubreddits: function(callback) {
        conn.query(`
        SELECT id,
          name,
          description,
          createdAt,
          updatedAt
        FROM subreddits
        ORDER BY createdAt DESC`, 
        function(err, results) {
          if (err) {
            callback(err);
          }
          else {
            callback(null, results);
          }
        }
      );
    }
  };
};

