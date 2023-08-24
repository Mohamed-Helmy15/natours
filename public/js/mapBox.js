const mapLocations = document.getElementById("map");
let locations;
if (mapLocations) {
  locations = JSON.parse(mapLocations.dataset.locations);
  mapboxgl.accessToken =
    "pk.eyJ1IjoibW9oYW1lZC1oZWxteTE1IiwiYSI6ImNsa3lpeHhvNDA5aTgzb3MxNDg4YTY4dzAifQ.jkDr2IhXcF2CA64qXh__pA";

  const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/streets-v12", // style URL
    scrollZoom: false,
    // zoom: 9, // starting zoom
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    const el = document.createElement("div");
    el.className = "marker";

    new mapboxgl.Marker({
      element: el,
      anchor: "bottom",
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day: ${loc.day}, ${loc.description}</p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      right: 100,
      left: 100,
    },
  });
}
