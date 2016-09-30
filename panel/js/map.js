var regionsList = {
    'ap-northeast-1': {region: 'Asia Pacific', city: 'Tokyo', latitude: 35.6735763, longitude: 139.4302066},
    'ap-southeast-1': {region: 'Asia Pacific', city: 'Singapore', latitude: 1.3154015, longitude: 103.566832},
    'ap-southeast-2': {region: 'Asia Pacific', city: 'Sydney', latitude: -33.8458826, longitude: 150.3715633},
    'eu-central-1': {region: 'EU', city: 'Frankfurt', latitude: 50.1213152, longitude: 8.3563887},
    'eu-west-1': {region: 'EU', city: 'Ireland', latitude: 53.4098083, longitude: -10.5742474},
    'sa-east-1': {region: 'South America', city: 'Sao Paolo', latitude: -23.6815315, longitude: -46.8754815},
    'us-east-1': {region: 'US East', city: 'N. Virginia', latitude: 37.9266816, longitude: -83.9481084},
    'us-west-1': {region: 'US West', city: 'N. California', latitude: 38.8207129, longitude: -124.5542165},
    'us-west-2': {region: 'US West', city: 'Oregon', latitude: 44.061906, longitude: -125.0254052},
    'ap-south-1': {region: 'Asia Pacific', city: 'Mumbai', latitude: 19.0830943, longitude: 72.7411199},
    'ap-northeast-2': {region: 'Asia Pacific', city: 'Seoul', latitude: 37.5653133, longitude: 126.7093693}
};

function drawMap(collection) {
    var centered;
    var w = 980;
    var h = 600;
    var g;
    function mapClicked(d) {
        var x, y, k;

        if (d && centered !== d) {
            var centroid = path.centroid(d);
            x = centroid[0];
            y = centroid[1]*1.3;
            k = 4;
            centered = d;
        } else {
            x = w / 2;
            y = h / 2;
            k = 1;
            centered = null;
        }

        g.selectAll("path")
            .classed("active", centered && function(d) { return d === centered; });

        g.transition()
            .duration(750)
            .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
            .style("stroke-width", 1.5 / k + "px");
    }


    var xy = d3.geoEquirectangular();
    var path = d3.geoPath()
        .projection(xy);

    var svg = d3.select(".map-cont").insert("svg:svg")
        .attr("width", w)
        .attr("height", h);

    svg.append("rect")
        .attr("class", "background")
        .attr("width", w)
        .attr("height", h)
        .attr("fill", "#ffffff")
        .on("click", mapClicked);

    g = svg.append("g");
    g.append("g")
        .attr("id", "states")
        .selectAll("path")
        .data(collection.features)
        .enter().append("svg:path")
        .attr("d", path)
        .attr("transform", "scale(1, 1.3)")
        .attr("fill", '#e6e6e6')
        .style("stroke", "#fff")
        .style("stroke-width", "1px")
        .on("mouseover", function(d) {
            d3.select(this).style("fill","#2b7ae5")
                .append("svg:title")
                .text(d.properties.name);
        })
        .on("mouseout", function (d) {
            d3.select(this).style("fill", "#e6e6e6");
        })
        .on("click", mapClicked);


    var circles = g.append("g").attr("id", "circles");
    circles.append("g").attr("class", "map-severity severity object");
    circles.append("g").attr("class", "map-category category object");
    circles.append("g").attr("class", "map-service  service object");
    circles.append("g").attr("class", "map-region region object");

    return g;
}

function drawCirclesOnMap(g, mapData, id) {
    var data = [];
    Object.keys(mapData).forEach(function(region) {
        Object.keys(mapData[region]).forEach(function(type) {
            data.push({region: region, type:type, value:mapData[region][type].value, color: mapData[region][type].color});
        });
    });

    var xy = d3.geoEquirectangular();

    var circles = g.select(id).append("g").attr("class", "circles");
    var elem = circles.selectAll('.circles').data(data);

    /*Create and place the "blocks" containing the circle and the text */
    var elemEnter = elem.enter()
        .append("g")
        .attr("type", function(d) {
            console.log(d);
            return d.type;
        })
        .attr("transform", function(d, i){
            var xi = xy([regionsList[d.region].longitude, regionsList[d.region].latitude])[0] + i*3,
                yi = xy([regionsList[d.region].longitude, regionsList[d.region].latitude])[1] * 1.3 + i*3;
            return "translate(" + xi + "," + yi + ")";
        });

    elemEnter.append("circle")
        .attr("fill", function(d) { return d.color; })
        .attr("r",  function(d) { return (d.value < 100) ? 20 : d.value / 6; })
        .attr("title", function(d) { return d.value; })
        .style("opacity", "0.6")
        .on("mouseover", function(d) {
            d3.select(this).style("stroke", d.color).style("stroke-width", "5px");
        })
        .on("mouseout", function(d) {
            d3.select(this).style("fill", d.color).style("stroke", "none");
        });

    elemEnter
        .append("svg:text")
        .attr("dy", "0.2em")
        .attr("text-anchor", "middle")
        .style("fill", "#ffffff")
        .text(function(d) { return d.value; });
}
