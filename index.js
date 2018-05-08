const getArrayRepeatations = require("./modules/get-array-repeatations");
const regExpFromString = require("./modules/regexp-from-string");
const escapeRegExp = require("./modules/escape-regex");
const unescapeRegExp = require("./modules/unescape-regex");

class RegexWorker {
  constructor(regex, params = {}) {
    this.input = regex;
    this.output = {
      regex: regex,
      string: regex.toString()
    };
    this.finalRegex = regex.toString();
    this.finalRegexObj = regex;
    this.switchOptimizationLevels(params);
  }
  replaceSpace() {
    this.finalRegex = this.finalRegex.replace(/\s/gim, "\\s");
    return this;
  }
  convertToRegex() {
    this.finalRegexObj = regExpFromString(this.finalRegex);
    return this;
  }
  optimizeLevel1() {
    // this.replaceSpace();
    this.convertToRegex();
    return this;
  }
  switchOptimizationLevels(params) {
    switch (params.level) {
      case 1:
        this.optimizeLevel1();
        break;
      default:
    }
  }
  // extract main regex pattern from string
  extractMainPattern(str) {
    const [full, expression, flag] = str.match(/^\/(.*?)\/([gimuy]*)$/);
    return { expression, flag };
  }
}

function extractMainPattern(str) {
  const [full, expression, flag] = str.match(/^\/(.*?)\/([gimuy]*)$/);
  return { expression, flag };
}

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

function getRegexBack(str, flags) {
  return new RegExp(unescapeRegExp(str), flags);
}


const source = /\w+ \w+ \w+ \w+ \w+ \d+/gi;
const newReg = new RegexWorker(source, { level: 1 });

function s1(regex, filler) {
  if (typeof regex === "object") {
    regex = regex.toString();
  }

  const pat = extractMainPattern(regex);
  const newStr = sortenSimple(pat, filler);
  const finalReg = getRegexBack(newStr, pat.flag);
  return finalReg;
}

// s1(newReg.finalRegex)
unrefinedRegex = /\w+ \w+ \w+ \w+ \w+ \w+ \d+/gi;
refinedRegex = s1(unrefinedRegex);
// s2 = s1(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/, '\\d+')

const testWord = `enter sample word or number like 123`;
/*console.log(
  unrefinedRegex,
  refinedRegex,
  testWord.match(unrefinedRegex),
  testWord.match(refinedRegex)
);

Simple Merge:
(\w+ ){2}\w+ -> (\w+ ){3}
\w+ \w+ \w+ \w+ \w+ \d+ -> (\w+\s){5}\d+
\w+ \w+.\w+ \w+ \w+ \d+ -> (\w+ \w+)(\.)(\w+ ){2}\w+ \d+ -> (\w+ \w+)(\.)(\w+ ){3}\d+
*/

const arguments = process.argv[2];
if(arguments){
	console.log(`Unrefined: ${arguments}`)
	console.log(`Refined: ${s1(regExpFromString(arguments))}`)
}
