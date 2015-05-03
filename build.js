const hyperstream = require('hyperstream')
const browserify = require('browserify')
const Remarkable = require('remarkable')
const brick = require('brick-router')
const watchify = require('watchify')
const through = require('through2')
const npm = require('rework-npm')
const rework = require('rework')
const myth = require('myth')
const path = require('path')
const fs = require('fs')

const md = new Remarkable()
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
  const htmlloc = path.join(__dirname, 'index.html')
  const mdloc = path.join(__dirname, 'text.md')
  const footerloc = require.resolve('@yoc/footer/index.html')
  const buf = []

  const footerstream = fs.createReadStream(footerloc)
  const htmlstream = fs.createReadStream(htmlloc)
  const mdstream = fs.createReadStream(mdloc)

  const nwmd = mdstream.pipe(through(transform, flush))
  const hs = hyperstream({
    '[role="desc-text"]': nwmd,
    'footer': footerstream
  })

  const res = htmlstream.pipe(hs)
  cb(null, res)

  // transform for through
  // str, str, fn -> null
  function transform (chunk, enc, icb) {
    buf.push(chunk)
    icb()
  }

  // flush for through
  // fn -> null
  function flush (icb) {
    this.push(md.render(buf.join('\n')))
    icb()
  }
})
