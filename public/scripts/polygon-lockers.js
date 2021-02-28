//create map
const map = L.map("mapid").setView([-27.2057496, -49.6582354], 2);

//create and add tileLayer
L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
}).addTo(map);

//create icon
const icon = L.icon({
  iconUrl: "/images/customer.png",
  iconSize: [28, 34],
  iconAnchor: [14, 34],
  popupAnchor: [170, 2],
});

//create icon
const iconLocker = L.icon({
  iconUrl: "/images/lockerPin.svg",
  iconSize: [28, 34],
  iconAnchor: [14, 34],
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
drawPolygon();
centerPolygon();

function centerPolygon() {
  // zoom the map to the polygon
  polygon.getBounds()._southWest && polygon.getBounds()._northEast && map.fitBounds(polygon.getBounds());
}

function drawPolygon() {
  polygon && map.removeLayer(polygon);

  //add icon layer
  polygon = L.polygon(latlngs, { color: '#aaa' }).addTo(map);

  document.querySelector('[name=latlngs]').value = JSON.stringify(latlngs);
}

function drawOtherPolygons() {
  otherPolygons.forEach(polygon => {
    L.polygon(polygon.points, { color: '#9B111E' }).addTo(map)
  });
}

//customers 
let customers = [];

const customers_data = JSON.parse(document.querySelector('[name=customers_data]').value);

document.querySelector('[name=quantityCustomers]').value = customers_data.length;

customers_data.forEach((customer)=>{
  const customerMarker = L.marker([customer[0], customer[1]], { icon });
  customers.push(customerMarker);
  customerMarker.addTo(map);
});

//lockers
let lockers = [];

const lockers_data = JSON.parse(document.querySelector('[name=lockers_data]').value);

document.querySelector('[name=quantityLockers]').value = lockers_data.length;

lockers_data.forEach((locker)=>{
  const lockerMarker = L.marker([locker[0], locker[1]], { icon: iconLocker });
  lockers.push(lockerMarker);
  lockerMarker.addTo(map);
});

function latLngFrom(lockers) {
  return lockers.map((locker) => ({ lat: locker._latlng.lat, lng: locker._latlng.lng }));
}

function addLocker(lat, lng) {
  const locker = L.marker([lat, lng], { icon: iconLocker });
  if (polygon.contains(locker.getLatLng())) {
    lockers.push(locker);
    locker.addTo(map);
    document.querySelector('[name=quantityLockers]').value = lockers.length;
    document.querySelector('[name=lockers_data]').value = JSON.stringify(latLngFrom(lockers));
    return 1;
  }
  return 0;
}

function createRandomPoints() {
  let created = 0;
  const quantity = document.querySelector('[name=quantityRandomPoints]').value;

  const bounds = polygon.getBounds();

  var x_max = bounds.getEast();
  var x_min = bounds.getWest();
  var y_max = bounds.getSouth();
  var y_min = bounds.getNorth();

  while (created < quantity) {

    const lat = y_min + (Math.random() * (y_max - y_min));

    const lng = x_min + (Math.random() * (x_max - x_min));

    created += addLocker(lat, lng);
  }

  document.querySelector('[name=quantityRandomPoints]').value = 0;
}

map.on('click', (event) => {
  const lat = event.latlng.lat;
  const lng = event.latlng.lng;
  addLocker(lat, lng);
})