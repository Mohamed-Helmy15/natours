let oldPassword = document.querySelector("#password-current");
let newPassword = document.querySelector("#password");
let confirmNewPassword = document.querySelector("#password-confirm");
let submitPasswordBtn = document.querySelector(".btn--save-password");

if (submitPasswordBtn) {
  submitPasswordBtn.addEventListener("click", (e) => {
    e.preventDefault();
    axios
      .patch("/api/v1/users/update-password", {
        oldPassword: oldPassword.value,
        newPassword: newPassword.value,
        confirmNewPassword: confirmNewPassword.value,
      })
      .then((res) => {
        showAlert(
          "success",
          "password updated successfully, please login again"
        );
        setTimeout(() => {
          logOutRequest();
        }, 1000);
      })
      .catch((err) => {
        showAlert("error", err.response.data.message);
      });
  });
}
