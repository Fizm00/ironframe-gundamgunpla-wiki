const mongoose = require('mongoose');

// Connect to DB
mongoose.connect('mongodb+srv://admin:admin123@ac-bxilvbz-shard-00-01.tfbfthr.mongodb.net/gundam-wiki?retryWrites=true&w=majority')
    .then(async () => {
        console.log('Connected to DB');
        const factions = await mongoose.connection.collection('factions').find({}, { projection: { name: 1, activeEra: 1 } }).toArray();
        console.log('Total Factions:', factions.length);
        console.log('Factions List:', JSON.stringify(factions.reduce((acc, f) => {
            acc[f.activeEra] = acc[f.activeEra] || [];
            acc[f.activeEra].push(f.name);
            return acc;
        }, {}), null, 2));
        process.exit(0);
    })
    .catch(err => {
        console.error('DB Error:', err);
        process.exit(1);
    });
