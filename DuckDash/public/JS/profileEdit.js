let editProfileBio = document.getElementById("editProfileBioButton");
let editProfilePicture = document.getElementById("editProfilePictureButton");

let bioInputArea = document.getElementById("changeBio");
let bioInput = document.getElementById("bioInput");
let pictureUploadArea = document.getElementById("uploadPicture");
let pictureInput = document.getElementById("imageUpload");

editProfilePicture.addEventListener("click", () => {
  pictureUploadArea.hidden = false;
  pictureUploadArea.addEventListener("submit", async (event) => {
    if (!pictureInput.value) {
      alert("Must upload a picture");
      event.preventDefault();
      return;
    }
    console.log(pictureInput.files[0]);
  });
});

editProfileBio.addEventListener("click", () => {
  bioInputArea.hidden = false;
  bioInputArea.addEventListener("submit", async (event) => {
    if (bioInput.value.length > 250) {
      alert("Bio must be less than 250 characters");
      event.preventDefault();
      return;
    }
    if (bioInput.value.length < 1) {
      alert("Bio must be at least 1 character");
      event.preventDefault();
      return;
    }
  });
});
