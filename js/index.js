// ------------ Map --------------------
var map = L.map("map").setView([40.761, -111.891], 13);

// Define multiple tile layers
var osmLayer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 16,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
});

var cartoLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/{style}/{z}/{x}/{y}' + (L.Browser.retina ? '@2x.png' : '.png'), {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: 'abcd',
  style: 'rastertiles/light_all', // You can change the style here
  maxZoom: 20,
  minZoom: 0
});

// Add the default layer (OpenStreetMap) to the map
osmLayer.addTo(map);
var currentLayer = osmLayer; // Default layer

// -------- Date/Time Picker --------
const datepicker = document.getElementById("datepicker");
const timepicker = document.getElementById("timepicker");
const daterange = document.getElementById("daterange");

// ------ Loading Data -------
const defaultTime = new Date(`${datepicker.value} ${timepicker.value}`);
let currentDate = defaultTime;
var data = {};
var dataPromise;

d3.csv("data/metadata.csv", constructCircle).then(loadData);

// Load mapping between route and route polyline cordinates
const routeDataPromise = d3.json("data/routeData.json").then(loadRouteData);
var polyline;

var clickedCoordinatesArray = [];

// // Set up a click event on the map
// map.on("click", function (e) {
//   // e.latlng contains the clicked coordinates
//   var clickedLat = e.latlng.lat;
//   var clickedLng = e.latlng.lng;

//   // Log the latitude and longitude to the console
//   console.log(clickedLat + "," + clickedLng);

//   // Create an array with the clicked coordinates
//   var clickedCoordinates = [clickedLat, clickedLng];

//   // Add the clicked coordinates to the array
//   clickedCoordinatesArray.push(clickedCoordinates);

//   // Log the clicked coordinates array to the console
//   console.log(clickedCoordinatesArray);

//   // Update the info box with the clicked coordinates
// });

// ------------- Graph --------------
const graph = new Graph();



// --------------------- Functions -----------------------------

/**
 * Loads the data file, then runs updateCircles
 * data takes the form data[Date][Station ID] = observed cars at Station ID between the time at Date to an hour ahead 
 */
async function loadData() {
    dataPromise = d3.csv("data/data.csv", function(d) { 
        const date = new Date(d.date);
        delete d.date;
        data[date] = {};
        for (const id of Object.entries(d)) {
            data[date][+id[0]] = +id[1];
        }
    });

    updateMap(defaultTime);
    graph.update();

    window.onresize = handleResize;
}

/**
 * Callback function for loading from routeData.json
 * 
 * @param routeData 
 */
async function loadRouteData(routeData) {
  for (const routeID in routeData) {
    polyline = L.polyline(routeData[routeID], { color: "blue", interactive: false }).addTo(map); // Change interactive if needed for polyline debugging
    POLYLINE_STYLES[routeID] = { color: "blue", polyline: polyline };
  }
}

/**
 * Handles browser window resizing
 * @param {UIEvent} e onresize event
 */
function handleResize(e) {
    graph.update();
}
