
function init() {
    /* Code for the very first part of the D3 exercise (omitted)*/
    var dataset = [5, 10, 15, 20, 25];

    d3.select("body").selectAll("p")
        .data(dataset)
        .enter()
        .append("p")
        .text(function (d) { return "I can count up to " + d; })
        .style("color", function (d) {
            if (d > 15) {   //Threshold of 15
                return "red";
            } else {
                return "black";
            }
        });
}


function plotViz1() {
    var btn = document.createElement("BUTTON");        // Create a <button> element
    var t = document.createTextNode("Change Year");       // Create a text node
    btn.appendChild(t);                                // Append the text to <button>
    document.getElementById("btn_1").appendChild(btn);                    // Append <button> to <body>


    // sfdata is the SF crime data for 2003 and 2015
   
    var districts = ["MISSION", "TENDERLOIN", "NORTHERN", "RICHMOND", "BAYVIEW",
                     "CENTRAL", "PARK", "TARAVAL", "SOUTHERN", "INGLESIDE"];

    /* This preprocessing step is not nescessary anymore 
    var district_2003 = [];
    var district_2015 = [];
    var district_all = [];

    for (var i = 0; i < districts.length; i++) {
        district_2003[i] = [0, 0];
        district_2015[i] = [0, 0];
        district_all[i] = {
            "district": districts[i],
            "index": i,
            "value": 0,
        }; 
    }

    let count = 0;
    for (idx in sfdata["crimes"]) {
        var crime = sfdata["crimes"][idx];

        var index = districts.indexOf(crime["PdDistrict"]);
        district_all[index].value++;
        if (crime["Date"].split("/")[2] == "2015") {

            if (crime["Category"] == "PROSTITUTION") {
                district_2015[index][0]++; // x - axis
            } else if (crime["Category"] == "VEHICLE THEFT") {
                district_2015[index][1]++; // y - axis
            }

        } else {
            if (crime["Category"] == "PROSTITUTION") {
                district_2003[index][0]++; // x - axis
            } else if (crime["Category"] == "VEHICLE THEFT") {
                district_2003[index][1]++; // y - axis
            }
        }
        count++;
    } */
    
    //This data is the result of the above preprocessing (I could have done this in python aswell)
    district_2003 = [[713, 2063], [527, 371], [581, 1879], [15, 1081], [11, 2121], [70, 1193], [2, 1207], [10, 1665], [18, 1426], [5, 2319]];
    district_2015 = [[66, 1198], [23, 113], [42, 945], [9, 561], [7, 985], [44, 552], [1, 640], [81, 789], [96, 795], [5, 1368]];

    //Width and height
    var w = 1200;
    var h = 600;
    var padding = 100;
    
    app.dataset_1 = district_2003;

    //Create scale functions
    var xScale = d3.scale.linear()
								 .domain([0, 750])
								 .range([padding, w - padding * 2]);

    var yScale = d3.scale.linear()
                         .domain([0, 2500])
                         .range([h - padding, padding]);

    var rScale = d3.scale.linear()
                         .domain([0, d3.max(app.dataset_1, function (d) { return (d[1] + d[0]); })])
                         .range([1, 16]);

    //Define X axis
    var xAxis = d3.svg.axis()
                      .scale(xScale)
                      .orient("bottom")
                      .ticks(10);

    //Define Y axis
    var yAxis = d3.svg.axis()
                      .scale(yScale)
                      .orient("left")
                      .ticks(10);

    //Create SVG element
    var svg = d3.select("#viz1")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    //Append the datapoints as circles
    svg.selectAll("circle")
       .data(app.dataset_1)
       .enter()
       .append("circle")
       .attr("cx", function (d) {
           return xScale(d[0]);
       })
       .attr("cy", function (d) {
           return yScale(d[1]);
       })
       .attr("r", function (d) {
           return rScale(d[1]) + rScale(d[0]);
       }).on("mouseover", function (d) {

           d3.select(this)
             .attr("fill", "gray");

           var xPosition = xScale(d[0]);
           var yPosition = yScale(d[1] + padding);

           console.log(xPosition)
           //Create the tooltip label
           svg.append("text")
          .attr("id", "tooltip")
          .attr("x", xPosition)
          .attr("y", yPosition)
          .attr("text-anchor", "middle")
          .attr("font-family", "sans-serif")
          .attr("font-size", "11px")
          .attr("font-weight", "bold")
          .attr("fill", "black")
          .text("Prostitution: " + d[0] + "    Vehicle Theft: " + d[1])
       }).on("mouseout", function () {

           //Remove the tooltip
           d3.selectAll("#tooltip")
               .transition()
               .duration(300)
               .attr("fill", "white")
               .remove();
           d3.select(this)
             .transition()
             .duration(350)
             .attr("fill", "black");
       });

    svg.selectAll("text")
       .data(app.dataset_1)
       .enter()
       .append("text")
       .text(function (d) {
           var index = app.dataset_1.indexOf(d);
           return districts[index];
       })
       .attr("x", function (d) {
           return xScale(d[0]);
       })
       .attr("y", function (d) {
           return yScale(d[1]);
       })
       .attr("font-family", "sans-serif")
       .attr("font-size", "11px")
       .attr("fill", "#8a8a98");

    //Create X axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

    svg.append("text")      // text label for the x axis
      .attr("x", h - padding / 2)
      .attr("y", w / 2 - padding / 2)
      .style("text-anchor", "middle")
      .text("PROSTITUTION");

    //Create Y axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (h / 2))
        .attr("y", padding / 4)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("VEHICLE THEFT");

    //Event listener for the change year button
    btn.onclick = function () {
        if (app.dataset_1 == district_2003) {
            app.dataset_1 = district_2015;
            document.getElementById("viz1_title").innerHTML = "SF Crime Prostitution vs Vehicle Theft 2015"
        } else {
            app.dataset_1 = district_2003
            document.getElementById("viz1_title").innerHTML = "SF Crime Prostitution vs Vehicle Theft 2003"
        }

        //Update all labels with a smooth transition
        svg.selectAll("text")
           .data(app.dataset_1)
           .transition()       
           .duration(1000)      
           .text(function (d) {
               var index = app.dataset_1.indexOf(d);
               return districts[index];
           })
       .attr("x", function (d) {
           return xScale(d[0]);
       })
       .attr("y", function (d) {
           return yScale(d[1]);
       })
       .attr("font-family", "sans-serif")
       .attr("font-size", "11px")
       .attr("fill", "#8a8a98");

        //Update all circles with a smooth transition
        svg.selectAll("circle")
       .data(app.dataset_1)
       .transition()       
       .duration(1000)    
       .attr("cx", function (d) {
           return xScale(d[0]);
       })
       .attr("cy", function (d) {
           return yScale(d[1]);
       })
       .attr("r", function (d) {

           return rScale(d[1]) + rScale(d[0]);
       });
    };


    /* PLOT 2 * was part of the exercise but not the assignment, so it is omitted
    //Width and height

    //Width and height
    var w2 = 1200;
    var h2 = 600;
    var padding2 = 100;
                   
    app.dataset_2 = district_all.sort().reverse();

    console.log(districts);
    var xScale2 = d3.scale.ordinal()
							.rangeBands([padding2, w2])
                            .domain(app.dataset_2.map(function (d) { return d.index; }));
    
    var yScale2 = d3.scale.linear()
                     .domain([0, d3.max(app.dataset_2, function (d) { return d.value; })])
                     .range([h2 - padding2, padding2]);
    
    //Define X axis
    var xAxis2 = d3.svg.axis()
                      .scale(xScale2)
                      .orient("bottom")

    //Define Y axis
    var yAxis2 = d3.svg.axis()
                      .scale(yScale2)
                      .orient("left")

    //Create SVG element
    var svg2 = d3.select("#viz2")
                .append("svg")
                .attr("width", w2)
                .attr("height", h2);


    //Create bars
    svg2.selectAll("rect")
       .data(app.dataset_2.map(function (d) { return d.value; }))
       .enter()
       .append("rect")
       .attr("x", function (d, i) {
           return xScale2(i);
       })
       .attr("y", function (d) {
           return h2 - yScale2(d) - padding2;
       })
       .attr("width", xScale2.rangeBand())
       .attr("height", function (d) {
           return yScale2(d);
       })
       .attr("fill", function (d) {
           return "rgb(0, 0, " + (d * 10) + ")";
       });

    //Create X axis
    svg2.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (h2 - padding2) + ")")
        .call(xAxis2);

    svg2.append("text")      // text label for the x axis
      .attr("x", h2 - padding2 / 2)
      .attr("y", w2 / 2 - padding2 / 2)
      .style("text-anchor", "middle")
      .text("DISTRICT"); 

    //Create Y axis
    svg2.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + padding2 + ",0)")
        .call(yAxis2); 
    
    svg2.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (h2 / 2))
        .attr("y", padding2 / 4)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("FREQUENCY");
       */
}
