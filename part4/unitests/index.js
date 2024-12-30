const reverse = (string) => {
  return string.split("").reverse().join("");
};
const average = (array) => {
  const reducer = (sum, item) => {
    return sum + item;
  };

  return array.length === 0 ? 0 : array.reduce(reducer, 0) / array.length;
};

module.exports = {
  reverse,
  average,
};

console.log(reverse("hello my name is harun"));
console.log(average([1, 2, 3, 4, 4, 5, 6, 6, 5, 4]));
