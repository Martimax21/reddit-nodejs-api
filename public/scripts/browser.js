/* global $*/

$(document).ready(function() {
   $('#suggesttitle').click(function(e) {
      e.preventDefault();
      var submittedUrl = $('.urlInput').val(); 
      $.ajax({
         url: "/suggestTitle"+"?url="+submittedUrl,
         error: function() {
            alert("Something went wrong!");
         },
         success: function(result) {
            $(".postTitle").val(result.title);
         }
      });
   });
   
   
      $('#buttonSub').on('click',function(e){
      e.preventDefault();
      var newSubName = $('input[name=subreddit]').val();
      var newSubDesc = $('input[name=subredditDesc]').val();
 //     console.log($('#test').serializeArray());
      $.post('/createSub', {name: newSubName, description: newSubDesc}, function(res){
         if(res.msg === "ok"){
              $('.dropDown').prepend($('<option/>', { 
        value: newSubName,
        text : newSubName 
    }));
         }
      })
   });
   
});



