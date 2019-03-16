

const calculateTip = (amt, tip) => {
  return (amt + (amt*tip/100));
}

const add = (a, b) => {
  return new Promise((resolve, reject) => {
    if (a < 0 || b < 0) {
      return reject('Numbers must be positive');
    }
    resolve(a+b);
  }, 2000);
}

module.exports = {
  calculateTip,
  add
}