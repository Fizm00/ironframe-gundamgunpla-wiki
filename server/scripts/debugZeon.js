const mongoose = require('mongoose');

// Connect to DB
mongoose.connect('mongodb+srv://admin:admin123@ac-bxilvbz-shard-00-01.tfbfthr.mongodb.net/gundam-wiki?retryWrites=true&w=majority')
    .then(async () => {
        const faction = await mongoose.connection.collection('factions').findOne({ name: 'Principality of Zeon' });
        if (faction) {
           console.log('Mobile Weapons Check for Zeon:', faction.mobileWeapons ? faction.mobileWeapons.length : 'NULL');
           if (faction.mobileWeapons) console.log(JSON.stringify(faction.mobileWeapons.slice(0, 5), null, 2));
        } else {
           console.log('Zeon not found yet.');
        }
        process.exit(0);
    })
    .catch(err => {
        console.error('DB Error:', err);
        process.exit(1);
    });
