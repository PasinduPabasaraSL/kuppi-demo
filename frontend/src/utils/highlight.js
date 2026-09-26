// A deliberately small highlighter. It covers the five languages the notes use
// (bash, yaml, json, js, dockerfile) and keeps the project dependency-free.
// highlight() returns lines of tokens: [[{ text, type }, ...], ...]

// Inline commands sit on a light card...
export const tokenClass = {
  plain: 'text-mist-200',
  comment: 'text-mist-500 italic',
  command: 'text-brand-300',
  subcommand: 'text-brand-200',
  flag: 'text-flame-300',
  string: 'text-sand-300',
  number: 'text-flame-300',
  keyword: 'text-clay-300',
  key: 'text-brand-300',
  punct: 'text-mist-500',
};

// ...while code blocks stay dark, so they need the lighter end of each accent.
export const tokenClassOnDark = {
  plain: 'text-code-text',
  comment: 'text-code-muted italic',
  command: 'text-code-sage',
  subcommand: 'text-code-sage-soft',
  flag: 'text-code-flame',
  string: 'text-code-sand',
  number: 'text-code-flame',
  keyword: 'text-code-clay',
  key: 'text-code-sage',
  punct: 'text-code-muted',
};

const SHELL_TOOLS = new Set(['git', 'docker', 'kubectl', 'npm', 'npx', 'node', 'aws', 'helm']);

const DOCKERFILE_INSTRUCTIONS = new Set([
  'FROM',
  'WORKDIR',
  'COPY',
  'ADD',
  'RUN',
  'CMD',
  'ENTRYPOINT',
  'EXPOSE',
  'ENV',
  'ARG',
  'LABEL',
  'USER',
  'VOLUME',
  'HEALTHCHECK',
]);

const JS_KEYWORDS = new Set([
  'const',
  'let',
  'var',
  'function',
  'return',
  'import',
  'from',
  'export',
  'default',
  'async',
  'await',
  'if',
  'else',
  'new',
  'require',
  'module',
  'true',
  'false',
  'null',
  'undefined',
]);

const token = (text, type = 'plain') => ({ text, type });

const isQuoted = (value) =>
  (value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"));

const isNumber = (value) => /^-?\d+(\.\d+)?$/.test(value);

// Splits a line into whitespace runs, quoted strings and bare words.
function chunk(line) {
  return line.match(/\s+|"(?:[^"\\]|\\.)*"?|'(?:[^'\\]|\\.)*'?|[^\s]+/g) || [];
}

function highlightBash(line) {
  if (line.trim().startsWith('#')) return [token(line, 'comment')];

  const tokens = [];
  let wordIndex = 0;
  let inComment = false;

  for (const part of chunk(line)) {
    if (inComment) {
      tokens.push(token(part, 'comment'));
      continue;
    }
    if (/^\s+$/.test(part)) {
      tokens.push(token(part));
      continue;
    }
    if (part.startsWith('#')) {
      inComment = true;
      tokens.push(token(part, 'comment'));
      continue;
    }
    if (isQuoted(part)) {
      tokens.push(token(part, 'string'));
    } else if (part.startsWith('-')) {
      tokens.push(token(part, 'flag'));
    } else if (wordIndex === 0) {
      tokens.push(token(part, 'command'));
    } else if (wordIndex === 1 && SHELL_TOOLS.has(tokens.find((t) => t.type === 'command')?.text)) {
      tokens.push(token(part, 'subcommand'));
    } else if (isNumber(part)) {
      tokens.push(token(part, 'number'));
    } else {
      tokens.push(token(part));
    }
    wordIndex += 1;
  }

  return tokens;
}

function classifyValue(value) {
  if (isQuoted(value)) return 'string';
  if (isNumber(value)) return 'number';
  if (['true', 'false', 'null', '~'].includes(value)) return 'keyword';
  return 'plain';
}

function highlightYaml(line) {
  if (line.trim().startsWith('#')) return [token(line, 'comment')];
  if (line.trim() === '---') return [token(line, 'punct')];

  const match = line.match(/^(\s*)(-\s+)?([A-Za-z0-9_.\-/]+)(:)(.*)$/);
  if (match) {
    const [, indent, dash, key, colon, rest] = match;
    const tokens = [token(indent)];
    if (dash) tokens.push(token(dash, 'punct'));
    tokens.push(token(key, 'key'), token(colon, 'punct'));

    const value = rest.trim();
    if (value === '') {
      tokens.push(token(rest));
    } else if (value.startsWith('#')) {
      tokens.push(token(rest, 'comment'));
    } else {
      const leading = rest.slice(0, rest.indexOf(value));
      tokens.push(token(leading), token(value, classifyValue(value)));
    }
    return tokens;
  }

  const listItem = line.match(/^(\s*)(-\s+)(.*)$/);
  if (listItem) {
    const [, indent, dash, value] = listItem;
    return [token(indent), token(dash, 'punct'), token(value, classifyValue(value.trim()))];
  }

  return [token(line)];
}

function highlightDockerfile(line) {
  if (line.trim().startsWith('#')) return [token(line, 'comment')];

  const match = line.match(/^(\s*)([A-Z]+)(\s+)(.*)$/);
  if (match && DOCKERFILE_INSTRUCTIONS.has(match[2])) {
    const [, indent, instruction, space, rest] = match;
    const tokens = [token(indent), token(instruction, 'keyword'), token(space)];
    for (const part of chunk(rest)) {
      if (/^\s+$/.test(part)) tokens.push(token(part));
      else if (isQuoted(part)) tokens.push(token(part, 'string'));
      else if (part.startsWith('-')) tokens.push(token(part, 'flag'));
      else tokens.push(token(part));
    }
    return tokens;
  }

  return [token(line)];
}

// Regex-based pass, safe for JSON and JS where tokens are well delimited.
function highlightWithRegex(line, language) {
  const pattern =
    language === 'json'
      ? /("(?:[^"\\]|\\.)*"\s*:)|("(?:[^"\\]|\\.)*")|(\b-?\d+(?:\.\d+)?\b)|(\btrue\b|\bfalse\b|\bnull\b)|([{}[\],:])/g
      : /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b-?\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)/g;

  const tokens = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(line)) !== null) {
    if (match.index > lastIndex) tokens.push(token(line.slice(lastIndex, match.index)));

    const text = match[0];
    if (language === 'json') {
      if (match[1]) tokens.push(token(text, 'key'));
      else if (match[2]) tokens.push(token(text, 'string'));
      else if (match[3]) tokens.push(token(text, 'number'));
      else if (match[4]) tokens.push(token(text, 'keyword'));
      else tokens.push(token(text, 'punct'));
    } else if (match[1]) {
      tokens.push(token(text, 'comment'));
    } else if (match[2]) {
      tokens.push(token(text, 'string'));
    } else if (match[3]) {
      tokens.push(token(text, 'number'));
    } else {
      tokens.push(token(text, JS_KEYWORDS.has(text) ? 'keyword' : 'plain'));
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < line.length) tokens.push(token(line.slice(lastIndex)));
  return tokens;
}

function highlightLine(line, language) {
  if (line === '') return [token('')];

  switch (language) {
    case 'bash':
    case 'sh':
    case 'shell':
      return highlightBash(line);
    case 'yaml':
    case 'yml':
      return highlightYaml(line);
    case 'dockerfile':
      return highlightDockerfile(line);
    case 'json':
    case 'js':
    case 'jsx':
      return highlightWithRegex(line, language === 'json' ? 'json' : 'js');
    default:
      return [token(line)];
  }
}

export function highlight(code, language = 'text') {
  return code.split('\n').map((line) => highlightLine(line, language));
}
