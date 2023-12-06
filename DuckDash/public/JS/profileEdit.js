let editProfileBio = document.getElementById("editProfileBio");
let editProfilePicture = document.getElementById("editProfilePicture");

let bioInputArea = document.getElementById("changeBio");

editProfilePicture.addEventListener("click", () => {
  console.log("editProfileBio clicked");
});

editProfileBio.addEventListener("click", () => {
  bioInputArea.hidden = false;
});
