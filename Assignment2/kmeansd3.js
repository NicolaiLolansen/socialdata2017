state = {
    data: {},
    k: 2,
    colors: ["rgb(255, 0, 0)", //Red
             "rgb(0, 255, 0)", //Green
             "rgb(0, 0, 255)", //Blue
             "rgb(255, 255, 0)", //Yellow
             "rgb(255, 0, 255)", //Purple
             "rgb(0, 255, 255)"], //Cyan
    init: false,
    activeButton: null
}
function updatePoints(k) {
    if (!state.init) { 
        //Crimes

        svg.selectAll(".crime")
       .data(state.data.points)
       .enter()
       .append("circle")
       .attr("class", "crime")
       .attr("cx", function (d) {
           return projection([d[1], d[0]])[0];
       })
       .attr("cy", function (d) {
           return projection([d[1], d[0]])[1];
       })
       .attr("r", 5)
       .style("fill", function (d) {
           return state.colors[d[k]]
       })
       .style("opacity", 0.25);
        
        //Cluster means
        svg.selectAll(".clustermean")
        .data(state.data.centers[k - 2])
        .enter()
        .append("circle")
        .attr("class", "clustermean")
        .attr("cx", function (d) {

            return projection([d[1], d[0]])[0];
        })
        .attr("cy", function (d) {
            return projection([d[1], d[0]])[1];
        })
        .attr("r", 15)
        .style("stroke-width", 3)    // set the stroke width
        .style("stroke", "black")      // set the line colour
        .style("fill", "none");

    } else {
      //Crimes
      svg.selectAll(".crime")
      .style("fill", function (d) {
          return state.colors[d[k]]
      })
      
    }

    //Remove previous means
    svg.selectAll(".clustermean").remove()

    //Add new ones
    var cluster = 0
    svg.selectAll(".clustermean")
    .data(state.data.centers[k - 2])
    .enter()
    .append("circle")
    .attr("class", "clustermean")
    .attr("cx", function (d) {
        return projection([-122.429416, 37.754929])[0];
    })
    .attr("cy", function (d) {
        return projection([-122.429416, 37.754929])[1];
    })
    .attr("r", 15)
    .style("stroke-width", 3)    // set the stroke width
    .style("stroke", "black")      // set the line colour
    .style("fill", function (d) {
        var color = state.colors[cluster]
        cluster++
        return color
        
    })


    var cluster = 0
    svg.selectAll(".clustermean")
    .transition()
    .delay(300)
    .duration(400)
    .attr("cx", function (d) {
        return projection([d[1], d[0]])[0];
    })
    .attr("cy", function (d) {
        return projection([d[1], d[0]])[1];
    })


    state.k = k
    state.init = true;
}




function plotKmeans() {
    w = 1000;
    h = 600;
    projection = d3.geo.mercator().scale([200000]).center([-122.419416, 37.774929])
                        
    path = d3.geo.path().projection(projection);

    svg = d3.select("#kplot")
                   .append("svg")
                   .attr("width", w)
                   .attr("height", h);
    //Geojson file

    d3.json("sfpddistricts.json", function (json) {
        //Create SVG element

        svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("stroke", "#fff")
        .style("stroke-width", "1")
        .style("fill", function (d) {
            return "rgb(138, 138, 152)";
        });


        svg.selectAll('.label')
        .data(json.features)
        .enter()
        .append('text')
        .attr("d",path)
        .attr("class", "label")
        .attr('transform', function (d) {
            return "translate(" + path.centroid(d) + ")";
        })
        .style('text-anchor', 'middle')
        .style("fill", "white")
        .style("opacity", 0.5)
        .style("font-size", "18px")
        .text(function (d) {
            return d.properties.DISTRICT
        });


        loadData();
        
    });


    function loadData() {
        //Once map is loaded, load kmeans data
        d3.json("kmeansdata.json", function (json) {
            //callback
            state.data = json;
            
            updatePoints(2);

            for (var i = 2; i < 7; i++) {
                var btn = document.createElement("BUTTON");        // Create a <button> element
                var t = document.createTextNode("Change to K="+i);       // Create a text node
                btn.appendChild(t);                                // Append the text to <button>
                document.getElementById("k_buttons").appendChild(btn);                    // Append <button> to <body>

                setOnClick(btn,i);

                
            }
     
            document.getElementById("floatingCirclesG").style.display = "none";
            
            function setOnClick(btn, i) {
                btn.onclick = function () {
                    //Change button colors
                    if (state.activeButton) {
                        state.activeButton.style.background = "#8a8a98"
                    }
                    document.getElementById("kplot_num").innerHTML = "Showing Kmeans for K="+i
                    updatePoints(i);
                    state.activeButton = btn
                    btn.style.background = "blue";

                }
            };
        });
    }

    

}