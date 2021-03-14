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

let polygons = [];
if (document.querySelector('[name=polygons]').value) {
  polygons = JSON.parse(document.querySelector('[name=polygons]').value);
}
drawPolygons();

function drawPolygons() {
  otherPolygons.forEach(polygon => {
    L.polygon(polygon.points, { color: '#312e38' }).addTo(map)
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
