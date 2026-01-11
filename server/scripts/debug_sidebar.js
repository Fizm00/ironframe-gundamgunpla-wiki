const cheerio = require('cheerio');
const fs = require('fs');

try {
    const html = fs.readFileSync('debug_detail.html', 'utf8');
    const $ = cheerio.load(html);
    console.log('Loaded debug_detail.html');

    const getSidebarMap = (headerText) => {
        // Debug finding the header
        const h3s = $('h3');
        console.log(`\nScanning ${h3s.length} H3s for "${headerText}"...`);
        
        let target = null;
        h3s.each((i, el) => {
            const text = $(el).text().trim();
            // console.log(`  [${i}] "${text}"`);
            if (text.toLowerCase() === headerText.toLowerCase()) {
                target = $(el);
                console.log(`  -> MATCH FOUND!`);
            }
        });

        if (!target) {
            console.log('  -> Target Header NOT FOUND');
            return {};
        }

        const nextDl = target.next('dl');
        if (!nextDl.length) {
            console.log('  -> Next DL NOT FOUND. Next element is:', target.next().prop('tagName'));
            // Try finding DL in siblings (maybe there's a div wrapper?)
            // Or maybe the H3 is inside a div and the DL is a sibling of the H3?
            // "h3 class=... mb-8" -> "dl class=..."
            return {};
        }

        const map = {};
        nextDl.find('dt').each((_, dt) => {
             const key = $(dt).text().trim();
             const dd = $(dt).next('dd');
             let value = dd.text().trim().replace(/\s+/g, ' ');
             map[key] = value;
        });
        return map;
    };

    const specs = getSidebarMap('Specifications');
    console.log('Specs extracted:', specs);

    const perf = getSidebarMap('Performance');
    console.log('Performance extracted:', perf);

} catch (e) {
    console.error(e);
}
