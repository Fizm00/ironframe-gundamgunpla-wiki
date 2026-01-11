const axios = require('axios');
const cheerio = require('cheerio');

const URL = 'https://gundam.fandom.com/wiki/Karaba';

async function debug() {
    try {
        const { data } = await axios.get(URL);
        const $ = cheerio.load(data);

        console.log('--- SEARCHING FOR "Mobile Weapons" ---');
        
        // Check if it's in the infobox
        const infoboxContext = $('.portable-infobox').text();
        if (infoboxContext.includes('Mobile Weapons')) {
            console.log('FOUND IN INFOSBOX!');
            
            // Try to find the specific element structure
            $('.portable-infobox .pi-header').each((i, el) => {
                const text = $(el).text().trim();
                console.log(`Infobox Header: ${text}`);
                if (text.includes('Mobile Weapons') || text.includes('Vehicles')) {
                    console.log('  -> Found generic header match.');
                    // Log the NEXT sibling or content
                    const sibling = $(el).next();
                    console.log('  -> Next Element Class:', sibling.attr('class'));
                    console.log('  -> Next Element Content Preview:', sibling.text().substring(0, 100));
                }
            });

             // Check for data-source attributes that might match
             $('[data-source=" mobile weapons"]').each((i, el) => {
                 console.log('Found data-source="mobile weapons" explicitly!');
             });

        } else {
            console.log('NOT FOUND in portable-infobox text content.');
        }

        console.log('\n--- SEARCHING IN BODY HEADERS ---');
        $('h2, h3').each((i, el) => {
            const text = $(el).text().trim();
            if (text.includes('Mobile Weapons') || text.includes('Vehicles')) {
                console.log(`Headline Found: ${text}`);
            }
        });

    } catch (e) {
        console.error(e);
    }
}

debug();
