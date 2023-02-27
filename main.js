/* CONSTANTS AND GLOBALS */
const width = window.innerWidth *.8 ;
const height = 500;

const margin = {
    right: 50,
    left: 50,
    top: 50,
    bottom: 50
}

/* LOAD DATA */
d3.csv('data.csv', d => {
  // use custom initializer to reformat the data the way we want it
  // ref: https://github.com/d3/d3-fetch#dsv
  return {
    date: new Date(d.dateTemperature),
    location: d.location,
    temperature: +d.temperature
  }
}).then(data => {



  console.log('data :>> ', data);

  // + SCALES
  const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width - margin.right])

  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.temperature))
    .range([height - margin.bottom, margin.top])

  // CREATE SVG ELEMENT
  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "lavender")

  // BUILD AND CALL AXES
  const xAxis = d3.axisBottom(xScale)
    .ticks(6) // limit the number of tick marks showing -- note: this is approximate

  const xAxisGroup = svg.append("g")
    .attr("class", "xAxis")
    .attr("transform", `translate(${0}, ${height - margin.bottom})`)
    .call(xAxis)

  xAxisGroup.append("text")
    .attr("class", 'xLabel')
    .attr("transform", `translate(${width / 2}, ${35})`)
    .text("Date")

  const yAxis = d3.axisLeft(yScale)
    // .ticks(6)

  const yAxisGroup = svg.append("g")
    .attr("class", "yAxis")
    .attr("transform", `translate(${margin.right}, ${0})`)
    .call(yAxis)

  yAxisGroup.append("text")
    .attr("class", 'yLabel')
    .attr("transform", `translate(${-45}, ${height / 2})`)
    .attr("writing-mode", 'vertical-rl')
    .text("Temperature")

  // LINE GENERATOR FUNCTION
  const lineGen = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.temperature))

  // DRAW LINE

  const locationNames = data.slice(0, 7).map(d => d.location);

  locationNames.splice(3, 1);

  for(let i = 0; i <= locationNames.length; i++) {

    let currentData = data.filter(d => d.location === locationNames[i])

    svg.selectAll(`.line${i}`)
        .data([currentData]) // data needs to take an []
        .join("path")
        .attr("class", `line${i}`)
        .attr("fill", "none")
        .attr("stroke", d3.schemeCategory10[i])
        .attr("d", d => lineGen(d))
  }

  

//   tegelerData = data.filter(d => d.location === "Tegeler See")

//   svg.selectAll(".line2")
//     .data([tegelerData]) // data needs to take an []
//     .join("path")
//     .attr("class", 'line2')
//     .attr("fill", "none")
//     .attr("stroke", "black")
//     .attr("d", d => lineGen(d))

 
});