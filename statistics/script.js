// Constants for the charts, that would be useful.
const CHART_WIDTH = 600;
const CHART_HEIGHT = 250;
const MARGIN = { left: 50, bottom: 20, top: 20, right: 20 };
const ANIMATION_DURATION = 300;

let data;

let stationsArray = [];
let datesArray = [];
let densityArray = [];
let timeArray = Array.from({ length: 24 }, (_, index) => index + 1);

let selectedstation;
let selectedDate;

LoadData();

function setup() {
  // Fill in some d3 setting up here if you need
  // for example, svg for each chart, g for axis and shapes

  //Setting up
  let container = d3.select("#Barchart-div");
  let svg = container.append("svg");
  svg.attr("width", CHART_WIDTH);
  svg.attr("height", CHART_HEIGHT);
  let group = svg.append("g");
  group.attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);

  container = d3.select("#Linechart-div");
  svg = container.append("svg");
  svg.attr("width", CHART_WIDTH);
  svg.attr("height", CHART_HEIGHT);
  group = svg.append("g");
  group.attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);

  container = d3.select("#Areachart-div");
  svg = container.append("svg");
  svg.attr("width", CHART_WIDTH);
  svg.attr("height", CHART_HEIGHT);
  group = svg.append("g");
  group.attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);

  container = d3.select("#Scatterplot-div");
  svg = container.append("svg");
  svg.attr("width", CHART_WIDTH);
  svg.attr("height", CHART_HEIGHT);
  group = svg.append("g");
  group.attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);

  let stationsDropdown = document.getElementById("stations");
  var datesDropdown = document.getElementById("date");

  for (var i = 1; i < stationsArray.length; i++) {
    var option = document.createElement("option");
    option.value = stationsArray[i];
    option.text = stationsArray[i];
    stationsDropdown.add(option);
  }

  if (stationsDropdown.options.length > 0) {
    selectedstation = stationsDropdown.options[0].value;
  }

  for (var i = 0; i < datesArray.length; i++) {
    var option = document.createElement("option");
    option.value = datesArray[i];
    option.text = datesArray[i];
    datesDropdown.add(option);
  }

  if (datesDropdown.options.length > 0) {
    selectedDate = datesDropdown.options[0].value;
  }

  stationsDropdown.addEventListener("change", () => {
    selectedstation = stationsDropdown.value;
    update(data);
  });

  datesDropdown.addEventListener("change", () => {
    selectedDate = datesDropdown.value;
    update(data);
  });

  update(data);
}

/**
 * Render the visualizations
 * @param data
 */
function update(data) {
  densityArray = GetDensity();

  console.log(stationsArray);
  console.log(datesArray);
  console.log(densityArray);
  console.log(timeArray);

  updateBarChart(data);
  updateLineChart(data);
  updateAreaChart(data);
  updateScatterPlot(data);
}

/**
 * Update the bar chart
 */

function updateBarChart() {
  const svg = d3.select("#Barchart-div svg");

  // Remove existing elements with transitions
  svg.selectAll(".x-axis").remove();
  svg.selectAll(".y-axis").remove();
  svg
    .selectAll("rect")
    .transition() // Add a transition for removal
    .duration(500) // Set the duration of the transition in milliseconds
    .attr("height", 0) // Animate the height to 0
    .remove(); // After the transition, remove the elements

  const xscale = d3
    .scaleLinear()
    .domain([0, timeArray.length])
    .range([0, CHART_WIDTH]);

  const yscale = d3
    .scaleLinear()
    .domain([0, d3.max(densityArray)])
    .nice()
    .range([CHART_HEIGHT - 50, 0]);

  const x_axis = d3.axisBottom().scale(xscale).tickValues(d3.range(0, 25));
  const y_axis = d3.axisLeft().scale(yscale);

  const group = svg.select("g");

  // Add a transition when appending the x-axis
  group
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${CHART_HEIGHT - 50})`)
    .transition() // Add a transition for the x-axis
    .duration(500)
    .call(x_axis);

  // Add a transition when appending the y-axis
  group
    .append("g")
    .attr("class", "y-axis")
    .transition() // Add a transition for the y-axis
    .duration(500)
    .call(y_axis);

  // Add transitions when appending the bars
  group
    .attr("class", "bar-chart")
    .selectAll(".bar")
    .data(densityArray)
    .enter()
    .append("rect")
    .attr("x", (_, i) => xscale(i) + CHART_WIDTH / (timeArray.length * 2))
    .attr("y", (d) => yscale(0))
    .attr("width", (CHART_WIDTH - 100) / timeArray.length)
    .attr("height", 0)
    .on("mouseover", function () {
      d3.select(this)
        .classed("hovered", true)
        .transition()
        .duration(ANIMATION_DURATION)
        .attr("fill", ".bar-chart .hovered");
    })
    .on("mouseout", function () {
      d3.select(this)
        .classed("hovered", false)
        .transition()
        .duration(ANIMATION_DURATION)
        .attr("fill", ".bar-chart rect");
    })
    .transition() // Add a transition for the bars
    .duration(500)
    .attr("y", (d) => CHART_HEIGHT - 50 - yscale(d)) // Animate the y position
    .attr("height", (d) => yscale(d)); // Animate the height
}

/**
 * Update the line chart
 */
function updateLineChart() {
  const svg = d3.select("#Linechart-div svg");

  // Remove existing elements with transitions
  svg.selectAll(".x-axis").remove();
  svg.selectAll(".y-axis").remove();
  svg.selectAll(".line").remove();

  const xscale = d3
    .scaleLinear()
    .domain([1, timeArray.length])  // Adjusted x-axis domain
    .range([0, CHART_WIDTH - 50]);

  const yscale = d3
    .scaleLinear()
    .domain([0, d3.max(densityArray)])
    .nice()
    .range([CHART_HEIGHT - 50, 0]);

  const x_axis = d3.axisBottom().scale(xscale).tickValues(d3.range(1, timeArray.length + 1));  // Adjusted tick values
  const y_axis = d3.axisLeft().scale(yscale);

  const line = d3
    .line()
    .x((_, i) => xscale(i + 1))  // Adjusted x-values
    .y((d) => yscale(d));

  const group = svg.select("g");

  // Add a transition when appending the x-axis
  group
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${CHART_HEIGHT - 50})`)
    .transition()
    .duration(500)
    .call(x_axis);

  // Add a transition when appending the y-axis
  group
    .append("g")
    .attr("class", "y-axis")
    .transition()
    .duration(500)
    .call(y_axis);

  const path = group
    .append("path")
    .datum(densityArray)
    .attr("class", "line")
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2);

  const totalLength = path.node().getTotalLength();

  // Add a transition for the line animation
  path
    .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
    .attr("stroke-dashoffset", totalLength)
    .transition()
    .duration(500)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0);
}


/**
 * Update the area chart
 */
function updateAreaChart() {
  const svg = d3.select("#Areachart-div svg");
  svg.selectAll(".x-axis").remove();
  svg.selectAll(".y-axis").remove();
  svg.selectAll("path").remove();

  const xscale = d3
    .scaleLinear()
    .domain([1, timeArray.length])  // Adjusted x-axis domain
    .range([0, CHART_WIDTH - 50]);

  const yscale = d3
    .scaleLinear()
    .domain([0, d3.max(densityArray)])
    .nice()
    .range([CHART_HEIGHT - 50, 0]);

  const x_axis = d3.axisBottom().scale(xscale).tickValues(d3.range(1, timeArray.length + 1));  // Adjusted tick values
  const y_axis = d3.axisLeft().scale(yscale);

  const area = d3
    .area()
    .x((_, i) => xscale(i + 1))  // Adjusted x-values
    .y0(CHART_HEIGHT - 50)
    .y1((d) => yscale(d))
    .curve(d3.curveLinear);

  const group = svg.select("g");

  group
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${CHART_HEIGHT - 50})`)
    .call(x_axis);
  group.append("g").attr("class", "y-axis").call(y_axis);

  // Append a path with a transition for the area chart
  group
    .append("path")
    .attr("class", "area-chart")
    .datum(densityArray)
    .attr("d", area)
    .style("fill", "steelblue")
    .style("fill-opacity", 0)  // Initial opacity set to 0
    .transition()
    .duration(1000)
    .style("fill-opacity", 1);  // Transitioning to opacity 1
}



/**
 * Update the scatter plot.
 */
function updateScatterPlot() {
  const svg = d3.select("#Scatterplot-div svg");
  svg.selectAll(".x-axis").remove();
  svg.selectAll(".y-axis").remove();
  svg.selectAll("circle").remove();

  const xscale = d3
    .scaleLinear()
    .domain([1, timeArray.length])  // Adjusted x-axis domain
    .range([0, CHART_WIDTH - 50]);

  const yscale = d3
    .scaleLinear()
    .domain([0, d3.max(densityArray)])
    .nice()
    .range([CHART_HEIGHT - 50, 0]);

  const x_axis = d3.axisBottom().scale(xscale).tickValues(d3.range(1, timeArray.length + 1));  // Adjusted tick values
  const y_axis = d3.axisLeft().scale(yscale);

  const group = svg.select("g");

  group
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${CHART_HEIGHT - 50})`)
    .call(x_axis);
  group.append("g").attr("class", "y-axis").call(y_axis);

  group
    .attr("class", "scatter-plot")
    .selectAll(".circle")
    .data(densityArray)
    .enter()
    .append("circle")
    .attr("cx", (_, i) => xscale(i + 1))  // Adjusted x-values
    .attr("cy", (d) => yscale(d))
    .attr("r", 0)
    .attr("class", "circle")
    .on("mouseover", function () {
      d3.select(this).style("fill", d3.hsl("#979696"));
      d3.select(this).attr("r", 8);
    })
    .on("mouseout", function () {
      d3.select(this).style("fill", d3.rgb(79, 175, 211));
      d3.select(this).attr("r", 5);
    })
    .on("click", function () {
      console.log("Clicked!");
    })
    .transition()
    .duration(800)
    .attr("r", 5);
}

const GetDensity = () => {
  let selectedDateTime = [];
  for (let i = 0; i < 24; i++) {
    let time;
    if (i < 10) time = "0" + i;
    else time = i;
    selectedDateTime.push(`${selectedDate} ${time}:00:00`);
  }

  console.log(selectedDateTime);

  const matchedRows = data.filter(function (obj) {
    return selectedDateTime.includes(obj.date);
  });
  console.log(matchedRows);

  const density = matchedRows.map((d) => parseFloat(d[selectedstation]));

  return density;
};

/**
 * Update the data according to document settings
 */
function LoadData() {
  //  Load the file indicated by the select menu

  d3.csv(`UtahTraffic.csv`).then((dataOutput) => {
    data = dataOutput;
    console.log(dataOutput);

    stationsArray = Object.keys(dataOutput[0]);
    stationsArray.shift();
    console.log(stationsArray);

    var startDate = new Date(2022, 0, 1);
    var endDate = new Date(2022, 1, 0); // Setting the day to 0 gives the last day of the previous month

    for (
      var date = startDate;
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      datesArray.push(new Date(date).toISOString().split("T")[0]);
    }

    setup();
  });
}

/**
 *  Slice out a random chunk of the provided in data
 *  @param data
 */
function randomSubset(data) {
  return data.filter((d) => Math.random() > 0.5);
}
