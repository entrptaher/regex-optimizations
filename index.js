function chunk(arr, chunkSize) {
  var R = [];
  for (var i = 0, len = arr.length; i < len; i += chunkSize)
    R.push(arr.slice(i, i + chunkSize));
  return R;
}

function isString(input) {
  return typeof regex === "string";
}

function extractMainPattern(str) {
  const [full, expression, flag] = str.match(/^\/(.*?)\/([gimuy]*)$/);
  return { expression, flag };
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function unescapeRegExp(string) {
  return string.replace(/\\(.)/g, "$1");
}

function getRegexBack(str, flags) {
  return new RegExp(unescapeRegExp(str), flags);
}

function getArrayRepeatations(arr, { duplicateInRow } = {}) {
  const counts = {};

  function createNonExist(x, n = 0) {
    if (!counts[x]) counts[x] = [n];
  }

  function increaseCount(x) {
    ++counts[x][counts[x].length - 1];
  }
  function lastLength(x) {
    return counts[x][counts[x].length - 1];
  }

  function duplicateCheck(arr, x, i) {
    if (duplicateInRow) {
      const prevSame = arr[i - 1] && arr[i - 1] == arr[i];
      if (!prevSame) {
        const last = lastLength(x);
        if (last === 0) increaseCount(x);
        if (last > 1) {
          counts[x].push(1);
        }
      }
      return prevSame;
    }
    return true;
  }

  arr.forEach((x, i) => {
    createNonExist(x);
    if (duplicateCheck(arr, x, i)) {
      increaseCount(x);
    }
  });

  return counts;
}

function removeEmptyRegBlocks(str) {
  return str.replace(/\(\)/gm, "");
}

function removeEmptySpaceBacklash(str) {
  return str.replace(/(\\ )/gm, " ");
}

class RegexWorker {
  constructor(regex, params = {}) {
    this.input = {
      regex: isString(regex) ? new RegExp(regex) : regex,
      string: isString(regex) ? regex : regex.toString()
    };
    this.extracted = extractMainPattern(this.input.string);
    this.output = {};
    this.levelSwitch(params.level);
  }
  levelSwitch(level = 0) {
    switch (level) {
      default:
        let simplified = this.simplifyBySpace(this.extracted);
        simplified = removeEmptyRegBlocks(simplified);
        simplified = removeEmptySpaceBacklash(simplified);
        console.log(simplified);
        this.output.regex = new RegExp(simplified, this.extracted.flag);
        this.output.string = this.output.regex.toString();
        return;
    }
  }
  simplifyBySpace(input) {
    let current = input;
    // Simplify one with space in them
    const { expression } = current;
    const splitter = ` `;
    const expressionSplitted = current.expression.split(splitter);
    const duplicates = getArrayRepeatations(expressionSplitted, {
      duplicateInRow: true
    });
    const entries = Object.entries(duplicates);

    function refillTarget(target, pattern, time) {
      const newPattern = `${pattern}${splitter}`;
      const repeatUptoTime = newPattern.repeat(time);
      const finder = new RegExp(escapeRegExp(repeatUptoTime), "im");
      const replacer = `(${newPattern}){${time}}`;
      return target.replace(finder, replacer);
    }

    function replacer() {
      let expHolder = expression.slice(0);
      for (let [pattern, times] of entries) {
        for (let time of times) {
          if (time > 1) {
            expHolder = refillTarget(expHolder, pattern, time);
          }
        }
      }
      return expHolder;
    }

    return replacer();
  }
}

module.exports = RegexWorker;

/*
USAGE: 
const worker = new RegexWorker(/()(\w+\ \w+\ \w+\ \w+\ \w+\ \w+\ \d+)()/gi);
console.log(worker);
*/
