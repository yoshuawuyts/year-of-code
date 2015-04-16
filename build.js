const browserify = require('browserify')
const brick = require('brick-router')
const watchify = require('watchify')
const npm = require('rework-npm')
const rework = require('rework')
const myth = require('myth')
const path = require('path')
const fs = require('fs')

const root = path.dirname(require.main.filename)
const router = brick()

var b = browserify({
  cache: {},
  packageCache: {},
  entries: [path.join(root, 'index.js')],
  fullPaths: true
})
if (process.env.NODE_ENV === 'development') b = watchify(b)

module.exports = router

// browserify bundle
router.on('/bundle.js', function (cb) {
  cb(null, b.bundle())
})

// myth bundle
router.on('/bundle.css', function (cb) {
  const route = path.join(root, 'index.css')
  fs.readFile(route, 'utf8', function (err, styles) {
    if (err) return cb(err)
    try {
      const res = rework(styles, {source: route})
        .use(npm({root: root}))
        .use(myth({source: route}))
        .toString()
      cb(null, res)
    } catch(e) {
      cb(e)
    }
  })
})

// index.html OR /
router.on('/index.html', function (cb) {
  const loc = path.join(__dirname, 'index.html')
  const stream = fs.createReadStream(loc)
  cb(null, stream)
})
