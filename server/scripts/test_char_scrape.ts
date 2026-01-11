import axios from 'axios';
import * as cheerio from 'cheerio';

const TARGET_URL = 'https://gundam.fandom.com/wiki/Amuro_Ray';

async function testScrape() {
    console.log(`Scraping ${TARGET_URL}...`);
    const { data: charHtml } = await axios.get(TARGET_URL);
    const $ = cheerio.load(charHtml);

    const extractSection = (regex: RegExp) => {
        let content = '';
        const $header = $('h2, h3').filter((_: number, el: any) => regex.test($(el).text()));
        if ($header.length) {
            console.log(`   Found Header matching ${regex}`);
            let next = $header.next();
            let loopCount = 0;
            // Scan until next header or end of content, safety break at 50 elements
            while (next.length && !['h2', 'h3'].includes((next.prop('tagName') || '').toLowerCase()) && loopCount < 50) {
                if (next.is('p')) content += next.text().trim() + '\n\n';
                if (next.is('ul')) {
                    next.find('li').each((_: number, li: any) => {
                        content += '• ' + $(li).text().trim() + '\n';
                    });
                    content += '\n';
                }
                next = next.next();
                loopCount++;
            }
        } else {
            console.log(`   X Header matching ${regex} NOT FOUND`);
        }
        return content.trim();
    };

    const personality = extractSection(/Personality|Character/i);
    const skills = extractSection(/Skills|Abilities|Capabilities/i);
    const notes = extractSection(/Notes|Trivia|Novelization/i);

    const intro = $('#mw-content-text > .mw-parser-output > p').not('.aside').first().text().trim() || $('#mw-content-text p').first().text().trim();

    console.log('\n--- INTRO ---');
    console.log(intro.substring(0, 200) + '...');

    console.log('\n--- PERSONALITY ---');
    console.log(personality.substring(0, 200) + '...');

    console.log('\n--- SKILLS ---');
    console.log(skills.substring(0, 200) + '...');

    console.log('\n--- NOTES ---');
    console.log(notes.substring(0, 200) + '...');
}

testScrape();
