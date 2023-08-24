let bookTourBtn = document.getElementById("tour-booking");
const stripe = Stripe(
  "pk_test_51NgkbgEeJUmJLCITz91YO0wunhY7I52bjjLyOuaMqdpYYE0l2WbjErjEZBEAmYWEsXpRigPzXAwSaZLwQWXwKHkZ00UJniC7h5"
);

const bookTour = (tourId) => {
  axios
    .get(`/api/v1/bookings/checkout-session/${tourId}`)
    .then(
      (res) =>
        stripe.redirectToCheckout({
          sessionId: res.data.session.id,
        })
      //   window.location.assign(`${res.data.session.url}`)
    )
    .catch((err) => console.log(err));
};

if (bookTourBtn) {
  bookTourBtn.addEventListener("click", (e) => {
    e.target.textContent = "Processing...";
    let { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
