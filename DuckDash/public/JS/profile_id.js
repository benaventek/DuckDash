let sendFriendRequestButton = document.getElementById(
  "SendFriendRequestButton"
);

sendFriendRequestButton.addEventListener("click", async () => {
  let username = document.getElementById("userName").innerHTML;
  let result = await fetch("/profile/" + username, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username }),
  });
});
