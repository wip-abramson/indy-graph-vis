import React from "react"
import * as d3 from "d3"

import "./visualisation.css"

const SchemaVisualisation = ({ schema }) => {
  let [displayAuthorship, setDisplayAuthorship] = React.useState(true)


  const drawChart = React.useCallback((graph) => {
    const height = window.innerHeight - 200
    const width = window.innerWidth / 2
    console.log(graph)

    // Define the div for the tooltip
    let div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)

    d3.select("svg").remove()

    const svg = d3
      .select("#d3-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    let link = svg
      .selectAll(".link")
      .data(graph.links)
      .join("line")
      .classed("link", true)
      .classed("schema-id", d => d.isSchemaId)
    let node = svg
      .selectAll(".node")
      .data(graph.nodes)
      .join("circle")
      .attr("r", 12)
      .classed("node", true)
      .classed("definition", d => {

        // console.log("TYPE", d.type)
        return d.txnType === "CLAIM_DEF"

      })
      .classed("nym", d => d.txnType === "NYM")
      .classed("endorser", d => {

        if (d.txnType === "NYM") {
          console.log(d.role)
          return d.role === "101" || d.role === "2"
        }
        return false
      })
      .classed("schema", d => d.txnType === "SCHEMA")
      .on("mouseover", function(event, d) {



        let html = "Txn Type : " + d.txnType + "<br/>"
        html += "ID: " + d.id  + "<br/>"
        if (d.txnType === "NYM") {
          html += "Role: " + d.role
        }



        div.transition()
          .duration(200)
          .style("opacity", .9)
        div.html(html)
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 28) + "px")
      })
      .on("mouseout", function(d) {
        div.transition()
          .duration(1000)
          .style("opacity", 0)
      })

    // yield svg.node();

    const simulation = d3
      .forceSimulation()
      .nodes(graph.nodes)
      .force("charge", d3.forceManyBody().distanceMax(height / 2).strength(-250))
      .force("center", d3.forceCenter(width / 2, height / 2).strength(1))
      .force("link", d3.forceLink(graph.links).distance(40).id(function(d) {
        // console.log(d)
        return d.id
      }))
      .on("tick", tick)

    const drag = d3
      .drag()
      .on("start", dragstart)
      .on("drag", dragged)

    node.call(drag).on("click", click)

    function tick() {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)
      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
    }

    function click(event, d) {
      delete d.fx
      delete d.fy
      d3.select(this).classed("fixed", false)
      simulation.alpha(1).restart()
    }

    function dragstart() {
      d3.select(this).classed("fixed", true)
    }

    function dragged(event, d) {
      d.fx = clamp(event.x, 0, width)
      d.fy = clamp(event.y, 0, height)
      simulation.alpha(1).restart()

    }
  }, [])

  function clamp(x, lo, hi) {
    return x < lo ? lo : x > hi ? hi : x
  }

  const createNodesAndLinks = React.useCallback(() => {

    console.log("CREATE NODES")
    let nodes = []
    let links = []

    let graphedNodeIds = []

    console.log("SCHEMA", schema)
    let schemaNode = schema
    // schemaNode.definitions.edges = null
    nodes.push(schemaNode)
    let definitions = schema.definitions.edges

    let schemaAuthorNode = schema.author

    let schemaAuthorLink = {
      source: schemaAuthorNode.id,
      target: schema.id,
    }

    nodes.push(schemaAuthorNode)
    graphedNodeIds.push(schemaAuthorLink.id)
    links.push(schemaAuthorLink)

    let didAuthorNode = schemaAuthorNode.author
    didAuthorNode.id = didAuthorNode.did

    if (!graphedNodeIds.includes(didAuthorNode.id)) {
      graphedNodeIds.push(didAuthorNode.id)
      nodes.push(didAuthorNode)
    }

    let didAuthorLink = {
      source: didAuthorNode.id,
      target: schemaAuthorNode.id,
      type: "TX AUTHOR"
    }

    links.push(didAuthorLink)

    definitions.forEach(definition => {
      let defNode = definition.node

      let schemaLink = {
        source: defNode.id,
        target: schema.id,
        isSchemaId: true
      }

      nodes.push(defNode)
      links.push(schemaLink)


      let defAuthorNode = defNode.author
      defAuthorNode.id = defAuthorNode.did

      if (!graphedNodeIds.includes(defAuthorNode.id)) {
        graphedNodeIds.push(defAuthorNode.id)
        nodes.push(defAuthorNode)
      }

      let defAuthorLink = {
        source: defAuthorNode.id,
        target: defNode.id,
        type: "TX AUTHOR"
      }


      links.push(defAuthorLink)

      let didAuthorNode = defAuthorNode.author
      didAuthorNode.id = didAuthorNode.did

      if (!graphedNodeIds.includes(didAuthorNode.id)) {
        graphedNodeIds.push(didAuthorNode.id)
        nodes.push(didAuthorNode)
      }

      let didAuthorLink = {
        source: didAuthorNode.id,
        target: defAuthorNode.id,
        type: "TX AUTHOR"
      }

      links.push(didAuthorLink)


    })


    console.log(links)
    let newGraph = {
      nodes: nodes,
      links: links
    }
    drawChart(newGraph)
  }, [drawChart, displayAuthorship])

  React.useEffect(() => {
    console.log("Mounted")
    createNodesAndLinks()
  }, [displayAuthorship, createNodesAndLinks, drawChart])

  return (<div className="visualisation">
    {/*<h3>Transactions taken from the following IndyScan queries :*/}
      {/*<a*/}
        {/*href="https://indyscan.io/txs/SOVRIN_MAINNET/domain?page=1&pageSize=50&filterTxNames=[]&sortFromRecent=true&search=Uvb86cUzmdgZ8AfbN176tc">Uvb86cUzmdgZ8AfbN176tc</a>,*/}
      {/*<a*/}
        {/*href="https://indyscan.io/txs/SOVRIN_MAINNET/domain?page=1&pageSize=50&filterTxNames=[]&sortFromRecent=true&search=R6kf9GCbVH3q536SB1HU9L">R6kf9GCbVH3q536SB1HU9L</a>*/}
    {/*</h3>*/}
    {/*<div className="toggle-bar">*/}
      {/*<button className={displayAuthorship ? "button is-primary" : "button"} onClick={() => {*/}
        {/*setDisplayAuthorship(true)*/}
      {/*}}>Graph Tx Authorship*/}
      {/*</button>*/}
      {/*<button className={!displayAuthorship ? "button is-primary" : "button"}*/}
              {/*onClick={() => setDisplayAuthorship(false)}>Graph Tx Endorsement*/}
      {/*</button>*/}
    {/*</div>*/}
    <div id="d3-container">


    </div>
  </div>)

}

export default SchemaVisualisation
