(function ($) {
  let userSearchForm = $("#search-form"),
    displaynameInput = $("#displaynameInput"),
    profileArea = $("#profile-area");
  errorArea = $("#error");

  function bindEventToProfile(userItem) {
    userItem
      .find(".ProfilePicture, .displaynameFromRequest")
      .on("click", function (event) {
        event.preventDefault();
        let currentdisplayname = userItem
          .find(".displaynameFromRequest")
          .text();

        window.location.href = "/profile/" + currentdisplayname;
      });
  }

  userSearchForm.submit(function (event) {
    event.preventDefault();
    errorArea.hide();
    const alphanumeric = /^[a-zA-Z0-9]+$/;

    let displayname = displaynameInput.val();
    displayname = displayname.trim();

    if (
      displayname &&
      typeof displayname === "string" &&
      alphanumeric.test(displayname)
    ) {
      let requestConfig = {
        method: "POST",
        url: "/search",
        data: { displayname: displayname },
      };

      $.ajax(requestConfig)
        .done(function (responseMessage) {
          console.log(responseMessage);
          let newElement = $(responseMessage);
          bindEventToProfile(newElement);
          profileArea.html(newElement);
          profileArea.show();
          displaynameInput.val("");
          displaynameInput.focus();
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          if (jqXHR.responseText) {
            let responseHtml = $.parseHTML(jqXHR.responseText);
            let errorContent = $(responseHtml).find("#error").html();

            // Display the extracted error content in the 'errorArea'
            errorArea.html(errorContent);
            profileArea.hide();
            errorArea.show();
            displaynameInput.val("");
            displaynameInput.focus();
          }
        });
    } else {
      profileArea.hide();
      alert("Enter a valid Display Name");
    }
  });
})(window.jQuery);
