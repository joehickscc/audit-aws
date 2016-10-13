$(function () {
    var alerts = [],
        alertData = {
            level: {},
            category: {},
            region: {},
            service: {}
        };

    var svg;

    var regionsList = {
        'ap-northeast-1': {region: 'Asia Pacific', city: 'Tokyo', latitude: 35.6735763, longitude: 139.4302066, countryId: 'JPN'},
        'ap-southeast-1': {region: 'Asia Pacific', city: 'Singapore', latitude: 1.3154015, longitude: 103.566832, countryId: 'IDN'},
        'ap-southeast-2': {region: 'Asia Pacific', city: 'Sydney', latitude: -33.8458826, longitude: 150.3715633, countryId: 'AUS'},
        'eu-central-1': {region: 'EU', city: 'Frankfurt', latitude: 50.1213152, longitude: 8.3563887, countryId: 'DEU'},
        'eu-west-1': {region: 'EU', city: 'Ireland', latitude: 53.4098083, longitude: -10.5742474, countryId: 'IRL'},
        'sa-east-1': {region: 'South America', city: 'Sao Paolo', latitude: -23.6815315, longitude: -46.8754815, countryId: 'BRA'},
        'us-east-1': {region: 'US East', city: 'N. Virginia', latitude: 37.9266816, longitude: -83.9481084, countryId: 'USA'},
        'us-west-1': {region: 'US West', city: 'N. California', latitude: 38.8207129, longitude: -124.5542165, countryId: 'USA'},
        'us-west-2': {region: 'US West', city: 'Oregon', latitude: 44.061906, longitude: -125.0254052, countryId: 'USA'},
        'ap-south-1': {region: 'Asia Pacific', city: 'Mumbai', latitude: 19.0830943, longitude: 72.7411199, countryId: 'IND'},
        'ap-northeast-2': {region: 'Asia Pacific', city: 'Seoul', latitude: 37.5653133, longitude: 126.7093693, countryId: 'KOR'}
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
            .attr("fill", function(d) {
                var keys = Object.keys(regionsList);
                for(var i = 0; i < keys.length; ++i){
                    if( regionsList[keys[i]].countryId === d.id)
                        return "#2b7ae5";
                }
                return '#e6e6e6';

            })
            .style("stroke", "#fff")
            .style("stroke-width", "1px")
            .on("mouseover", function(d) {
                d3.select(this)
                    .append("svg:title")
                    .text(d.properties.name);
            })
            .on("click", mapClicked);


        g.append("g").attr("id", "map-bubbles-cont");

        return g;
    }

    function drawCirclesOnMap(g, mapData) {
        $('g.map-bubbles-cont').html('');

        var orgMapData = [];
        Object.keys(mapData).forEach(function(region) {
            Object.keys(mapData[region]).forEach(function(type) {
                orgMapData.push({region: region, type:type, value:mapData[region][type].value, color: mapData[region][type].color});
            });
        });

        var xy = d3.geoEquirectangular();

        var circles = g.select('#map-bubbles-cont');
        circles.selectAll('g').remove();

        var elem = circles.selectAll('g').data(orgMapData);
        var elemEnter = elem.enter()
            .append("g")
            .attr("type", function(d) {
                return d.type;
            })
            .attr("transform", function(d, i){
                var xi = xy([regionsList[d.region].longitude, regionsList[d.region].latitude])[0] + i*5,
                    yi = xy([regionsList[d.region].longitude, regionsList[d.region].latitude])[1] * 1.3 + i*5;
                return "translate(" + xi + "," + yi + ")";
            });

        elemEnter.append("circle")
            .attr("fill", function(d) { return d.color; })
            .attr("r",  function(d) { return (d.value < 90) ? 15 : d.value / 6; })
            .attr("title", function(d) { return d.value; })
            .style("opacity", "0.6")
            .on("mouseover", function(d) {
                d3.select(this).style("stroke", d.color).style("stroke-width", "5px").style("opacity", "1");
            })
            .on("mouseout", function(d) {
                d3.select(this).style("fill", d.color).style("stroke", "none").style("opacity", "0.6");
            });

        elemEnter
            .append("svg:text")
            .attr("dy", "0.2em")
            .attr("text-anchor", "middle")
            .attr("fill", "#e4e4e4")
            .text(function(d) { return d.value; })
            .on("mouseover", function(d) {
                return false;
            });
    }


    function drawMapHistory(mapData) {
        $('.map-history').html('');
        var orgMapData = {};
        Object.keys(mapData).forEach(function(region) {
            Object.keys(mapData[region]).forEach(function(type) {
                if(!orgMapData[type]){
                    orgMapData[type] = {color: mapData[region][type].color, data: []};
                }
                orgMapData[type].data.push({region: region, type:type, value:mapData[region][type].value});
            });
        });

        var types = Object.keys(orgMapData)
        for(var i = 0; i < types.length; ++i) {
            var rowsData = '';
            for(var j = 0; j < orgMapData[types[i]].data.length; ++j){
                rowsData += '<br/>' + orgMapData[types[i]].data[j].value + ' ' + regionsList[orgMapData[types[i]].data[j].region].city;
            }

            var html =  '<div class="flex-grow history-column">' +
                            '<span class="history-header" style="color:'+orgMapData[types[i]].color+';">' + types[i] + '</span>' +
                            rowsData+
                        '</div>';
            $('.map-history').append(html);
        }
    }


    function roundedRect(x, y, width, height, radius) {
        return "M" + x + "," + y
            + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + -radius
            + "h" + (width - radius)
            + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
            + "v" + (height - radius)
            + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + radius
            + "h" + (radius - width)
            + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + -radius
            + "z";
    }

    function drawPie(pieData, color) {
        $('.pie').html('');

        var w = 300,
            h = pieData.length * 35 + 10,
            r = 65;

        var dataSum = 0;
        pieData.forEach(function (elem) {
            dataSum += +elem.value;
        });

        h = (130 < h) ? h : 130;

        var vis = d3.select(".pie")
            .append("svg:svg")
            .data([pieData])
            .attr("viewBox", '0 0 300 ' + h)
            .append("svg:g")
            .attr("transform", "translate(" + r + "," + r + ")");

        var arc = d3.arc()
            .outerRadius(r)
            .innerRadius(0);

        var pie = d3.pie()
            .value(function (d) {
                return +d.value;
            });

        var g = vis.selectAll(".arc")
            .data(pie(pieData))
            .enter().append("g")
            .attr("class", "arc");

        var onclick = function (d, i) {
            $('.content').animate({
                scrollTop: $("." + pieData[i].label).offset().top
            }, 500);
        };

        g.append("svg:path")
            .attr("fill", function (d, i) {
                return pieData[i].color;
            })
            .attr("d", arc)
            .style("stroke", "#fff")
            .style("stroke-width", "3px")
            .on("click", onclick);

        g.append("svg:text")
            .attr("transform", function (d, i) {
                return "translate(" + (r + 50) + ", " + (22 - r + i * 35) + ")";
            })
            .attr("text-anchor", "start")
            .style("fill", "#6b6b6b")
            .style("font-family", "Arial")
            .style("font-size", "12px")
            .text(function (d, i) {
                var title = pieData[i].value + ' ' + pieData[i].label + ' (' + (pieData[i].value * 100 / dataSum).toFixed(1) + '%)'
                return title;
            })
            .on("click", onclick);

        g.append("path")
            .attr("d", function (d, i) {
                return roundedRect(r + 20, 10 - r + i * 35, 20, 20, 4);
            })
            .attr("fill", function (d, i) {
                return pieData[i].color || color(i);
            })
            .on("click", onclick);
    }



    function fillList(id) {
        var headerTmpl = $.templates("#list-header-tmpl"),
            tmpl = $.templates("#row-tmpl"),
            btn = $("#show-all-btn-tmpl").html(),
            color = d3.scaleOrdinal(d3.schemeCategory20),
            i = 0;

        $('.list').html('');
        var data = [],
            mapData = {};

        var regionCodes = Object.keys(alertData.region);
        for (i = 0; i < regionCodes.length; ++i) {
            mapData[regionCodes[i]] = {};
        }

        var keys = Object.keys(alertData[id]);

        var listOfAlerts = {};
        alerts.forEach(function(alert) {
            var key = alert[id];
            if(!listOfAlerts[key]){
                listOfAlerts[key] = {};
                listOfAlerts[key].alerts = {};
                listOfAlerts[key].color = color(keys.indexOf(key));
            }

            if(!listOfAlerts[key].alerts[alert.id]) {
                listOfAlerts[key].alerts[alert.id] = alert;
                listOfAlerts[key].alerts[alert.id].resources = [];
            }
            listOfAlerts[key].alerts[alert.id].resources.push({ resource: alert.resource, tags: alert.tags });

            if (!mapData[alert.region][key]) {
                mapData[alert.region][key] = {value: 0, color: listOfAlerts[key].color};
            }
            ++mapData[alert.region][key].value;
        });

        var visibleCount;
        var visibleList;
        var restList;

        Object.keys(listOfAlerts).forEach( function(key) {
            var currentColor = listOfAlerts[key].color;
            var headerData = { name: key, resultsCount: alertData[id][key] };
            var header = headerTmpl.render(headerData);

            data.push({label: headerData.name, value: headerData.resultsCount, color: currentColor});

            visibleList = '';
            restList = '';
            visibleCount = 0;

            var groupedAlerts = listOfAlerts[key];

            Object.keys(groupedAlerts.alerts).forEach( function(alertId) {
                var rendered = tmpl.render(groupedAlerts.alerts[alertId]);

                if (visibleCount < 5) visibleList += rendered;
                else restList += rendered;
                visibleCount++;
            });

            var html =  '<div class="'+key+' bg-white layout-padding" style="margin-bottom: 20px;">' +
                            header +
                            '<div style="border-color: '+currentColor+'">'+
                                visibleList+
                                '<div class="hidden" style="border-color: inherit;">'+restList+'</div>' +
                                ((visibleCount > 5) ? btn: '') +
                            '</div>'+
                        '</div>';

            $('.list').append(html);
        });
        drawPie(data);
        drawCirclesOnMap(svg, mapData);
        drawMapHistory(mapData);

        $('.resources-link').click(function() {
            redirectToAuditResources($(this).attr('violation'), $('#sort-value').html());
        });
        $('.more-info-link').click(function() {

        });
        $('.share-link').click(function() {

        });

        $('.show-all').click(function () {
            var list = $(this).prev();
            if(list.hasClass('hidden')) {
                list.removeClass('hidden');
                $(this).html("show less");
            } else {
                list.addClass('hidden');
                $(this).html("view all");
            }
        });

        $('.details-btn').click(function() {
            var body = $(this).parent().next();
            if(body.hasClass('hidden')) {
                body.removeClass('hidden');
                body.slideDown()
                $(this).html("- hide details");
            } else {
                body.slideUp(function (){
                    body.addClass('hidden');
                });
                $(this).html("+ view details");
            }
        });
    }

    function fillData(services){
        alerts = [];

        Object.keys(services).forEach(function(key) {
            var count = services[key][key+'_violations'];
            if (count != 0) alertData.service[key] = count;

            Object.keys(services[key].violations).forEach(function(resId) {
                Object.keys(services[key].violations[resId].violations).forEach(function (violationKey) {
                    var rowData = services[key].violations[resId].violations[violationKey];
                    var alert = {
                        title: violationKey,
                        id: violationKey,
                        level: rowData.level,
                        tags: services[key].violations[resId].tags,
                        category: rowData.category,
                        description: rowData.description,
                        fix: rowData.suggested_action,
                        resource: resId,
                        service: key,
                        region: rowData.region
                    };

                    if(!alertData.level.hasOwnProperty(alert.level)) {
                        alertData.level[alert.level] = 0;
                    }
                    if(!alertData.category.hasOwnProperty(alert.category)) {
                        alertData.category[alert.category] = 0;
                    }
                    if(!alertData.region.hasOwnProperty(alert.region)) {
                        alertData.region[alert.region] = 0;
                    }

                    ++alertData.level[alert.level];
                    ++alertData.category[alert.category];
                    ++alertData.region[alert.region];

                    alerts.push(alert);
                });
            });
        });
    }
    
    function init(data, svg){
        fillData(data.services, svg);
        $('#backdrop').hide();
    }

    d3.json("./tmp-data/tmp.json", function(data) {
        if(data) {
            d3.json("./tmp-data/world-countries.json", function(collection) {
                svg = drawMap(collection);
                init(data);
                fillList('level');
            });
        }
    });

    $('#sort-value')[0].onclick = function() {
        var list = $('#sort-by-select');
        if(list.hasClass('hidden')) {
            list.removeClass('hidden');
        } else {
            list.addClass('hidden');
        }
    };

    $('#sort-by-select li').click(function () {
        $('#sort-value').html($(this).html());
        $('#sort-by-select').addClass('hidden');
        var value = $(this).attr('value');
        fillList(value);
    });

    $('.button').click( function() {
        var type = $(this).attr("type");
        var prevType = $('.active').attr('type');
        $('.active').find('img').attr('src', './images/'+prevType+'.svg');

        $('.active').removeClass('active');
        $(this).addClass('active');
        $('.data-block').addClass('hidden');
        $('.'+type).removeClass('hidden');

        $('img', this).attr('src', './images/'+type+'-active.svg');
    });


});
