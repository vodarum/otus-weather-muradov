const Util = {
  isDefined<T>(value: T) {
    return value !== null && typeof value !== "undefined";
  },
};

export default Util;
