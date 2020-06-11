const fs = require('fs');
const transform = require('./loader/catch')
const testString = fs.readFileSync('./test.js', {
  encoding: 'utf8'
});
console.log(testString);

transform(testString)
