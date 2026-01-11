console.log('Script started. Requiring modules...');
try {
    const fs = require('fs');
    const axios = require('axios');
    const cheerio = require('cheerio');
    console.log('Modules loaded.');

    const LIST_URL = 'https://mechabay.com/universal-century-mecha';

    async function testScrape() {
        try {
            console.log(`Fetching ${LIST_URL}...`);
            const { data } = await axios.get(LIST_URL, {
                timeout: 15000,
                headers: { 
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
                }
            });
            console.log(`Fetched ${data.length} bytes.`);
            
            fs.writeFileSync('debug_output.html', data);
            console.log('Saved HTML to debug_output.html');

            const $ = cheerio.load(data);
            const h2s = $('h2');
            console.log(`Found ${h2s.length} H2 tags.`);
            
        } catch (err) {
            console.error('Error during scrape:', err.message);
            if (err.response) {
                console.error('Status:', err.response.status);
            }
        }
    }

    testScrape();

} catch (e) {
    console.error('Top level error:', e.message);
}
