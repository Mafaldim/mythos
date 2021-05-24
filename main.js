// Set initial SVG container
d3.select("body")

// Define margins, width, and height
var margin = {
    top: -10,
    right: -50,
    bottom: -25,
    left: -50
  };

var totalHeight = 2500;  
var totalWidth = window.innerWidth+600;
var width = totalWidth - margin.left - margin.right;
var height = totalHeight - margin.top - margin.bottom;

//	Data stores
var graph, store;

//	Svg selection and sizing
var svg = d3.select("#mythos-chart")
    .classed("svg-container", true) 
    .append("svg")
    .attr("preserveAspectRatio", "xMidYMin meet")
    .attr("viewBox", "0" + " "+"0"+" "+(width) +" " + (height + margin.top + margin.bottom))
    .classed("svg-content", true)
    .append("g")

// Set zoom
svg.call(d3.zoom()
    .extent([[0.5, 0.5], [width, height]])
    .scaleExtent([1, 3])
    .on("zoom", zoomed));

function zoomed() {
    svg.attr("transform", d3.event.transform);
    }

//	Define color scales
var color = d3.scaleOrdinal()
    .domain(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14"])
    .range(["#81ADC8", "#0099ff", "#e6b800", "purple", "#5353c6","pink", "#ff3333","orange", "red", "#ffbf80", "#ffb3b3", "orange", "#e6b800", "#ffbf80"]);



var link = svg.append("g").attr("class", "links").selectAll(".link");
var node = svg.append("g").attr("class", "nodes").selectAll(".node");

//	Force simulation initialization
var simulation = d3.forceSimulation()
    .force("link", d3.forceLink(link).id(d => d.id).distance(25).strength(0.5))
	.force("charge", d3.forceManyBody()
		.strength(function(d) { return -900;}).distanceMax(600))
    .force('center', d3.forceCenter(width / 2, height / 2))

    //.force('middle', d3.forceX(width * 0.5).strength(0.1))
    //.force('bottom', d3.forceY(height * 0.3).strength(0.2))
    //.force('center', d3.forceCenter(width / 2, height / 2))
    //.force("collision", d3.forceCollide().strength(1).radius( (d) => d.value + 50  ).iterations(0.1)); // preventing elements from overlapping

//	Filtered types
typeFilterList = [];

//	Filter button event handlers
$(".filter-btn").on("click", function() {
	var id = $(this).attr("value");
	if (typeFilterList.includes(id)) {
		typeFilterList.splice(typeFilterList.indexOf(id), 1)
	} else {
		typeFilterList.push(id);
	}
	filter_nodes_by_group();
	update();
});

$(".reset-btn").on("click", function() {
    reset_filter()
});

// Create Tooltips
var tooltip = d3.select("#mythos-chart")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background-color","grey")
    tooltip.append("div")
        .attr("id", "tt-name")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "20px")
        .style("padding", "1px");


// Container for the gradients
var defs = svg.append("defs");

// Filter for the outside glow
var filter = defs.append("filter")
    .attr("id","glow");
filter.append("feGaussianBlur")
    .attr("stdDeviation","2")
    .attr("result","coloredBlur");
var feMerge = filter.append("feMerge");
feMerge.append("feMergeNode")
    .attr("in","coloredBlur");
feMerge.append("feMergeNode")
    .attr("in","SourceGraphic");


//	Data read and store
d3.json("gods.json", function(err, g) {
	if (err) throw err;

	var nodeByID = {};

	g.nodes.forEach(function(n) {
		nodeByID[n.id] = n;
	});

	g.links1.forEach(function(l) {
		l.sourceGroup = nodeByID[l.source].group.toString();
		l.targetGroup = nodeByID[l.target].group.toString();
	});

	graph = g;
	store = $.extend(true, {}, g);

	update();
});

//	General update pattern for updating the graph
function update() {
	//	UPDATE
	node = node.data(graph.nodes, function(d) { return d.id;});
	//	EXIT
	node.exit().remove();
	//	ENTER
    var newNode = node.enter().append("g");

    newNode.append("circle")
        .attr("class", "node")
        .attr("id", function(d){ return d.id })
        .attr("group", function(d){ return d.group_name })
        .attr("r", function(d) { return d.value; })
        .attr("fill", function(d) {return color(d.group);})
        .attr("fill-opacity", "0.9" )
        .style("stroke-width", 0)
        .style("stroke",function(d) { return color(d.group); } )
        .style("filter", "url(#glow)")
		.call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
        )   
        .on("mouseover", function (d) {
            tooltip.select("#tt-name").text(d.id)
            return tooltip.style("visibility", "visible");
       })
       .on("mouseout", function () {
            return tooltip.style("visibility", "hidden");
        })
        
                    

    // Add node labels          
    newNode.append("text")
        .text(function(d) {if (d.value >= 6)
            return d.id;
        })
        .style("fill", "#fff7b9")
        .style("font-size", function(d){
            if (d.value >= 8) return "17px";
            else return "13px";
        })
        .attr('x', 0)
        .attr('y', function(d) {
            if (d.value > 3) return -13;
            else if (d.value > 10 & d.value <=15) return -20;
            else if (d.value > 15 & d.value <=20) return 0;
            else return 0; 
        })

	//	ENTER + UPDATE
    node = node.merge(newNode);
    
	//	UPDATE
	link = link.data(graph.links1, function(d) { return d.id;});
	//	EXIT
	link.exit().remove();
    //	ENTER
   newLink = link.enter().append("path")
    .style("stroke", "#666666")
    .style("fill", "None")
    .attr("stroke-width", 0.5);

	//	ENTER + UPDATE
	link = link.merge(newLink);

	//	Update simulation nodes, links, and alpha
	simulation
		.nodes(graph.nodes)
		.on("tick", ticked);

  	simulation.force("link")
  		.links(graph.links1);

    simulation.alpha(0.5).alphaTarget(0).restart();
     
    node.on("mouseover", function(d) {
        tooltip
            .style("top", (d3.event.pageY - 200) + "px").style("left", (d3.event.pageX - 100) + "px").html(d.description);
        var connectedNodeIds = graph.links1
            .filter(x => x.source.id == d.id || x.target.id == d.id)
            .map(x => x.source.id == d.id ? x.target.id : x.source.id);

        d3.select(".nodes")
            .selectAll("circle")
            .style("stroke", function(c) {
                if (connectedNodeIds.indexOf(c.id) > -1 || c.id == d.id) return "#fff7b9";
                else return color(c.group);
                })
            .style("r", function(c) {
                if (connectedNodeIds.indexOf(c.id) > -1 || c.id == d.id) return c.value+2;
                else return color(c.value);
                })

            .style("stroke-width", function(c) {
                if (connectedNodeIds.indexOf(c.id) > -1 || c.id == d.id) return 2;
                else return color(c.group);
                })
       
      });
    
    node.on("mouseout", function(d){
        tooltip
            .style("visibility", "hidden");
        var connectedNodeIds = graph.links1
            .filter(x => x.source.id == d.id || x.target.id == d.id)
            .map(x => x.source.id == d.id ? x.target.id : x.source.id);
        d3.select(".nodes")
            .selectAll("circle")
            .style("stroke", function(c) { return color(c.group); })
            .style("stroke-width", 0)
            .style("r", function(c) {
                if (connectedNodeIds.indexOf(c.id) > -1 || c.id == d.id) return c.value;
                else return color(c.value);
                })
    
    })
    
}

//	Drag event handlers
function dragstarted(d) {
	if (!d3.event.active) simulation.alphaTarget(0.1).restart();
	d.fx = d.x;
	d.fy = d.y;
}
function dragged(d) {
	d.fx = d3.event.x;
	d.fy = d3.event.y;
}
function dragended(d) {
	if (!d3.event.active) simulation.alphaTarget(0);
	d.fx = null;
	d.fy = null;
}

//	Tick event handler with bounded box
function ticked() {
    link.attr("d", function(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        });

    node
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
            })
        
}

//	Filter function
function filter_nodes_by_group() {
	//	add and remove nodes from data based on type filters
	store.nodes.forEach(function(n) {
		if (!typeFilterList.includes(n.group) && n.filtered) {
			n.filtered = false;
			graph.nodes.push($.extend(true, {}, n));
		} else if (typeFilterList.includes(n.group) && !n.filtered) {
			n.filtered = true;
			graph.nodes.forEach(function(d, i) {
				if (n.id === d.id) {
					graph.nodes.splice(i, 1);
				}
			});
		}
	});

	//	Add and remove links from data based on availability of nodes
	store.links1.forEach(function(l) {
		if (!(typeFilterList.includes(l.sourceGroup) || typeFilterList.includes(l.targetGroup)) && l.filtered) {
			l.filtered = false;
			graph.links1.push($.extend(true, {}, l));
		} else if ((typeFilterList.includes(l.sourceGroup) || typeFilterList.includes(l.targetGroup)) && !l.filtered) {
			l.filtered = true;
			graph.links1.forEach(function(d, i) {
				if (l.id === d.id) {
					graph.links1.splice(i, 1);
				}
			});
		}
	});			
}

// Reset-filter function
function reset_filter() {
    //	data read and store
    d3.json("gods.json", function(err, g) {
        if (err) throw err;

        var nodeByID = {};

        g.nodes.forEach(function(n) {
            nodeByID[n.id] = n;
        });

        g.links1.forEach(function(l) {
            l.sourceGroup = nodeByID[l.source].group.toString();
            l.targetGroup = nodeByID[l.target].group.toString();
        });

        graph = g;
        store = $.extend(true, {}, g);

        update();
    });
};