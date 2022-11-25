import Util from "./util";

const testData = [
  { value: null, result: false },
  { value: undefined, result: false },
  { value: 0, result: true },
  { value: "", result: true },
  { value: false, result: true },
];

describe("Util", () => {
  describe("isDefined", () => {
    test("is a function", () => {
      expect(Util.isDefined).toBeInstanceOf(Function);
    });

    testData.forEach(({ value, result }) => {
      test(`returns ${result} for "${value}"`, () => {
        expect(Util.isDefined(value)).toBe(result);
      });
    });
  });
});
