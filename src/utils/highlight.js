import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import c from 'highlight.js/lib/languages/c';
import sql from 'highlight.js/lib/languages/sql';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';

Object.entries({ javascript, typescript, python, java, cpp, c, sql, bash, json, xml, css }).forEach(([n, l]) => hljs.registerLanguage(n, l));
hljs.registerAliases(['js', 'jsx'], { languageName: 'javascript' });
hljs.registerAliases(['ts', 'tsx'], { languageName: 'typescript' });
hljs.registerAliases(['html'], { languageName: 'xml' });
hljs.registerAliases(['sh', 'shell'], { languageName: 'bash' });

export function highlightIn(container) {
  container?.querySelectorAll('pre code').forEach((el) => {
    const lang = [...el.classList].find((c2) => c2.startsWith('language-'))?.slice(9);
    if (lang && hljs.getLanguage(lang)) {
      el.removeAttribute('data-highlighted');
      hljs.highlightElement(el);
    }
  });
}
export const EDITOR_LANGUAGES = ['javascript', 'typescript', 'python', 'java', 'cpp', 'c', 'sql', 'bash', 'json', 'html', 'css'];
