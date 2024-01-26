// default polyline styles for all routes
var POLYLINE_STYLES = {
    s611: { color: "red" },
    s667: { color: "blue" },
    s668: { color: "g" },
    s306: { color: "blue" },
    s641: { color: "green" },
    s660: { color: "red" },
    s649: { color: "green" },
    s659: { color: "green" },
    s350: { color: "blue" },
    s615: { color: "blue" },
    s354: { color: "blue" },
    s616: { color: "blue" },
    s634: { color: "blue" },
    s711: { color: "blue" },
    s637: { color: "blue" },
    s627: { color: "blue" },
    s628: { color: "blue" },
    s624: { color: "blue" },
    s501: { color: "blue" },
    s340: { color: "blue" },
    s629: { color: "blue" },
    s631: { color: "blue" },
    s353: { color: "blue" },
    s351: { color: "blue" },
    s630: { color: "blue" },
    s302: { color: "blue" },
    s325: { color: "blue" },
    s333: { color: "blue" },
    s332: { color: "blue" },
    s341: { color: "blue" },
    s301: { color: "blue" },
    s406: { color: "blue" },
    s617: { color: "blue" },
    s322: { color: "blue" },
    s317: { color: "blue" },
    s636: { color: "blue" },
    s635: { color: "blue" },
    s674: { color: "blue" },
    s648: { color: "blue" },
    s626: { color: "blue" },
    s673: { color: "blue" },
    s675: { color: "blue" },
    s672: { color: "blue" },
    s658: { color: "blue" },
    s632: { color: "blue" },
    s671: { color: "blue" },
    s670: { color: "blue" },
    s647: { color: "blue" },
    s641: { color: "blue" },
    s661: { color: "blue" },
    s640: { color: "blue" },
    // Add more styles as needed
};
 
const routeIdMapping = {
    611: 's611',
    354: 's354',
    616: 's616',
    634: 's634',
    711: 's711',
    637: 's637',
    627: 's627',
    628: 's628',
    624: 's624',
    501: 's501',
    340: 's340',
    629: 's629',
    631: 's631',
    353: 's353',
    351: 's351',
    630: 's630',
    302: 's302',
    325: 's325',
    333: 's333',
    332: 's332',
    341: 's341',
    301: 's301',
    406: 's406',
    617: 's617',
    322: 's322',
    317: 's317',
    636: 's636',
    635: 's635',
    674: 's674',
    648: 's648',
    626: 's626',
    673: 's673',
    675: 's675',
    672: 's672',
    658: 's658',
    632: 's632',
    671: 's671',
    670: 's670',
    647: 's647',
    641: 's641',
    661: 's661',
    640: 's640',
    306: 's306',
    350: 's350',
    659: 's659',
    649: 's649',
    668: 's668',
    667: 's667',
    660: 's660',
    615: 's615',
};

const radiusMultiplier = 30;
var circles = {};

/**
 * Adds circle to map based on metadata file
 * 
 * @param d Row from metadata.csv  
 */
function constructCircle(d) {
    let circle = L.circle([d.latitude, d.longitude], {
        radius: 0,
        color: '#606060',
        fillOpacity: .3
    }).addTo(map);
    circle.setStyle({ opacity: -1 });
    // circle.setColor("#000");
    circle.on('click', selectStation);
    circles[+d.station_id] = circle;

    // let marker = L.popup([d.latitude, d.longitude]).addTo(map);
    // marker.bindPopup(`Station ID: ${d.station_id}<br>Lat: ${d.latitude}<br>Long: ${d.longitude}`);
    // var popup = L.popup()
    //   .setLatLng([d.latitude, d.longitude])
    //   .setContent(`Sid: ${d.station_id}`)
    //   .addTo(map);
}

/**
 * Updates map to reflect given date (DOESN'T update date-time selector!)
 * @param {Date} date 
 */
async function updateMap(date) {
    await dataPromise;
    await routeDataPromise;
    
    currentDate = date;

    let row = data[date];
    for (const id of Object.keys(row)) {
        const circle = circles[+id];
        const radius = radiusMultiplier * Math.sqrt(row[id]);
        circles[+id].setRadius(radiusMultiplier * Math.sqrt(row[id]));
        circles[+id].stationID = id;
        circles[+id].activity = row[id];

        const trafficColor = getColorFromTraffic(radius);
        // Update polyline style based on station ID
        const stationIdMapped = routeIdMapping[+id];
        updatePolyLine(stationIdMapped, trafficColor)
    }
    
    graph.update();
}

/**
 * Assigns color based on traffic volume
 * 
 * @param {Number} trafficValue traffic volume
 * @returns {String} color
 */
function getColorFromTraffic(trafficValue) {
    if (trafficValue > 2500) {
        return "#8B0000"; // Dark red for very high traffic
    } else if (trafficValue > 2000) {
        return "#FF4500"; // Orange-Red for high traffic
    } else if (trafficValue > 1500) {
        return "#FFA500"; // Orange for moderate traffic
    } else if (trafficValue > 1000) {
        return "#FFFF00"; // Yellow for low traffic
    } else {
        return "#008000"; // Green for very low traffic
    }
}

/**
 * Updates a single polyline
 * 
 * @param {String} stationIdMapped polyline to update based on routeIdMapping
 * @param {String} trafficColor hexcode for color
 */
function updatePolyLine(stationIdMapped, trafficColor) {
    const polyline = POLYLINE_STYLES[stationIdMapped];

    if (polyline && polyline.polyline) {
        let p = polyline.polyline.setStyle({ color: trafficColor });
        //  p.on('click',onPolyLineClick(stationIdMapped))
    } 
    // else {
    //     console.error(`Polyline for station ${stationIdMapped} not found, or polyline not initialized, and color is ${trafficColor}`);
    // }
}

/**
 * Toggles the map layer
 */
function changeMapLayout() {
    // Remove the current layer from the map
    map.removeLayer(currentLayer);
  
    // Toggle between layers
    if (currentLayer === osmLayer) {
      currentLayer = cartoLayer;
    } else {
      currentLayer = osmLayer;
    }
  
    // Add the new layer to the map
    currentLayer.addTo(map);
  }

/**
 * Handles clicks on station circles
 * Toggles selection status of a station
 * 
 * @param {MouseEvent} e click event
 */
function selectStation(e) {
    const selected = e.target.getElement().classList.toggle("selected");
    if (selected) {
        graph.selectedStations.push(e.target.stationID);
        e.target.getElement().setAttribute("fill", GRAPH_COLOR_SCHEME[(6 + e.target.stationID*41) % 256]);
        e.target.getElement().setAttribute("stroke", GRAPH_COLOR_SCHEME[(6 + e.target.stationID*41) % 256]);
    }
    else {
        graph.selectedStations = graph.selectedStations.filter(s => s != e.target.stationID);
        e.target.getElement().setAttribute("fill", "#606060");
        e.target.getElement().setAttribute("stroke", "#606060");
    }
    
    graph.update();
}

/**
 * Debug function for polyline
 * 
 * @param stationIdMapped 
 */
function onPolyLineClick(stationIdMapped) {
    console.log(0)
    alert(`Station id : ${stationIdMapped}`);
}
