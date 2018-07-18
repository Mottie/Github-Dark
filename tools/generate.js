#!/usr/bin/env node
"use strict";

const css = require("css");
const fs = require("fs-extra");
const got = require("got");
const parse5 = require("parse5");
const path = require("path");
const perfectionist = require("perfectionist");
const urlToolkit = require("url-toolkit");

// This list maps old declarations to new ones. Ordering is important for cases
// where one declaration is meant to override another, like in the border cases
// where GitHub for example overrides border-bottom with another border-bottom
// further below. Ideally these cases should be detected and the resulting rule
// should not be merged but instead be inserted in the original ordering based
// on GitHub's style.
const mappings = {
  // Grey scale
  "background: #fff": "background: #181818",
  "background: #fafbfc": "background: #181818",
  "background: #f6f8fa": "background: #202020",
  "background: #eaecef": "background: #343434",
  "background: #d1d5da": "background: #444",

  "background-color: #fff": "background-color: #181818",
  "background-color: #fafbfc": "background-color: #181818",
  "background-color: #f6f8fa": "background-color: #202020",
  "background-color: #eaecef": "background-color: #343434",
  "background-color: #d1d5da": "background-color: #444",

  "background-color: #6a737d": "background-color: #222",

  // some navigation focuses use this, like notifications
  "background-color: #f1f8ff": "background-color: #242424",

  // Colors *after* grey scale
  "background-color: #2cbe4e": "background-color: #163",
  "background-color: #6f42c1": "background-color: #6e5494",
  "background-color: #cb2431": "background-color: #911",
  "background-color: #d73a49": "background-color: #911",
  "background-color: #dbedff": "background-color: #182030",
  "background-color: #fff5b1": "background-color: #261d08",
  "background-color: #fffbdd": "background-color: #261d08",
  "background: #0366d6": "background: /*[[base-color]]*/ #4183c4",
  "background-color: #0366d6": "background-color: /*[[base-color]]*/ #4183c4 !important; color: #fff",

  "background: #dbedff": "background: #273045",
  "background: #fffbdd": "background: #261d08",

  "border: 1px solid #e1e4e8": "border-color: #343434",
  "border: 1px solid #eee": "border-color: #343434",
  "border: 1px solid rgba(27,31,35,0.15)": "border-color: rgba(225,225,225,0.2)",
  "border: 2px solid #fff": "border-color: #222",
  "border: solid #ddd": "border-color: #484848",

  "border-color: #e1e4e8": "border-color: #343434",
  "border-color: #dfe2e5": "border-color: #484848",
  "border-bottom-color: #e36209": "border-bottom-color: #eee",

  "border-bottom: 1px solid #dfe2e5": "border-bottom: 1px solid #343434",
  "border-bottom: 1px solid #ddd": "border-bottom: 1px solid #484848",
  "border-bottom: 1px solid #d8d8d8": "border-bottom: 1px solid #484848",

  "border-bottom: 1px solid #e1e4e8": "border-bottom: 1px solid #343434",
  "border-left: 1px solid #e1e4e8": "border-left: 1px solid #343434",
  "border-right: 1px solid #e1e4e8": "border-right: 1px solid #343434",
  "border-top: 1px solid #e1e4e8": "border-top: 1px solid #343434",

  "border-bottom: 0": "border-bottom: 0",
  "border-left: 0": "border-left: 0",
  "border-right: 0": "border-right: 0",
  "border-top: 0": "border-top: 0",

  "border-top-color: rgba(27,31,35,0.15)": "border-top-color: #343434",
  "border-bottom-color: rgba(27,31,35,0.15)": "border-bottom-color: #343434",
  "border-left-color: rgba(27,31,35,0.15)": "border-left-color: #343434",
  "border-right-color: rgba(27,31,35,0.15)": "border-right-color: #343434",

  "border-left-color: #f6f8fa": "border-left-color: #222",

  "border-bottom-color: #fff": "border-bottom-color: #181818",
  "border-left-color: #fff": "border-left-color: #181818",
  "border-top-color: #fff": "border-top-color: #181818",
  "border-right-color: #fff": "border-right-color: #181818",

  "border-bottom-color: transparent": "border-bottom-color: transparent",
  "border-left-color: transparent": "border-left-color: transparent",
  "border-top-color: transparent": "border-top-color: transparent",
  "border-right-color: transparent": "border-right-color: transparent",

  "border-top: 7px solid #fff": "border-top: 7px solid #181818",
  "border-top: 8px solid rgba(27,31,35,0.15)": "border-top: 8px solid #343434",

  "color: #24292e": "color: #c0c0c0",
  "color: #333"   : "color: #c0c0c0",
  "color: #444d56": "color: #b5b5b5",
  "color: #586069": "color: #949494",
  "color: #666"   : "color: #949494",
  "color: #6a737d": "color: #949494",
  "color: #959da5": "color: #7b7b7b",
  "color: #a3aab1": "color: #606060",
  "color: #c6cbd1": "color: #4d4d4d",
  "color: rgba(27,31,35,0.85)": "color: rgba(230,230,230,.85)",

  // red
  "color: #cb2431": "color: #f44",

  // orange
  "color: #a04100": "color: #f3582c",

  // green
  "color: #28a745": "color: #6cc644",

  // yellow
  "color: #b08800": "color: #cb4",

  // purple
  "color: #6f42c1": "color: #8368aa",
};

// list of URLs to pull stylesheets from
const urls = [
  {url: "https://github.com"},
  {url: "https://gist.github.com"},
  {url: "https://help.github.com"},
  // {url: "https://github.com/login", opts: {headers: {"User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Mobile Safari/537.36"}}},
];

// list of regexes matching selectors that should be ignored
const ignoreSelectors = [
  /\.CodeMirror/,
  /\.cm-/, // CodeMirror
  /\.Box$/,
  /\.pl-/, // GitHub Pretty Lights Syntax highlighter
  /\spre$/,
  /:not\(li\.moved\)/
];

// list of regexes matching selectors that shouldn't be merged with other
// selectors because they can generate invalid rules.
const unmergeableSelectors = [
  /(-moz-|-ms-|-o-|-webkit-).+/,
  /:selection|:placeholder$/,
];

// list of shorthand properties where values are compared insensitively
// to their order, e.g. "1px solid red" is equal to "1px red solid".
const shorthands = [
  "border",
  "border-left",
  "border-right",
  "border-top",
  "border-bottom",
  "background",
  "font"
];

const perfOpts = {
  maxSelectorLength: 76, // -4 because of indentation and to accomodate ' {'
  indentSize: 2,
};

const replaceRe = /.*begin auto-generated[\s\S]+end auto-generated.*/gm;
const cssFile = path.join(__dirname, "..", "github-dark.css");

Promise.all(urls.map(u => got(u.url, u.opts)))
  .then(responses => extractStyleLinks(responses))
  .then(links => Promise.all(links.map(link => got(link))))
  .then(responses => responses.map(res => res.body).join("\n"))
  .then(css => parseDeclarations(css))
  .then(decls => buildOutput(decls))
  .then(css => writeOutput(css))
  .catch(exit);

async function writeOutput(generatedCss) {
  const css = await fs.readFile(cssFile, "utf8");
  await fs.writeFile(cssFile, css.replace(replaceRe, generatedCss));
}

function extractStyleLinks(responses) {
  const styleUrls = [];
  responses.forEach(res => {
    extractStyleHrefs(res.body).forEach(href => {
      styleUrls.push(urlToolkit.buildAbsoluteURL(res.requestUrl, href));
    });
  });
  return styleUrls;
}

function extractStyleHrefs(html) {
  return (html.match(/<link.+?>/g) || []).map(link => {
    const attrs = {};
    parse5.parseFragment(link).childNodes[0].attrs.forEach(attr => {
      attrs[attr.name] = attr.value;
    });
    if (attrs.rel === "stylesheet" && attrs.href) {
      return attrs.href;
    }
  }).filter(link => !!link);
}

function parseDeclarations(cssString) {
  const decls = [];
  css.parse(cssString).stylesheet.rules.forEach(rule => {
    if (!rule.selectors || rule.selectors.length === 0) return;
    rule.declarations.forEach(decl => {
      Object.keys(mappings).forEach(mapping => {
        if (!decls[mapping]) decls[mapping] = [];
        const [prop, val] = mapping.split(": ");
        decl.value = decl.value.replace(/!important/g, "").trim(); // remove !important
        if (decl.property === prop && isEqualValue(prop, decl.value, val)) {
          rule.selectors.forEach(selector => {
            // Skip potentially unmergeable selectors
            // TODO: Use clean-css or similar to merge rules later instead
            if (unmergeableSelectors.some(re => re.test(selector))) return;

            // Skip ignored selectors
            if (ignoreSelectors.some(re => re.test(selector))) return;

            // stylistic tweaks
            selector = selector.replace(/::/, ":");
            selector = selector.replace(/\+/, " + ");
            selector = selector.replace(/~/, " ~ ");
            selector = selector.replace(/>/, " > ");
            selector = selector.replace(/ {2,}/, " ");

            // add the selector to our list, unless it's already on it
            if (!decls[mapping].includes(selector)) {
              decls[mapping].push(selector);
            }
          });
        }
      });
    });
  });
  return decls;
}

function buildOutput(decls) {
  let output = "/* begin auto-generated rules - use tools/generate.js to generate them */\n";
  Object.keys(mappings).forEach(decl => {
    if (decls[decl].length) {
      output += `/* auto-generated rule for "${decl}" */\n`;
      const selectors = decls[decl].join(",");
      output += String(perfectionist.process(selectors + "{" + mappings[decl] + " !important}", perfOpts));
    } else {
      console.error(`Warning: no declarations for ${decl} found!`);
    }
  });
  output += "/* end auto-generated rules */";
  return output.split("\n").map(line => "  " + line).join("\n");
}

function isEqualValue(prop, a, b) {
  a = a.trim().toLowerCase();
  b = b.trim().toLowerCase();

  // try to ignore order in shorthands
  if (shorthands.includes(prop)) {
    return a.split(" ").sort().join(" ") === b.split(" ").sort().join(" ");
  } else {
    return a === b;
  }
}

function exit(err) {
  if (err) console.error(err);
  process.exit(err ? 1 : 0);
}
