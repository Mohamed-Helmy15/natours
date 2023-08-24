let sname = document.getElementById("s-name");
let semail = document.getElementById("s-email");
let spassword = document.getElementById("s-password");
let sconfirmPassword = document.getElementById("s-confirm-password");
let signUpBtn = document.getElementById("signup");

if (signUpBtn) {
  signUpBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let name = sname.value;
    let email = semail.value;
    let password = spassword.value;
    let confirmPassword = sconfirmPassword.value;

    axios
      .post("/api/v1/users/signup", {
        name,
        email,
        password,
        confirmPassword,
      })
      .then((res) => {
        showAlert("success", `The ${name} user created successfully`);
        setTimeout(() => {
          window.location.assign("/login");
        }, 1000);
      })
      .catch((err) => showAlert("error", err.response.data.message));
  });
}
