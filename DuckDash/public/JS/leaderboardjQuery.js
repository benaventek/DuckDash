(function ($) {
    let userList = $('#userList'),
        wpmButton = $('wpm'),
        accButton = $('acc');
    
    function bindEventToProfile(userItem) {
        userItem.find('.ProfilePicture, .userNameFromRequest').on('click', function (event) {
            event.preventDefault();
            let currentUsername = userItem.find('.userNameFromRequest').text();

            window.location.href = '/profile/' + currentUsername;
        });
    }


    userList.children().each(function (index, element) {
        bindEventToProfile($(element));
    })
    
    

})(window.jQuery)