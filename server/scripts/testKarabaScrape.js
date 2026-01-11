const axios = require('axios');
const cheerio = require('cheerio');

const URL = 'https://gundam.fandom.com/wiki/Karaba';

const extractInfoboxData = ($page) => {
    const data = {};

    // Select the first portable infobox
    const $infobox = $page('.portable-infobox').first();
    if (!$infobox.length) return data;

    // 1. Standard Labeled Fields
    $infobox.find('.pi-data').each((i, el) => {
        const $el = $page(el);
        const label = $el.find('.pi-data-label').text().trim().toLowerCase();
        const $value = $el.find('.pi-data-value');
        
        // ... (simplified value extraction for brevity, focusing on the problem area)
    });

    // 2. Section Headers (e.g. "Mobile Weapons")
    console.log('Scanning headers...');
    $infobox.find('.pi-header').each((i, el) => {
        const headerText = $page(el).text().trim().toLowerCase();
        console.log(`  Header found: "${headerText}"`);
        
        let next = $page(el).next();
        const items = [];
        
        while(next.length && !next.hasClass('pi-header')) {
            console.log(`    Checking sibling: ${next.attr('class')}`);
            
            if (next.hasClass('pi-data') || next.hasClass('pi-group') || next.hasClass('pi-image-collection')) {
                 next.find('li').each((j, li) => {
                     const t = $page(li).text().trim().replace(/\[\d+\]/g, '');
                     if(t) items.push(t);
                 });
                 // Text fallback
                 if(items.length === 0 && next.find('.pi-data-value').length) {
                      const val = next.find('.pi-data-value').text().trim();
                      if(val) items.push(val);
                 }
            }
            next = next.next();
        }

        console.log(`    -> Captured ${items.length} items.`);

        if (items.length > 0) {
            if (headerText.includes('mobile weapon') || headerText.includes('mobile suit') || headerText.includes('unit')) {
                data.mobileWeapons = items;
            }
            if (headerText.includes('vehicle') || headerText.includes('ship') || headerText.includes('vessel')) {
                data.vehicles = items;
            }
        }
    });

    return data;
}

async function run() {
    try {
        const { data } = await axios.get(URL);
        const $ = cheerio.load(data);
        const result = extractInfoboxData($);
        console.log('RESULT:', JSON.stringify(result, null, 2));
    } catch (e) {
        console.error(e);
    }
}

run();
