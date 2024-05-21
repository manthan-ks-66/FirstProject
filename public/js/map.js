mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: coordinates, // starting position [lng, lat]
  zoom: 11, // starting zoom
});

// Map location marker
const marker = new mapboxgl.Marker({ color: "red " })
  .setLngLat(coordinates)
  .addTo(map);
