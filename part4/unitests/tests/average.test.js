const { test, describe } = require("node:test");
const assert = require("node:assert");

const average = require("../index.js").average;

describe("average", () => {
  test("should return the average of an array of numbers", () => {
    assert.strictEqual(average([1, 2, 3, 4, 5, 6]), 3.5);
  });
});

test("of many is calculated", () => {
  assert.strictEqual(average([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]), 5.5);
});

test("of empty array is zero", () => {
  assert.strictEqual(average([]), 0);
});
