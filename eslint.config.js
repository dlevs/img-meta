/* eslint-disable @typescript-eslint/no-var-requires */

const { configure } = require("@dlevs/eslint-config");

module.exports = [
  {
    ignores: ["dist/**"],
  },
  ...configure(),
];
