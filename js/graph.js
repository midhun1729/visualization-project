const GRAPH_COLOR_SCHEME = ["#23171b","#271a28","#2b1c33","#2f1e3f","#32204a","#362354","#39255f","#3b2768","#3e2a72","#402c7b","#422f83","#44318b","#453493","#46369b","#4839a2","#493ca8","#493eaf","#4a41b5","#4a44bb","#4b46c0","#4b49c5","#4b4cca","#4b4ecf","#4b51d3","#4a54d7","#4a56db","#4959de","#495ce2","#485fe5","#4761e7","#4664ea","#4567ec","#446aee","#446df0","#426ff2","#4172f3","#4075f5","#3f78f6","#3e7af7","#3d7df7","#3c80f8","#3a83f9","#3985f9","#3888f9","#378bf9","#368df9","#3590f8","#3393f8","#3295f7","#3198f7","#309bf6","#2f9df5","#2ea0f4","#2da2f3","#2ca5f1","#2ba7f0","#2aaaef","#2aaced","#29afec","#28b1ea","#28b4e8","#27b6e6","#27b8e5","#26bbe3","#26bde1","#26bfdf","#25c1dc","#25c3da","#25c6d8","#25c8d6","#25cad3","#25ccd1","#25cecf","#26d0cc","#26d2ca","#26d4c8","#27d6c5","#27d8c3","#28d9c0","#29dbbe","#29ddbb","#2adfb8","#2be0b6","#2ce2b3","#2de3b1","#2ee5ae","#30e6ac","#31e8a9","#32e9a6","#34eba4","#35eca1","#37ed9f","#39ef9c","#3af09a","#3cf197","#3ef295","#40f392","#42f490","#44f58d","#46f68b","#48f788","#4af786","#4df884","#4ff981","#51fa7f","#54fa7d","#56fb7a","#59fb78","#5cfc76","#5efc74","#61fd71","#64fd6f","#66fd6d","#69fd6b","#6cfd69","#6ffe67","#72fe65","#75fe63","#78fe61","#7bfe5f","#7efd5d","#81fd5c","#84fd5a","#87fd58","#8afc56","#8dfc55","#90fb53","#93fb51","#96fa50","#99fa4e","#9cf94d","#9ff84b","#a2f84a","#a6f748","#a9f647","#acf546","#aff444","#b2f343","#b5f242","#b8f141","#bbf03f","#beef3e","#c1ed3d","#c3ec3c","#c6eb3b","#c9e93a","#cce839","#cfe738","#d1e537","#d4e336","#d7e235","#d9e034","#dcdf33","#dedd32","#e0db32","#e3d931","#e5d730","#e7d52f","#e9d42f","#ecd22e","#eed02d","#f0ce2c","#f1cb2c","#f3c92b","#f5c72b","#f7c52a","#f8c329","#fac029","#fbbe28","#fdbc28","#feb927","#ffb727","#ffb526","#ffb226","#ffb025","#ffad25","#ffab24","#ffa824","#ffa623","#ffa323","#ffa022","#ff9e22","#ff9b21","#ff9921","#ff9621","#ff9320","#ff9020","#ff8e1f","#ff8b1f","#ff881e","#ff851e","#ff831d","#ff801d","#ff7d1d","#ff7a1c","#ff781c","#ff751b","#ff721b","#ff6f1a","#fd6c1a","#fc6a19","#fa6719","#f96418","#f76118","#f65f18","#f45c17","#f25916","#f05716","#ee5415","#ec5115","#ea4f14","#e84c14","#e64913","#e44713","#e24412","#df4212","#dd3f11","#da3d10","#d83a10","#d5380f","#d3360f","#d0330e","#ce310d","#cb2f0d","#c92d0c","#c62a0b","#c3280b","#c1260a","#be2409","#bb2309","#b92108","#b61f07","#b41d07","#b11b06","#af1a05","#ac1805","#aa1704","#a81604","#a51403","#a31302","#a11202","#9f1101","#9d1000","#9b0f00","#9a0e00","#980e00","#960d00","#950c00","#940c00","#930c00","#920c00","#910b00","#910c00","#900c00","#900c00","#900c00"];

class Graph {
    constructor() {
        this.margin = { left: 80, bottom: 50, top: 20, right: 20 };

        this.updateGraphDates();
        this.selectedStations = []; // Array of IDs of selected stations
        
        for (const input of document.querySelectorAll("#graphdate > div > input")) {
            input.onchange = this.handleGraphDateChange;
        }
        document.querySelector("#graphdate > div > button").onclick = this.handleResetButton;

        document.getElementById("currentTimeBounds").onmouseenter = this.handleCurrentTimeMouseenter;
        document.getElementById("currentTimeBounds").onmouseleave = this.handleCurrentTimeMouseleave;
        document.getElementById("graph").onclick = this.handleGraphClick;
    }
    
    async update() {
        await dataPromise;

        const svg = d3.select("#graph");
        const [width, height] = [svg.node().getBoundingClientRect().width, svg.node().getBoundingClientRect().height];
        const timeRange = this.getTimeRange();
        
        svg.select(".xlabel-middle")
            .attr("x", (width - this.margin.right + this.margin.left)/2)
            .attr("y", height - 10)
        svg.select(".xlabel-left")
            .attr("x", 10)
            .attr("y", height - 10)
        svg.select(".xlabel-right")
            .attr("x", width - 10)
            .attr("y", height - 10)
        svg.select(".ylabel")
            .attr("transform", `translate(25, ${(height - this.margin.bottom + this.margin.top)/2}) rotate(-90)`)
        
        const xdomain = [this.startTime, this.endTime];
        let ydomain = [0, 0];
        for (const station of this.selectedStations) {
            for (const time of timeRange) {
                if (data[time][station] > ydomain[1]) {
                    ydomain[1] = data[time][station];
                }
            }
        }
        
        const x = d3.scaleTime()
            .domain(xdomain)
            .range([this.margin.left, width - this.margin.right]);
        this.xinv = x.invert;
        const y = d3.scaleLinear()
            .domain(ydomain)
            .range([height - this.margin.bottom, this.margin.top]);
        const line = d3.line()
            .x(d => x(d.time))
            .y(d => y(d.traffic));

        svg.select("#lines").selectAll("path").data(this.selectedStations)
            .join("path")
            .attr("class", "line")
            .attr("stationID", d => d)
            .style("stroke", d => GRAPH_COLOR_SCHEME[(6 + d*41) % 256])
            .attr("d", d => line(timeRange.map(function(t) {
                return {time: t, traffic: data[t][d]}
            })));
        svg.select("#x-axis")
            .attr("transform", `translate(0, ${height - this.margin.bottom})`)
            .call(d3.axisBottom(x).tickFormat(this.axisFormat()));
        
        let temp = d3.max([x(currentDate), x(xdomain[0])]);
        temp = d3.min([temp, x(xdomain[1])]);
        svg.selectAll("#overlay > line")
            .attr("x1", temp).attr("y1", this.margin.top)
            .attr("x2", temp).attr("y2", height - this.margin.bottom);
    }
   
    /**
     * Generates a range of dates based on start and end times
     * @returns Array
     */
    getTimeRange() {
        var result = [];
        var current = this.startTime;

        while (current <= this.endTime) {
            result.push(current);
            current = new Date(current.getTime() + 1000*60*60); // Adds one hour to current
        }
        
        return result;
    }
    
    /**
     * Updates date constraints on graph to match inputs
     */
    updateGraphDates() {
        const inputs = document.querySelectorAll("#graphdate > div > input");
        this.startTime = new Date(`${inputs[0].value} ${inputs[1].value}`)
        this.endTime = new Date(`${inputs[2].value} ${inputs[3].value}`)
    }
 
    /**
     * Formats graph axis based on zoom level
     * @returns d3 format function
     */
    axisFormat() {
        if(this.endTime.getTime() - this.startTime.getTime() < 7*(1000*60*60*24)) {
            return d3.timeFormat("%b %e %I %p") 
        }
            
        return d3.timeFormat("%b %e") 
    }
    
    /**
     * Shows popup of data at current time
     */
    currentTimePopup() {
        const stationsSorted = this.selectedStations.sort((a,b) => data[currentDate][b] - data[currentDate][a]);

        const popup = d3.select("#overlay").append("g")
            .attr("class", "popup");
        
        let box = popup.append("rect")
            .attr("x", +document.getElementById("currentTime").getAttribute("x1") + 5)
            .attr("y", this.margin.top - 5)
            .attr("rx", 5)

        popup.selectAll("text").data(stationsSorted).join("text")
            .attr("x", +document.getElementById("currentTime").getAttribute("x1") + 10)
            .attr("y", (_,i) => this.margin.top + 35+20*i)
            .attr("fill", d => GRAPH_COLOR_SCHEME[(6 + d*41) % 256])
            .text(d => `Station 0${d}: ${data[currentDate][d]}`);
        
        popup.append("text")
            .attr("x", +document.getElementById("currentTime").getAttribute("x1") + 10)
            .attr("y", this.margin.top + 15)
            .style("fill", "white")
            .text("Selected Stations")

        box.attr("width", popup.node().getBBox().width + 10)
            .attr("height", popup.node().getBBox().height + 10);
        if (+document.getElementById("currentTime").getAttribute("x1") + popup.node().getBBox().width 
            > +document.getElementById("graph").getBBox().width) {
                popup.attr("transform", `translate(-${popup.node().getBBox().width+10},0)`)
        }
    }

    /**
     * Listens for changes from graph date inputs
     * @param {Event} e onchange event
     */
    handleGraphDateChange(e) {
        graph.updateGraphDates();
        graph.update();        
    }

    /**
     * Listens for mouseovers on the currentTime line
     * @param {MouseEvent} e 
     */
    handleCurrentTimeMouseenter(e) {
        graph.currentTimePopup();
    }

    handleCurrentTimeMouseleave(e)  {
        document.getElementsByClassName("popup")[0].remove();
    }
    
    handleResetButton(e) {
        for (const station of graph.selectedStations) {
            circles[station].getElement().classList.toggle("selected");
            circles[station].getElement().setAttribute("fill", "#606060");
            circles[station].getElement().setAttribute("stroke", "#606060");     
        }
        
        graph.selectedStations = [];
        graph.update();
    }
    
    /**
     * Handles clicking on graph
     * 
     * @param {MouseEvent} e 
     */
    handleGraphClick(e) {
        if (e.offsetX >= graph.margin.left && e.offsetX <= e.target.getBoundingClientRect().width - graph.margin.right
            && e.offsetY <= e.target.getBoundingClientRect().height - graph.margin.bottom ) {
            var datetime = graph.xinv(e.offsetX);
            datetime.setMinutes(0,0,0);
            
            setDateTime(datetime);
        }
    }
}
