$(document).ready(function() {
    $(".voting").submit(function(e) {
        console.log(e);
        e.preventDefault();
        
        var formData = {};
        
        $(this).serializeArray().forEach(function(inputField){
            formData[inputField.name] = inputField.value;
        });
        
        $.ajax({
            url: "/vote", 
            type: "POST",
            data: formData,
            error: function() {
                alert("Something went wrong!");
            },
            success: function(result) {
               $("#scoreUp_postId_"+result.postId).text(result.up);
               $("#scoreDown_postId_"+result.postId).text(result.down);
            }
        });
    });
});

/* 
Our code should listen to this submit event and prevent the submit from taking place
Our code should find the two hidden inputs inside the form, and find out their value
Our code should do an ajax POST request to our /vote URL, passing it the parameters voteDirection and contentId
At this point, our server will receive the POST and do its usual business of creating the vote
For now, our server is sending a redirect response, which our AJAX code may not have much use for... 
    $.post(
        '/newContact',
        $('#contactForm').serialize()
    ).then(
        function(response) {
            alert('thanks for contacting us');
        },
        function(err) {
            if (err) {
                alert('this functionality doesnt exist');
            }
        }
    )
            */