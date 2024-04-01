const hashing = require("bindings")("hashing.node");

////////////////////////////////////////////////////////////////////////////////

// Main Algorithms Function
const Algorithms = {
  // argon2d16000 Algorithm
  argon2d16000: {
    multiplier: Math.pow(2, 16),
    diff: parseInt(
      "0x00000000ffff0000000000000000000000000000000000000000000000000000"
    ),
    hash: function () {
      return function () {
        return hashing.argon2d16000.apply(this, arguments);
      };
    },
  },

  // Sha256d Algorithm
  sha256d: {
    multiplier: 1,
    diff: parseInt(
      "0x00000000ffff0000000000000000000000000000000000000000000000000000"
    ),
    hash: function () {
      return function () {
        return hashing.sha256d.apply(this, arguments);
      };
    },
  },
};

module.exports = Algorithms;
