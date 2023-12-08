let editProfileBio = document.getElementById("editProfileBioButton");
let CancelEditBio = document.getElementById("CancelEditBioButton");
let editProfilePicture = document.getElementById("editProfilePictureButton");
let CancelEditProfilePicture = document.getElementById(
  "CanceleditProfilePictureButton"
);

let bioInputArea = document.getElementById("changeBio");
let bioInput = document.getElementById("bioInput");
let pictureUploadArea = document.getElementById("uploadPicture");
let pictureInput = document.getElementById("imageUpload");

editProfilePicture.addEventListener("click", () => {
  pictureUploadArea.hidden = false;
  CancelEditProfilePicture.hidden = false;
  editProfilePicture.hidden = true;
});
CancelEditProfilePicture.addEventListener("click", () => {
  pictureUploadArea.hidden = true;
  CancelEditProfilePicture.hidden = true;
  editProfilePicture.hidden = false;
});
pictureUploadArea.addEventListener("submit", async (event) => {
  if (!pictureInput.value) {
    alert("Must upload a picture");
    event.preventDefault();
    return;
  }
  if (pictureInput.files[0].size > 5000000) {
    alert("File must be less than 5MB");
    event.preventDefault();
    return;
  }
  if (
    pictureInput.files[0].type != "image/png" &&
    pictureInput.files[0].type != "image/jpeg"
  ) {
    alert("File must be an image of type .png or .jpeg");
    event.preventDefault();
    return;
  }
});

editProfileBio.addEventListener("click", () => {
  bioInputArea.hidden = false;
  editProfileBio.hidden = true;
  CancelEditBio.hidden = false;
});
CancelEditBio.addEventListener("click", () => {
  bioInputArea.hidden = true;
  editProfileBio.hidden = false;
  CancelEditBio.hidden = true;
});
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
