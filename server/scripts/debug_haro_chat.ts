import axios from 'axios';

async function testChat() {
    try {
        console.log("Testing POST /api/chat/ask...");
        const res = await axios.post('http://localhost:5000/api/chat/ask', {
            query: "menurutmu, kuat mana antara gundam mighty strike freedom dengan gundam unicorn"
        });
        console.log("Response:", res.data);
    } catch (error: any) {
        console.error("Error:", error.response?.data || error.message);
    }
}

testChat();
