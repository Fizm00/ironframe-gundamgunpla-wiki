const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://admin:admin123@ac-bxilvbz-shard-00-01.tfbfthr.mongodb.net/gundam-wiki?retryWrites=true&w=majority')
    .then(async () => {
        const factions = await mongoose.connection.collection('factions').find({}).toArray();
        console.log(`Total Factions in DB: ${factions.length}`);
        
        factions.forEach(f => {
            console.log(`[${f.activeEra}] ${f.name} | URL: ${f.url ? 'YES' : 'NO'}`);
        });
        
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
