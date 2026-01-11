
import axios from 'axios';

const run = async () => {
    try {
        const list = await axios.get('http://localhost:5000/api/lore?search=RX-78-2');
        const suit = list.data.mobileSuits.find((s: any) => s.name === 'RX-78-2 Gundam');

        if (suit) {
            const detail = await axios.get(`http://localhost:5000/api/lore/${suit._id}`);
            console.log('Name:', detail.data.name);
            console.log('Armaments:', JSON.stringify(detail.data.armaments, null, 2));
        } else {
            console.log('RX-78-2 NOT FOUND in search results');
            console.log('Found:', list.data.items.map((s: any) => s.name));
        }

    } catch (error) {
        console.error(error);
    }
};

run();
