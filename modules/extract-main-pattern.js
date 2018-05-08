module.exports = function extractMainPattern(str) {
  const [full, expression, flag] = str.match(/^\/(.*?)\/([gimuy]*)$/);
  return { expression, flag };
};
