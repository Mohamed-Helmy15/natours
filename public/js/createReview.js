let reviewTourId = document.querySelector(".review");
let reviewText = document.querySelector(".review textarea");
let rating = document.querySelector(".review input[type='text']");
let reviewBtn = document.querySelector(".review button");

if (reviewBtn) {
  reviewBtn.addEventListener("click", function (e) {
    e.preventDefault();
    let review = {
      review: reviewText.value,
      rating: rating.value,
    };
    axios
      .post(`/api/v1/tours/${reviewTourId.dataset.tourId}/reviews`, review)
      .then((res) => {
        showAlert("success", `The Review created successfully`);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((err) => showAlert("error", err.response.data.message));
  });
}
