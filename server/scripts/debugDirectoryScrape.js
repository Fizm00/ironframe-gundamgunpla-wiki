const axios = require('axios');
const cheerio = require('cheerio');

const TARGET_URL = 'https://gundam.fandom.com/wiki/Gundam_Wiki:Factions';
const BASE_URL = 'https://gundam.fandom.com';

async function run() {
    try {
        const { data } = await axios.get(TARGET_URL);
        const $ = cheerio.load(data);
        const factions = [];

        $('.mw-parser-output > h2').each((i, header) => {
            const eraName = $(header).find('.mw-headline').text().trim();
            if (!eraName || ['Contents', 'See Also', 'References'].some(s => eraName.includes(s))) return;
            console.log(`Scanning Era: ${eraName}`);

            let nextElement = $(header).next();
            while (nextElement.length && !nextElement.is('h2')) {
                if (nextElement.is('ul')) {
                    nextElement.children('li').each((j, li) => {
                        const $li = $(li);
                        const directLink = $li.find('a').first(); // Using find('a') as per fix
                        let name = directLink.length ? directLink.text().trim() : $li.text().split('\n')[0].trim();
                        const url = directLink.attr('href');
                        
                        // Clean name
                        name = name.replace(/^-\s*/, '').trim();

                        if (url) {
                            console.log(`  [FOUND] ${name} -> ${url}`);
                        } else {
                            console.log(`  [MISSING URL] ${name}`);
                             // Debug the HTML if missing
                             if (name.includes('Earth Federation') || name.includes('Titans') || name.includes('Zeon')) {
                                 console.log('    HTML:', $li.html().substring(0, 100));
                             }
                        }
                    });
                }
                nextElement = nextElement.next();
            }
        });

    } catch (e) {
        console.error(e);
    }
}

run();
