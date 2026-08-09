/**
 * Minimal Markdown renderer.
 *
 * Deliberately tiny: only what the site content actually uses. No dependency,
 * no build step. HTML written directly in the .md file passes through
 * untouched, which is how the audio/video embeds survive.
 */
export function renderMarkdown(src) {
  const bloques = src.replace(/\r\n/g, '\n').split(/\n{2,}/);
  return bloques.map(b => {
    const t = b.trim();
    if (!t) return '';
    // HTML crudo (iframes, divs de embeds): pasa tal cual
    if (/^<(?!strong|em|a\b)/.test(t)) return t;
    // Encabezados
    const h = t.match(/^(#{1,4})\s+(.*)$/s);
    if (h) return `<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`;
    // Listas
    if (/^[-*]\s/.test(t)) {
      const li = t.split('\n').map(l => `<li>${inline(l.replace(/^[-*]\s+/, ''))}</li>`).join('');
      return `<ul>${li}</ul>`;
    }
    return `<p>${inline(t)}</p>`;
  }).join('\n');
}

function inline(s) {
  return s
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
    .replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
      (_m, txt, url, cls) => {
        const ext = /^https?:\/\//.test(url) && !url.includes('jorgevs.com');
        const attrs = ext ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${url}"${attrs}${cls ? ` class="${cls}"` : ''}>${txt}</a>`;
      })
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, ' ');
}

/** Carga y renderiza un fichero de content/. */
export async function loadSection(nombre, version = '') {
  const r = await fetch(`/content/${nombre}.md${version ? `?v=${version}` : ''}`);
  if (!r.ok) throw new Error(`No se pudo cargar content/${nombre}.md (HTTP ${r.status})`);
  return renderMarkdown(await r.text());
}
