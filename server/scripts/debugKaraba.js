const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://admin:admin123@ac-bxilvbz-shard-00-01.tfbfthr.mongodb.net/gundam-wiki?retryWrites=true&w=majority')
    .then(async () => {
        console.log('Checking Karaba...');
        let faction = await mongoose.connection.collection('factions').findOne({ name: 'Karaba' });
        if (faction) console.log(`Karaba MW: ${faction.mobileWeapons?.length || 0}`);
        else console.log('Karaba NOT FOUND');

        console.log('Checking Zeon...');
        faction = await mongoose.connection.collection('factions').findOne({ name: 'Principality of Zeon' });
        if (faction) console.log(`Zeon MW: ${faction.mobileWeapons?.length || 0}`);
        else console.log('Zeon NOT FOUND');

        console.log('Checking Anaheim...');
        faction = await mongoose.connection.collection('factions').findOne({ name: 'Anaheim Electronics' });
        if (faction) console.log(`Anaheim MW: ${faction.mobileWeapons?.length || 0}`);
        else console.log('Anaheim NOT FOUND');
        
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
