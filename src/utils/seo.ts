import { ToolDefinition } from '../types';

export const BASE_URL = 'https://toolnest-hub.netlify.app';

export const updatePageSEO = (
  title: string,
  description: string,
  path: string,
  tool?: ToolDefinition
) => {
  const fullTitle = `${title} | ToolNest`;
  document.title = fullTitle;

  // Meta description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', description);

  // Canonical link
  const canonicalUrl = `${BASE_URL}${path}`;
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', canonicalUrl);

  // Open Graph
  const setMeta = (property: string, content: string) => {
    let el = document.querySelector(`meta[property="${property}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('property', property);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMeta('og:title', fullTitle);
  setMeta('og:description', description);
  setMeta('og:url', canonicalUrl);

  // Schema.org JSON-LD
  let scriptEl = document.getElementById('schema-json-ld');
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = 'schema-json-ld';
    scriptEl.setAttribute('type', 'application/ld+json');
    document.head.appendChild(scriptEl);
  }

  if (tool) {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          name: tool.name,
          operatingSystem: 'All (Web Browser)',
          applicationCategory: 'UtilitiesApplication',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
          },
          description: tool.longDesc,
          url: canonicalUrl
        },
        ...(tool.faqs && tool.faqs.length > 0
          ? [
              {
                '@type': 'FAQPage',
                mainEntity: tool.faqs.map(faq => ({
                  '@type': 'Question',
                  name: faq.question,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.answer
                  }
                }))
              }
            ]
          : [])
      ]
    };
    scriptEl.textContent = JSON.stringify(jsonLd);
  } else {
    const orgLd = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'ToolNest',
      url: BASE_URL,
      description: description,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE_URL}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };
    scriptEl.textContent = JSON.stringify(orgLd);
  }
};
