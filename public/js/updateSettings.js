let name = document.getElementById("name");
let email = document.getElementById("email");
let photo = document.getElementById("photo");
let submitBtn = document.querySelector(".form__group .save-settings");

if (submitBtn) {
  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", name.value);
    form.append("email", email.value);
    form.append("photo", photo.files[0]);

    axios
      .patch("/api/v1/users/update-profile", form)
      .then((res) => {
        showAlert("success", "the data updated successfully");
      })
      .catch((err) => {
        showAlert("error", err.response.data.message);
      });
  });
}
