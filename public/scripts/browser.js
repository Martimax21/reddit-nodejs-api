

$(document).ready(function() {
   $('#suggesttitle').click(function(e) {
      var submittedUrl = $('.urlInput').val();//todo fix this selector!! 
      e.preventDefault();
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
   console.log('yay!');
});