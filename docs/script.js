import { CodeJar } from '//unpkg.com/codejar';

import lib from './lluna/lib.mjs';
import { exec } from './lluna/lluna.mjs';
import lluna from './lluna/lluna.mjs';

const select = document.getElementById('select');
const editor = document.querySelector('.editor');
const output = document.getElementById('output');

////////////////////////////////////////////////////////////////////////////////
// Code editor & syntax highlighting
////////////////////////////////////////////////////////////////////////////////

const styleReplace = [
  // comments
  [/(,.*$)/, '<span style="color: var(--purple-lighter)"><i>$1</i></span>'],
  // strings
  [/('.*?')/, '<b><i>$2</i></b>'],
  // numbers
  [/(-?\d+\.?\d*|-?\d*\.\d+)/, '<b>$3</b>'],
  // functions (f ...)
  [/(\(\s*|^\s*)([^\s(),']+)/, '$4<span style="color: var(--orange)"><b>$5</b></span>'],
];
const buildRegex = new RegExp(styleReplace.map((e) => e[0].source).join('|'), 'gm');
const buildString = styleReplace.map((e) => e[1]).join('');

const highlight = (e) => {
  e.innerHTML = e.textContent.replace(buildRegex, buildString);
};

let jar = CodeJar(editor, highlight);
// Set default message
jar.updateCode(', start writing lluna code or select an example');

////////////////////////////////////////////////////////////////////////////////
// Load example
////////////////////////////////////////////////////////////////////////////////

window.loadExample = () => {
  let scriptName = select.value;
  let url = 'https://raw.githubusercontent.com/eduvf/lluna-js/main/examples/' + scriptName + '.lluna';

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
  jar.updateCode('');
};
window.clearOutput = () => {
  output.innerText = '(( lluna lang )) beta\nOutput:\n';
};
clearOutput();

////////////////////////////////////////////////////////////////////////////////
// Run code
////////////////////////////////////////////////////////////////////////////////

// Modify print (>) to print to output
let env = lib(exec);
env[0]['>'] = (arg, env) => {
  let l = arg.map((a) => exec(a, env));
  // console.log(l.join(' '));
  output.innerText += '> ' + l.join(' ') + '\n';
  return l;
};
window.runCode = () => {
  output.innerText += '\n';
  lluna(jar.toString(), env);
};
