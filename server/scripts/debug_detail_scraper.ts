import axios from 'axios';
import * as cheerio from 'cheerio';

const URL = 'https://mechabay.com/rx-78-2-gundam';

async function testDetailScrape() {
    console.log(`Fetching ${URL}...`);
    try {
        const { data: html } = await axios.get(URL, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const fs = require('fs');
        fs.writeFileSync('debug_detail.html', html);
        console.log('Saved debug_detail.html');

        const $ = cheerio.load(html);
        console.log('Page loaded.');

        // Helper to debug headers
        console.log('--- HEADERS FOUND ---');
        $('h1, h2, h3, h4').each((i, el) => {
            console.log($(el).prop('tagName'), $(el).text().trim());
        });
        console.log('---------------------');

        // Test Specific Section Extraction
        const checkSection = (name: string) => {
            const header = $('h1, h2, h3, h4').filter((_, el) => $(el).text().trim().includes(name)).first();
            console.log(`\nChecking section: "${name}"`);
            if (header.length) {
                console.log(`Found header <${header.prop('tagName')}>: ${header.text()}`);
                let next = header.next();
                let count = 0;
                while (next.length && count < 3) {
                    console.log(`  Next sibling <${next.prop('tagName')}>: ${next.text().substring(0, 100)}...`);
                    next = next.next();
                    count++;
                }
            } else {
                console.log('Header NOT FOUND.');
            }
        }

        checkSection('History');
        checkSection('Design');
        checkSection('Production');
        checkSection('Development');
        checkSection('Specifications');
        checkSection('Performance');
        checkSection('Armaments');

        // Check for Tables (Specs often in tables)
        console.log('\n--- TABLES ---');
        $('table').each((i, table) => {
            console.log(`Table ${i}:`);
            $(table).find('tr').slice(0, 3).each((j, tr) => {
                console.log(`  Row ${j}: ${$(tr).text().trim().replace(/\s+/g, ' ')}`);
            });
        });

    } catch (error: any) {
        console.error('Error:', error.message);
    }
}

testDetailScrape();
