const d3 = require('d3')

const height = 100
const width = 700
const margin = 40

const data = [
  pt('website', 'year of code', '2015-05-01')
]

const xScale = d3.scale.linear()
  .domain([0, 52])
  .range([0, width])

const yScale = d3.scale.linear()
  .domain([0, 3])
  .range([0, height])

const x = d3.time.scale()
  .domain([new Date(2015, 5, 1), new Date(2016, 4, 1)])
  .range([0, width])

const xAxis = d3.svg.axis()
  .scale(x)
  .orient('bottom')
  .ticks(d3.time.months)
  .tickSize(16, 0)
  .tickFormat(d3.time.format('%B'))

var svg = d3.select('body')
  .append('svg')
  .attr('width', width + margin+ margin)
  .attr('height', height + margin+ margin)
  .attr('class', 'plot')

// create x axis
svg.append('g')
  .attr('transform', 'translate(0,' + height + ')')
  .attr('class', 'plot-x-axis')
  .call(xAxis)

// create dots
svg.selectAll('circle')
   .data(data)
   .enter()
   .append('circle')
   .attr('cx', d => xScale(d.cx))
   .attr('cy', d => yScale(d.cy))
   .attr('r', 5)

// add labels to dots
svg.selectAll('text')
  .data(data)
  .enter()
  .append('text')
  .text(d => d.name)
  .attr('x', d => xScale(d.cx))
  .attr('y', d => yScale(d.cy))

// create a data point
// str, str, str -> obj
function pt (type, name, date) {
  return {
    type: type,
    name: name,
    date: date,
    cx: parseWeek(date),
    cy: 1
  }
}

// get the week from a date
// str -> num
function parseWeek (date) {
  return Number(date.split('-')[1]) - 4
}
