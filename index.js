const getArrayRepeatations = require("./modules/get-array-repeatations");
const regExpFromString = require("./modules/regexp-from-string");
const escapeRegExp = require("./modules/escape-regex");
const unescapeRegExp = require("./modules/unescape-regex");
const extractMainPattern = require("./modules/extract-main-pattern");
const getRegexBack = require("./modules/get-regex-back");

function sortenSimple(data, filler = " ") {
  const x = data;
  const y = escapeRegExp(x.expression);
  const z = x.expression.split(filler);

  const duplicates = getArrayRepeatations(z, { duplicateInRow: true });
  const entries = Object.entries(duplicates);

  function processGetEntry(target, pattern, time) {
    const b = `${pattern}${filler}`;
    const ctimes0 = escapeRegExp(b);
    const ctimes1 = escapeRegExp(ctimes0);
    const ctimes3 = ctimes1.repeat(time);
    const c = new RegExp(ctimes3, "im");
    const d = target.replace(c, `(${ctimes0}){${time}}`);
    return d;
  }

  function plugReplace(y) {
    let f = y;
    for (let [pattern, times] of entries) {
      for (let time of times) {
        if (time > 1) {
          f = processGetEntry(f, pattern, time);
        }
      }
    }
    return f;
  }

  return plugReplace(y);
}

/*
Simple Merge:
(\w+ ){2}\w+ -> (\w+ ){3}
\w+ \w+ \w+ \w+ \w+ \d+ -> (\w+\s){5}\d+
\w+ \w+.\w+ \w+ \w+ \d+ -> (\w+ \w+)(\.)(\w+ ){2}\w+ \d+ -> (\w+ \w+)(\.)(\w+ ){3}\d+
*/

/**
 * Simple optimizer container
 * @param {*} regex
 * @param {*} filler
 */
function s1(regex, filler) {
  if (typeof regex === "object") {
    regex = regex.toString();
  }

  const pat = extractMainPattern(regex);
  const newStr = sortenSimple(pat, filler);
  const finalReg = getRegexBack(newStr, pat.flag);
  return finalReg;
}

const arguments = process.argv[2];
if (arguments) {
  const unrefined = arguments;
  const refined = s1(regExpFromString(arguments));

  console.log({ unrefined, refined });
}
