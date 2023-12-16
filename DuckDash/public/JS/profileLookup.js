(function ($) {
    let userSearchForm = $('#search-form'),
        userNameInput = $('#userNameInput'),
        profileArea = $('#profile-area');
        errorArea = $('#error');


    function bindEventToProfile(userItem) {
        userItem.find('.ProfilePicture, .userNameFromRequest').on('click', function (event) {
            event.preventDefault();
            let currentUsername = userItem.find('.userNameFromRequest').text();

            window.location.href = '/profile/' + currentUsername;
        });
    }

    userSearchForm.submit(function (event) {
        event.preventDefault();
        errorArea.hide();
        const alphanumeric = /^[a-zA-Z0-9]+$/;

        let username = userNameInput.val();
        username = username.trim();

        if(username && typeof username === 'string' && alphanumeric.test(username)){
            let requestConfig = {
                method: 'POST',
                url: '/search',
                data: {username: username}
            };

            $.ajax(requestConfig)
            .done(function (responseMessage) {
                console.log(responseMessage);
                let newElement = $(responseMessage);
                bindEventToProfile(newElement);
                profileArea.html(newElement);
                profileArea.show();
                userNameInput.val('');
                userNameInput.focus();
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                if(jqXHR.responseText){
                    let responseHtml = $.parseHTML(jqXHR.responseText);
                    let errorContent = $(responseHtml).find('#error').html();
                

                    // Display the extracted error content in the 'errorArea'
                    errorArea.html(errorContent);
                    profileArea.hide();
                    errorArea.show();
                    userNameInput.val('');
                    userNameInput.focus();
                }
            });
        }
        else{
            profileArea.hide();
            alert('Enter a valid username');
        }
    })

})(window.jQuery)

