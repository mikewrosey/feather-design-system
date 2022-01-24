module.exports = {
  print(val, printer) {
    const keys = Object.keys(val.dataset).filter((k) => k.startsWith("v-"));

    keys.forEach((key) => {
      val.removeAttribute(`data-${key}`);
    });

    return printer(val);
  },

  test(val) {
    if (val && val.dataset) {
      return Object.keys(val.dataset).some((k) => k.startsWith("v-"));
    }
    return false;
  },
};
