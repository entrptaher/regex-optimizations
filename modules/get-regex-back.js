const unescapeRegExp = require("./unescape-regex");
module.exports = function getRegexBack(str, flags) {
    return new RegExp(unescapeRegExp(str), flags);
}