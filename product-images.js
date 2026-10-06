/* Recommendation thumbnails are local copies of the two company websites' images.
   Originals and saved dimensions are recorded in product-images/sources.json. */
(function (root) {
  'use strict';
  const files = {
    bag: 'bag', 'pulse-bag': 'bag',
    cartridge: 'cartridge', cyclone: 'cyclone', 'multi-cyclone': 'multi-cyclone',
    'wet-dust': 'wet-dust', 'wet-cyclone': 'wet-cyclone', esp: 'esp',
    scrubber: 'scrubber', 'chemical-wash': 'chemical-wash', carbon: 'carbon', rto: 'rto',
    oil: 'oil-esp', 'oil-esp': 'oil-esp', 'oil-wash': 'oil-wash',
    'paint-system': 'paint',
    fan: 'fan', 'hp-forward-fan': 'hp-forward', 'hp-backward-fan': 'fan', high: 'fan',
    'medium-backward-fan': 'medium-backward', backward: 'medium-backward',
    'medium-radial-fan': 'radial', radial: 'radial',
    'axial-fan': 'axial', 'frp-fan': 'frp', frp: 'frp',
    duct: 'duct', 'oil-exhaust': 'fan'
  };
  function element(tag, value, className) {
    const node = document.createElement(tag);
    node.textContent = value;
    if (className) node.className = className;
    return node;
  }
  function card(item) {
    const article = element('article', '', 'recommendation-card');
    const file = files[item.id];
    if (file) {
      const media = element('a', '', 'recommendation-card-media');
      media.href = item.url;
      media.target = '_blank';
      media.rel = 'noopener noreferrer';
      media.setAttribute('aria-label', `查看${item.name}官網產品頁`);
      const image = document.createElement('img');
      image.src = `../product-images/${file}.webp`;
      image.alt = `${item.name}相關設備圖片`;
      image.loading = 'lazy';
      image.decoding = 'async';
      image.addEventListener('error', () => media.remove(), { once: true });
      media.append(image, element('span', '官網設備圖片', 'recommendation-image-credit'));
      article.append(media);
    }
    article.append(element('span', item.category, 'tag'), element('h3', item.name), element('p', item.reason));
    const link = element('a', '查看官網產品 ↗');
    link.href = item.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    article.append(link);
    return article;
  }
  root.BestaProductImages = { card, imageFor: id => files[id] || null };
})(window);
