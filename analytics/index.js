module.exports = analytics

// null -> null
function analytics () {
  trackFn()
  window.ga('create', 'UA-11842355-6', 'yoshuawuyts.com/yearofcode')
  window.ga('send', 'pageview')
}

// initialize the tracking function
function trackFn () {
  const uri = '//www.google-analytics.com/analytics.js'
  window['GoogleAnalyticsObject'] = 'ga'
  window['ga'] = window['ga'] || wintach
  window['ga'].l = 1 * new Date()
  const a = document.createElement('script')
  const m = document.getElementsByTagName('script')[0]
  a.async = 1
  a.src = uri
  m.parentNode.insertBefore(a, m)

  function wintach () {
    window['ga'].q = window['ga'].q || []
    window['ga'].q.push(arguments)
  }
}
