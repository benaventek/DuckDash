//TODO : do something with the friend request button, also friends list.
let commentInputArea = document.getElementById("addComment");
let commentInput = document.getElementById("commentInput");

commentInputArea.addEventListener("submit", async (event) => {
  if (commentInput.value.length > 250) {
    alert("Comment must be less than 250 characters");
    event.preventDefault();
    return;
  }
  if (commentInput.value.length < 1) {
    alert("Comment must be at least 1 character");
    event.preventDefault();
    return;
  }
});
