const { random } = require('lodash')

const generateSeat = (min, max, exclude) => {
  let ranSeat = random(min, max)
  if (exclude.includes(ranSeat.toString())) {
    ranSeat = generateSeat(min, max, exclude)
  }
  return ranSeat
}

module.exports = {
  generateSeat
}
