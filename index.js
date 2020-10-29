const Benchmark = require('benchmark')

const suite = new Benchmark.Suite()

const _obj = {}
const proxy = new Proxy(_obj, {
  set: (obj, prop, value) => { _obj[prop] = value },
  get: (obj, prop, receiver) => Reflect.get(obj, prop, receiver)
})

const defineProp = {}
Object.defineProperty(defineProp, 'prop', {
  configurable: true,
  enumerable: true,
  set: v => defineProp._v = v,
  get: () => defineProp._v
})


suite.add('proxy', function() {
  proxy.prop = 5
  proxy.prop
}).add('defineProperty', function() {
  defineProp.prop = 5
  defineProp.prop
}).on('cycle', function(event) {
  console.log(String(event.target))
}).on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'))
}).run()