const d3 = require('d3')

const height = 100
const width = 300

const data = [
  website('year of code', '2015-05-01')
]

var svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height)

svg.selectAll('circle')
   .data(data)
   .enter()
   .append('circle')
   .attr('cx', d => d.cx)
   .attr('cy', d => d.cy)
   .attr('r', 5)

svg.selectAll('text')
  .data(data)
  .enter()
  .append('text')
  .text(d => d.name)
  .attr('x', d => d.cx)
  .attr('y', d => d.cy)

// create a website
// str, str -> obj
function website (name, date) {
  return {
    type: 'website',
    name: name,
    date: date,
    cx: 150,
    cy: 50
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
