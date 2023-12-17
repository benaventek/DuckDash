(function ($) {
  let userList = $("#userList"),
    wpmButton = $("#Leaderboardwpm"),
    accButton = $("#Leaderboardaccuracy");
  h3title = $("#sortingMethod");
  errorArea = $("#error");

  function bindEventToProfile(userItem) {
    userItem
      .find(".ProfilePicture, .userNameFromRequest")
      .on("click", function (event) {
        event.preventDefault();
        let currentUsername = userItem.find(".userNameFromRequest").text();

        window.location.href = "/profile/" + currentUsername;
      });
  }

  userList.children().each(function (index, element) {
    bindEventToProfile($(element));
  });

  wpmButton.on("click", function () {
    errorArea.hide();
    let requestConfig = {
      method: "POST",
      url: "/leaderboard/wpm",
    };

    $.ajax(requestConfig)
      .done(function (responseMessage) {
        console.log(responseMessage);
        userList.html(responseMessage);
        userList.children().each(function (index, element) {
          bindEventToProfile($(element));
        });
        h3title.text("WPM");
      })
      .fail(function (jqXHR, status, error) {
        if (jqXHR.responseText) {
          let responseHtml = $.parseHTML(jqXHR.responseText);
          let errorContent = $(responseHtml).find("#error").html();

          // Display the extracted error content in the 'errorArea'
          errorArea.html(errorContent);
        }
      });
  });

  accButton.on("click", function () {
    errorArea.hide();
    let requestConfig = {
      method: "POST",
      url: "/leaderboard/accuracy",
    };

    $.ajax(requestConfig)
      .done(function (responseMessage) {
        console.log(responseMessage);
        userList.html(responseMessage);
        userList.children().each(function (index, element) {
          bindEventToProfile($(element));
        });
        h3title.text("Accuracy");
      })
      .fail(function (xhe, status, error) {
        if (jqXHR.responseText) {
          let responseHtml = $.parseHTML(jqXHR.responseText);
          let errorContent = $(responseHtml).find("#error").html();

          // Display the extracted error content in the 'errorArea'
          errorArea.html(errorContent);

          errorArea.show();
        }
      });
  });
})(window.jQuery);
