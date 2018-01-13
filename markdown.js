const Marked = require('marked');

function resolveUrl(base, href) {
  if (!baseUrls[' ' + base]) {
    // we can ignore everything in base after the last slash of its path component,
    // but we might need to add _that_
    // https://tools.ietf.org/html/rfc3986#section-3
    if (/^[^:]+:\/*[^/]*$/.test(base)) {
      baseUrls[' ' + base] = base + '/';
    } else {
      baseUrls[' ' + base] = base.replace(/[^/]*$/, '');
    }
  }
  base = baseUrls[' ' + base];

  if (href.slice(0, 2) === '//') {
    return base.replace(/:[\s\S]*/, ':') + href;
  } else if (href.charAt(0) === '/') {
    return base.replace(/(:\/*[^/]*)[\s\S]*/, '$1') + href;
  } else {
    return base + href;
  }
}

const renderer = new Marked.Renderer();

renderer.heading = function(text, level, raw) {
  return `
<div class="post-title">
  <h${level} id="${raw.toLowerCase().replace(/[^\w]+/g, '-')}" >
    ${text}
  </h${level}>
</div>
  `;
};

renderer.blockquote = function(quote) {
  return `
<blockquote class="margin-top-40 margin-bottom-40">
    ${quote}
</blockquote>
`;
}

renderer.list = function(body, ordered) {
  const classNames = ['list', 'margin-top-40'];
  if (ordered) {
    classNames.push('list-style');
  }
  return `
<div class="${classNames.join(' ')}">
  <ul>
    ${body}
  </ul>
</div>
`;
};
module.exports = renderer;
