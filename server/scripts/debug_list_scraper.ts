import axios from 'axios';
import * as cheerio from 'cheerio';

const LIST_URL = 'https://mechabay.com/universal-century-mecha';

async function testScrape() {
    console.log(`Fetching list from ${LIST_URL}...`);
    try {
        const { data: listHtml } = await axios.get(LIST_URL, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const $list = cheerio.load(listHtml);
        console.log('HTML loaded. Length:', listHtml.length);

        let count = 0;

        // Debug: Print first few H2s
        const h2s = $list('h2');
        console.log('Found H2 count:', h2s.length);
        h2s.slice(0, 3).each((i, el) => {
            console.log(`H2[${i}]:`, $list(el).text().trim());
        });

        const links: any[] = [];
        $list('h2').each((_, h2) => {
            const seriesName = $list(h2).text().trim();
            // console.log(`Checking series: ${seriesName}`);
            let next = $list(h2).next();
            while (next.length && !next.is('h2')) {
                // console.log('  Next tag:', next.prop('tagName'));
                if (next.is('p')) {
                    next.find('a').each((_, a) => {
                        const name = $list(a).text().trim();
                        const url = $list(a).attr('href');
                        if (name && url && url.includes('mechabay.com') && !name.includes('View all')) {
                            // console.log(`    Found: ${name} -> ${url}`);
                            links.push({ name, seriesName });
                            count++;
                        }
                    });
                }
                next = next.next();
            }
        });

        console.log(`Total Mobile Suits found: ${count}`);
        if (count > 0) {
            console.log('First 5:', links.slice(0, 5));
        }

    } catch (error: any) {
        console.error('Error:', error.message);
    }
}

testScrape();
