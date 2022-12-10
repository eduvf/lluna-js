import { CodeJar } from "//unpkg.com/codejar";

import lib from "./lluna/lib.mjs";
import { exec } from "./lluna/lluna.mjs";
import lluna from "./lluna/lluna.mjs";

const select = document.getElementById("select");
const editor = document.querySelector(".editor");
const output = document.getElementById("output");

////////////////////////////////////////////////////////////////////////////////
// Code editor & syntax highlighting
////////////////////////////////////////////////////////////////////////////////

const highlight = (editor) => {
  let code = editor.textContent;

  code = code
    .replace(/(\(\s*|^\s*)([^\s\(\)\,]+)/gm, '$1<span style="font-weight: bold; color: var(--orange);">$2</span>')
    .replace(/(,[^\n]*$)/gm, '<span style="font-style: italic; color: var(--purple-lighter);">$1</span>')
    .replace(/('.*?'|\d*\.\d+|\b\d+\.?)/g, '<span style="font-weight: bold;">$1</span>');

  editor.innerHTML = code;
};

let jar = CodeJar(editor, highlight);
// Set default message
jar.updateCode(", start writing lluna code or select an example");

////////////////////////////////////////////////////////////////////////////////
// Load example
////////////////////////////////////////////////////////////////////////////////

window.loadExample = () => {
  let scriptName = select.value;
  let url = "https://raw.githubusercontent.com/eduvf/lluna-js/main/examples/" + scriptName + ".lluna";

  // fetch code
  fetch(url).then((response) => {
    response.text().then((text) => {
      jar.updateCode(text);
    });
  });
};

////////////////////////////////////////////////////////////////////////////////
// Clear buttons
////////////////////////////////////////////////////////////////////////////////

window.clearEditor = () => {
  jar.updateCode("");
};
window.clearOutput = () => {
  output.innerText = "(( lluna lang )) beta\nOutput:\n";
};
clearOutput();

////////////////////////////////////////////////////////////////////////////////
// Run code
////////////////////////////////////////////////////////////////////////////////

// Modify print (>) to print to output
let env = lib(exec);
env[0][">"] = (arg, env) => {
  let l = arg.map((a) => exec(a, env));
  // console.log(l.join(' '));
  output.innerText += "> " + l.join(" ") + "\n";
  return l;
};
window.runCode = () => {
  output.innerText += "\n";
  lluna(jar.toString(), env);
};
