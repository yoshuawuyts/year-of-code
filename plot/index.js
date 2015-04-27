const d3 = require('d3')

const height = 100
const width = 300

const data = [
  website('year of code', '2015-05-01')
]

// create scale
const xScale = d3.scale.linear()
  .domain([0, 52])
  .range([0, width])

const yScale = d3.scale.linear()
  .domain([0, 3])
  .range([0, height])

// main d3 thingy
var svg = d3.select('body')
  .append('svg')
  .attr('class', 'plot')

console.log(svg)

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

// create a website
// str, str -> obj
function website (name, date) {
  return {
    type: 'website',
    name: name,
    date: date,
    cx: parseWeek(date),
    cy: 1
  }
}

// create an article
// str, str -> obj
// function art (name, date) {
//   return {
//     name: name,
//     date: date
//   }
// }

// create a module
// str, str -> obj
// function module (name, date) {
//   return {
//     name: name,
//     date: date,
//     url: 'http://ghub.io/' + name
//   }
// }

// get the week from a date
// str -> num
function parseWeek (date) {
  const ret = Number(date.split('-')[1]) - 4
  console.log(ret)
  return ret
}
