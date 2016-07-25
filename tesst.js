    functions.getComments(commentsLink, function(err, comments) {
      
      function getReplies(arr, level){
        arr.forEach(function(reply){
          var indent = '';
          for(var i = 0; i < level; i++){
            indent = indent + '   ';
          }
          
          if(reply.data.body){
            console.log(wrap(reply.data.body, {indent: indent}));
          }
          if(reply.data.replies) {
            getReplies(reply.data.replies.data.children, level + 1);
          }
        });
      }
      
      
      
      //code test from Thursday July 21st
      
                  var commentsAndReplies = {};
            results.forEach(function(topComment) {
              if (topComment.parentId === null) {
                var topCommentObj = {
                  id: topComment.id,
                  text: topComment.text,
                  createdAt: topComment.createdAt,
                  updatedAt: topComment.updatedAt,
                  user: topComment.username,
                  reply: []
                };

                results.forEach(function(reply) {
                  if (reply.parentId === topComment.id) {
                    var replyObj = {
                      id: reply.id,
                      text: reply.text,
                      createdAt: reply.createdAt,
                      updatedAt: reply.updatedAt,
                      user: reply.username,
                      reply: []
                    };
                    commentsAndReplies[topComment.id] = topCommentObj;
                      
                      commentsAndReplies[topComment.id].reply.push(replyObj);
                    // commentsAndReplies[topComment.id].reply.forEach(function(reply1) {
                    //       if (reply1.id === reply.parentId) {
                    //         reply1.reply.push(replyObj);
                    //       }
                    //     });

                    results.forEach(function(someReplies) {
                      if (someReplies.parentId === reply.id) {
                        var reply2Obj = {
                          id: someReplies.id,
                          text: someReplies.text,
                          createdAt: someReplies.createdAt,
                          updatedAt: someReplies.updatedAt,
                          user: someReplies.username,
                          reply: []
                        };
                        commentsAndReplies[topComment.id].reply.forEach(function(moreReplies) {
                          if (moreReplies.id === someReplies.parentId) {
                            moreReplies.reply.push(reply2Obj)
                          }
                        });
                      }
                    });
                  }
                  else {
                    commentsAndReplies[topComment.id] = topCommentObj;
                  }
                });
              }

            });