//create map
const map = L.map("mapid").setView([-27.2057496, -49.6582354], 2);

//create and add tileLayer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

//create icon
const icon = L.icon({
  iconUrl: "/images/customer.png",
  iconSize: [58, 68],
  iconAnchor: [29, 68],
  popupAnchor: [170, 2],
});

let latlngs = [];
if (document.querySelector('[name=latlngs]').value) {
  latlngs = JSON.parse(document.querySelector('[name=latlngs]').value);
}
let polygon;

let otherPolygons = [];
if (document.querySelector('[name=polygons]').value) {
  otherPolygons = JSON.parse(document.querySelector('[name=polygons]').value);
}
drawOtherPolygons();


updatePolygon()
centerPolygon()

let order = 0;

map.on('click', (event) => {
  const lat = event.latlng.lat;
  const lng = event.latlng.lng;

  order++;
  latlngs.push([lat, lng, order]);

  updatePolygon()
})

function undo() {
  if (latlngs.length == 0) {
    return;
  }

  latlngs.pop();
  updatePolygon()
}

function centerPolygon() {
  // zoom the map to the polygon
  polygon.getBounds()._southWest && polygon.getBounds()._northEast && map.fitBounds(polygon.getBounds());
}

function updatePolygon() {
  polygon && map.removeLayer(polygon);

  //add icon layer
  polygon = L.polygon(latlngs, { color: '#9B111E' }).addTo(map);

  const listPointsContainer = document.getElementById("list-points");

  if (listPointsContainer) {
    listPointsContainer.innerHTML = '';

    latlngs.forEach((latlng, index) => {
      listPointsContainer.insertAdjacentHTML("beforeend",
        `<span title="Lat:${latlng[0]} Lng:${latlng[1]} Order:${latlng[2]}">
        ${index + 1}
        <img src="/images/delete.svg" onclick=deletePoint(${index})>
        </span>`);
    })
  }

  document.querySelector('[name=latlngs]').value = JSON.stringify(latlngs);
}

function deletePoint(index) {
  latlngs.splice(index, 1)
  updatePolygon()
}

function drawOtherPolygons() {
  otherPolygons.forEach(polygon => {
    L.polygon(polygon.points, { color: '#312e38' }).addTo(map)
  });
}