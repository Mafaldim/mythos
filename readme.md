# Genealogy Network of Gods in Greek Mythology

An interactive D3.js dynamic force-directed graph of gods in Greek mythology.

![](images/mythos-graph.png)

## Table of Contents

1. [Introduction](#Intro)
2. [Data Gathering](#Data-Gathering)
3. [Visualisation](#Visualisation)
    1. [Data Preparation](#Data-Preparation)
    2. [D3-Force Layout](#D3-force)

## Introduction

This project was inspired whilst reading the excellent book [*Mythos* by Steven Fry](https://www.waterstones.com/book/mythos/stephen-fry/9781405934138) that is humorously recounting the Greek myths. Although, some family trees showing the connections of gods of a generation are included in the book, the striking number of deities and their perplexed relationships in Greek mythology can be too chaotic to follow. This triggered my interest in creating a visualisation that would depict the whole genealogy network starting from the first generation of cosmological abstract concepts (*Chaos, Space, Light*) to the Olympians following the book's chronological order.

## Data Gathering

The toughest challenge in creating this visualisation was the data collection. Data was gathered by manually going through the book, marking any parent-child connection, and entering it into CSV format.
The excellent [*Theoi Project*](https://www.theoi.com/) and information retrieved from [Wikipedia](https://en.wikipedia.org/wiki/Main_Page) were used as additional data sources for cross-checking and expanding the network. 

Links of acquaintances were not included in the graph as main goal of the project was to depict the genealogy of the gods. However, information on interactions between the gods were recorded and included as part of the brief description for each of the gods included in the network.


Note: The parent-child relationships and information of certain myths might vary depending the source. The present visualisation depicts the Greek myths as described in Fry's book that it is mainly based on [Hesiod's version](https://en.wikipedia.org/wiki/Theogony).



## Visualisation

The visualisation was created using [D3.js framework](https://d3js.org/) (D3 V4). The network graph is a combination of D3's creator [Mike Bostock's Force-Directed Graph](https://observablehq.com/@d3/force-directed-graph) and [Curved Links](https://bl.ocks.org/mbostock/4600693).  Gods are depicted as nodes in a force-directed graph layout utilising [D3-force package](https://www.d3indepth.com/force-layout/). In addition, [Denise Mauldin's Filtering Nodes on Force-Directed Graphs](https://bl.ocks.org/denisemauldin/cdd667cbaf7b45d600a634c8ae32fae5) demonstration was followed to add the filtering buttons.

### Data Preparation
The force layout requires information on nodes and links (data elements); nodes are mapped to SVG circle elements and relate to each other through links that are mapped to SVG line elements. The information on nodes and links was stored following Mike Bostock's Force-Directed Graph paradigm; the original CSV file was converted into a JSON by running a Python script. 

The JSON file contain details on the gods including certain attributes, such as 'id' (unique name), 'group'/'group name' (the deity category), 'value' (node size), 'description' (short text), and the details of the edges between the nodes ('source' and 'target').

### D3-force 

[D3's force layout](https://www.d3indepth.com/force-layout/) uses the [forceSimulation API](https://github.com/d3/d3-force#simulation) that applies physics based simulator for positioning visual elements. It provides functions (`forces`) that allows us to control the position or velocities of nodes in relation to each other. In the present visualisation, simulation composed of the following `forces`:
-  `charge` to define how nodes repel one another; here `forceManyBody()` used with a negative value causing the nodes to repel one another like like electrostatic charge
- `link` for defining the distance and strength parameters for each edge
- `middle`, `bottom` for creating a new positioning force along the x and y axis
- `collision` for avoiding overlapping by treating nodes as circles with radius

Initially, using `forceManyBody()` default values and positioning the graph on the center of the SVG, the network looked as showed in the Figure below.

![Version I](images/mythos-graph-version-1.png)

### Links and Nodes

To improve the structure of the graph edges were changed to curved lines as shown in the Figure below. 

In the definition of the nodes, `.call(force.drag);`  function was utilised to add a force drag event to the specified node. Moreover, a `tooltip` was created, including the `mouseover` event, to reveal a short description when hovering over a node. Finally, a functionality that enables the highlight of the connections of a selected node was included in the `mouseover` event by filtering the 'target' nodes.

Furthermore, the major characters were highlighted by increasing their node size whilst titles were removed from minor deiteis like daimones and nymphs. 

![Version II](images/mythos-graph-version-2.png)

### Filtering
An additional functionality to filter nodes and their respective links based on the deities group they belong was added to the visual to enable the user explore the network for different categories, namely, *Primordial Gods*, *Titans*, and *Olympians* gods.


![](images/mythos-graph-version-3.png)

## Styling & Visual Design


Filter nodes and associated links by group by checking if either its source or target is not selected.


## Resources

Here is a list of some of the sources consulted to create the visualisation
- [Undrestanding how to draw force layout using D3.js]
- [Simple d3.js tooltips](https://bl.ocks.org/d3noob/a22c42db65eb00d4e369)

## Licence

- Filtering Nodes on Force-Directed Graphs (D3 V4)] https://bl.ocks.org/denisemauldin/cdd667cbaf7b45d600a634c8ae32fae5#index.html
- [glow filter](https://stackoverflow.com/questions/9630008/how-can-i-create-a-glow-around-a-rectangle-with-svg)

[https://www.datasketch.es/project/an-interactive-visualization-of-every-line-in-hamilton]
[source](https://itnext.io/d3-force-directed-graph-forces-experiments-for-dummies-20a5682935)


[source](https://www.pluralsight.com/guides/creating-force-layout-graphs-in-d3)

[Mobile Patent Suits](https://observablehq.com/@d3/mobile-patent-suits)