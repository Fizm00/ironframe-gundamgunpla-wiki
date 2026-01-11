
import axios from 'axios';
import * as cheerio from 'cheerio';

const run = async () => {
    try {
        console.log("Fetching HTML...");
        const { data } = await await axios.get('https://mechabay.com/rx-78-2-gundam/');
        const $ = cheerio.load(data);

        console.log("Searching for ALL 'Armaments' h3 tags...");
        $('h3').each((i, el) => {
            const text = $(el).text().trim().toLowerCase();
            if (text === 'armaments') {
                console.log(`\nMatch #${i}:`);
                console.log("Parent:", $(el).parent().prop('tagName'));
                const nextTag = $(el).next().prop('tagName');
                console.log("Next Sibling:", nextTag);
                if (nextTag === 'DL' || nextTag === 'UL') {
                    console.log("Likely SIDEBAR match!");
                    console.log("HTML:", $(el).next().html()?.substring(0, 100));
                } else if (!nextTag) {
                    // Maybe next is text node?
                    console.log("Next is potentially text node or empty.");
                }
            }
        });

        // Test logic
        console.log("Testing Logic:");

        // Case 2 Logic
        const h3 = $('h3').filter((_, el) => $(el).text().trim().toLowerCase() === 'armaments').first(); // Re-add h3 for subsequent logic
        const nextUl = h3.nextAll('ul').first();
        console.log("Next UL found?", nextUl.length > 0);
        if (nextUl.length) {
            console.log("Next UL HTML structure:", nextUl.html()?.substring(0, 100));
            const dist = h3.nextUntil('ul').length;
            console.log("Distance (elements between):", dist);
        }

        // Reverse Search
        console.log("Searching for text 'vulcan gun'...");
        const validText = $('*').contents().filter((_, el) => el.type === 'text' && $(el).text().includes('vulcan gun')).first();

        if (validText.length) {
            console.log("Text Found:", validText.text().trim());
            const parent = validText.parent();
            console.log("Parent Tag:", parent.prop('tagName'));
            console.log("Grandparent Tag:", parent.parent().prop('tagName'));
            console.log("Great-Grandparent Tag:", parent.parent().parent().prop('tagName'));

            // Relation to Armaments H3
            const prevH3 = parent.closest('div').prevAll('h3').first(); // naive check
            console.log("Closest previous H3:", prevH3.text());
        } else {
            console.log("Text 'vulcan gun' NOT FOUND");
        }

    } catch (error) {
        console.error(error);
    }
};

run();
