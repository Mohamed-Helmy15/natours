const form = document.querySelector(".form");
const logOutBtn = document.querySelector(".nav__el--logout");

const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  setTimeout(() => {
    hideAlert();
  }, 5000);
};

const login = (email, password) => {
  axios
    .post("/api/v1/users/login", {
      email,
      password,
    })
    .then((res) => {
      showAlert("success", "logged in successfully");
      setTimeout(() => {
        location.assign("/");
      }, 1500);
    })
    .catch((err) => {
      showAlert("error", err.response.data.message);
    });
};

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}

const logOutRequest = () => {
  axios
    .get("/api/v1/users/logout")
    .then((res) => {
      window.location.assign("/");
    })
    .catch((err) => {
      showAlert("error", "log out failed");
    });
};

if (logOutBtn) {
  logOutBtn.addEventListener("click", logOutRequest);
}
