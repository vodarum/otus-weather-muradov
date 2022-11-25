class Util {
  isDefined(value) {
    return value !== null && typeof value !== "undefined";
  }
}

export default new Util();
