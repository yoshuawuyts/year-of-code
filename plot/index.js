const fromString = require('from2-string')
const csv = require('csv-parser')
const d3Tip = require('d3-tip')
const path = require('path')
const d3 = require('d3')
const fs = require('fs')

const d3tip = d3Tip(d3)

const marginY = 60
const marginX = 20
const height = 220 - marginY * 2
const width = 700 - marginX * 2
const circleR = 5

const file = fs.readFileSync(path.join(__dirname, 'data.csv'), 'utf8')
const data = []
fromString(file)
  .pipe(csv())
  .on('data', d => data.push(pt(d)))
  .on('end', createPlot)

// create svg elements
// null -> null
function createPlot () {
  const xScale = d3.scale.linear()
    .domain([0, 52])
    .range([0, width])

  const yScale = d3.scale.linear()
    .domain([0, 2])
    .range([0, height])

  const x = d3.time.scale()
    .domain([new Date(2015, 4, 1), new Date(2016, 3, 1)])
    .range([0, width])

  const xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(d3.time.months)
    .tickSize(16, 0)
    .tickFormat(d3.time.format('%b'))

  const tip = d3tip()
    .attr('class', 'plot-tip')
    .html(d => '<span>' + d.name + '</span>')

  const svg = d3.select('[role="plot"]')
    .append('svg')
    .attr('height', height + marginY * 2)
    .attr('width', width + marginX * 2)
    .append('g')
    .attr('transform', 'translate(' + marginX + ',' + marginY + ')')
    .attr('class', 'plot')

  svg.call(tip)

  // create x axis
  svg.append('g')
    .attr('transform', 'translate(0,' + (height + 20) + ')')
    .attr('class', 'plot-x-axis')
    .call(xAxis)

  // create dots
  svg.selectAll('circle')
     .data(data)
     .enter()
     .append('circle')
     .attr('cx', d => xScale(d.cx))
     .attr('cy', d => yScale(d.cy))
     .attr('r', circleR)
     .on('mouseover', tip.show)
     .on('mouseout', tip.hide)
     .on('click', d => window.open(d.uri))

  // add labels to dots
  svg.selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .text(d => d.name)
    .attr('x', d => xScale(d.cx))
    .attr('y', d => yScale(d.cy))
}

// create a data point
// obj -> obj
function pt (dat) {
  dat.cx = parseWeek(dat.date)
  dat.cy = typeIndex(dat.type)
  return dat
}

// get the relative week from a date
// example: 2015-07-19 => 02
// str -> num
function parseWeek (date) {
  return Number(date.split('-')[1]) - 5
}

// return a y index for a type
// str -> num
function typeIndex (str) {
  if (str === 'website') return 0
  if (str === 'module') return 1
  if (str === 'post') return 2
}
