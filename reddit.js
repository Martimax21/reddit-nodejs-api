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
          // console.log(result);
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
    getAllPosts: function(options, sortingMethod, callback) {
      // In case we are called without an options parameter, shift all the parameters manually
      if (!callback) {
        callback = options;
        options = {};
      }
      var limit = options.numPerPage || 25; // if options.numPerPage is "falsy" then use 25
      var offset = (options.page || 0) * limit;
      if (sortingMethod === "Newest ranking") {
        sortingMethod = 'postCreatedAt';
      }
      if (sortingMethod === "Top Ranking") {
        sortingMethod = 'voteScore';
      }
      if (sortingMethod === "Controversial ranking") {
        sortingMethod = 'controversialRanking';
      }
      if (sortingMethod === "Hotness ranking") {
        sortingMethod = "SUM(v.vote)/(now() - p.createdAt)"
      }

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
          s.updatedAt AS subUpdatedAt,
          SUM(v.vote) as voteScore,
          SUM(v.vote)/(now() - p.createdAt) as hottest,
          COUNT(*) as totalVotes,
          SUM(IF(v.vote = 1, 1,0)) AS numUpVotes,
          SUM(IF(v.vote = -1, 1,0)) AS numDownVotes,
          CASE 
            WHEN SUM(IF(v.vote = 1, 1,0)) < SUM(IF(v.vote = -1, 1,0)) 
               THEN COUNT(*) * SUM(IF(v.vote = -1, 1,0)) / SUM(IF(v.vote = 1, 1,0))
               ELSE COUNT(*) * SUM(IF(v.vote = 1, 1,0)) / SUM(IF(v.vote = -1, 1,0))
            END AS controversialRanking
        FROM posts p
          LEFT JOIN users u ON p.userId=u.id
          LEFT JOIN subreddits s ON p.subredditId = s.id
          LEFT JOIN votes v ON p.id = v.postId
          GROUP by p.id
        ORDER BY ${sortingMethod} DESC LIMIT ? OFFSET ?`, [limit, offset],
        function(err, results) {
          if (err) {
            console.log(err);
            callback(err);
          }
          else {
            // console.log(results);
            var mappedResults = results.map(function(res) {
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
                voteScore: res.voteScore,
                numUpVotes: res.numUpVotes,
                numDownVotes: res.numDownVotes,
                totalVotes: res.totalVotes,
                hottest: res.hottest,
                controversialRanking: res.controversialRanking,
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
    getAllPostsForUser: function(userID, options, callback) {
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
        LIMIT ? OFFSET ?`, [userr, limit, offset],
        function(err, results) {
          if (err) {
            callback(err);
          }
          else {

            var mappedResults = results.map(function(res) {
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
    getSinglePost: function(postId, callback) {

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
          c.id AS commentId,
          c.text AS commentText,
          c.postId AS commentPostId,
          c.createdAt AS commentCreatedAt,
          c.updatedAt AS commentUpdatedAd
        FROM posts p
          JOIN users u ON p.userId=u.id
          JOIN comments c ON c.postId=p.id
          LEFT JOIN comments r ON c.id = r.parentId
          WHERE p.id = ?
          `, [postId],
        function(err, results) {
          if (err) {
            console.log(err);
            callback(err);
          }
          else {
            var mappedResults = results.map(function(res) {
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
              };
            });

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
    },
    createComment: function(comment, callback) {
      if (!comment.userId || !comment.postId) {
        callback(null, new Error('userId and postId required'));
        return;
      }
      if (!comment.parentId) {
        comment.parentId = null;
      }
      
      conn.query(
        'INSERT INTO comments (text, userId, postId, parentId, createdAt) VALUES (?, ?, ?, ?, ?)', 
        [comment.text, comment.userId, comment.postId, comment.parentId, new Date()],
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
              'SELECT text, userId, postId, parentId, createdAt FROM comments WHERE id = ?', [result.insertId],
              function(err, result) {
                if (err) {
                  callback(err);
                }
                else {
                  callback(null, result[0]);
                }
              });
          }
        }
      );
    },
    getCommentsForPost: function(postId, callback) {
      conn.query(`
        SELECT c.id,
          c.text, 
          c.createdAt, 
          c.updatedAt,
          r.id AS replyId,
          r.text AS replyText,
          r.createdAt AS replyCreatedAt, 
          r.updatedAt AS replyUpdatedAt,
          r2.id AS reply2Id,
          r2.text AS reply2Text,
          r2.createdAt AS reply2CreatedAt,
          r2.updatedAt AS reply2Updated,
          c.parentId,
          u.username
        FROM comments c
        LEFT JOIN comments r ON c.id = r.parentId
        LEFT JOIN comments r2 ON r.id = r2.parentId
        JOIN users u ON c.userId = u.id
          WHERE c.postId = ? AND c.parentId is null
          ORDER BY createdAt`, [postId],
        function(err, results) {
          if (err) {
            // console.log(err);
            callback(err);
          }
          else {
            var finalCommentArray = [];
            var indexObj = {};
            
            results.forEach(function(comment){
              if (!indexObj[comment.id]) {
                indexObj[comment.id] = {
                  id: comment.id,
                  text: comment.text,
                  createdAt: comment.createdAt,
                  updatedAt: comment.updatedAt,
                  replies: []
                }
                finalCommentArray.push(indexObj[comment.id]);
              }
               if (!indexObj[comment.replyId] && comment.replyId) {
                indexObj[comment.replyId] = {
                  id: comment.replyId,
                  text: comment.replyText,
                  createdAt: comment.replyCreatedAt,
                  updatedAt: comment.replyUpdatedAt,
                  replies: []
                };
                indexObj[comment.id].replies.push(indexObj[comment.replyId]);
              }
              if(comment.reply2Id){
                var lastReply = {
                  id: comment.reply2Id,
                  text: comment.reply2Text,
                  createdAt: comment.reply2CreatedAt,
                  updatedAt: comment.reply2UpdatedAt,
                };
                indexObj[comment.replyId].replies.push(lastReply);
              }
  
                
            });
            callback(null, finalCommentArray);
          }
        }
      );
    },
    createOrUpdateVote: function(vote, callback) {
      
      if (vote.vote !== -1 && vote.vote !== 0 && vote.vote !== 1) {
        callback(null, new Error('Vote has to be equal to 0,1 or -1'));
        return;
      }
      
      else {
        conn.query(
          'INSERT INTO votes SET postId = ?, userId = ?, vote = ? ON DUPLICATE KEY UPDATE vote = ?', 
          [vote.postId, vote.userId, vote.vote, vote.vote],
          function(err, result) {
            if (err) {
              callback(err);
            }
            else {
              conn.query(
              'SELECT postId, userId, vote FROM votes',
              function(err, result) {
                if (err) {
                  console.log(err);
                  callback(err);
                }
                else {
                  callback(null, result);
                }
              });
            }
          });
      }
    }
  };
};
