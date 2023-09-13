const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
const { ConversionRouter } = require('./router/conversionRoute');
require('dotenv').config();
const PORT = process.env.PORT || 8080;
const apiKey = process.env.OPENAI_API_KEY;
const OpenAI = require('openai');

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Home Page')
});

// app.use('/convert', ConversionRouter);
const openai = new OpenAI({
    apiKey
});

async function generateCode(prompt) {
    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'gpt-3.5-turbo',
        });
        // console.log(completion.choices[0])
        return completion.choices[0].message.content
    } catch (error) {
        console.log(error);
    }
}


app.post('/convert', async (req, res) => {
    try {
        const { code, language } = req.body;

        const response = await generateCode(`Convert the given below code to ${language} \n code ${code}`);

        res.status(200).send({ response });
    } catch (error) {
        console.error('Error converting code:', error);
        res.status(400).json({ error: 'Internal server error' });
    }
});

app.post("/debug", async (req, res) => {
    try {
        const { code } = req.body;
        const response = await generateCode(`Debug the given below code with explaination : \n ${code}`);
        res.status(200).json({ response })
    } catch (error) {
        console.error("Error", error);
        res.status(400).json({ error: 'Internal server error' });
    }
});

app.post('/quality', async (req, res) => {
    try {
        const { code } = req.body;

        const response = await generateCode(`I want you to act as a debuggr tool. Debug the following code:${code} and generate response. The response should contain errors if there any, provide suggestions for best code.`)

        const formattedDebugedCode = response.match(/.{1,50}/g).join('\n');

        res.status(200).send({ response: formattedDebugedCode });
    } catch (error) {
        console.error('Error converting code:', error);
        res.status(400).json({ error: 'Internal server error' });
    }
});

// app.post('/convert', async (req, res) => {
//     try {
//         const { code, language } = req.body;

//         const apiUrl = 'https://api.openai.com/v1/engines/text-davinci-002/completions';

//         const headers = {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${apiKey}`,
//         };

//         const requestData = {
//             prompt: `Convert the following ${language} code:\n\n${code}\n\nTo:\n\n`,
//             max_tokens: 100,
//         };

//         const response = await axios.post(apiUrl, requestData, { headers });

//         const convertedCode = response.data.choices[0].text;

//         res.status(200).send({ convertedCode });
//     } catch (error) {
//         console.error('Error converting code:', error);
//         res.status(400).json({ error: 'Internal server error' });
//     }
// });

// app.post('/debug', async (req, res) => {
//     try {
//         const { code } = req.body;

//         // console.log(code);

//         const apiUrl = 'https://api.openai.com/v1/engines/text-davinci-002/completions';

//         const headers = {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${apiKey}`,
//         };

//         const prompt = `I want you to act as a debuggr tool. Debug the following code:${code} and generate response. The response should contain errors if there any, provide suggestions for best code.`

//         const requestData = {
//             prompt,
//             max_tokens: 100,
//             temperature: 0.7,
//         };

//         const response = await axios.post(apiUrl, requestData, { headers });
//         const debugedCode = response.data.choices[0].text;
//         const formattedDebugedCode = debugedCode.match(/.{1,50}/g).join('\n');

//         // console.log(debugedCode);

//         res.send({ debugedCode: formattedDebugedCode });
//     } catch (error) {
//         console.error('Error converting code:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// app.post('/quality', async (req, res) => {
//     try {
//         const { code } = req.body;

//         // console.log(code);

//         const apiUrl = 'https://api.openai.com/v1/engines/text-davinci-002/completions';

//         const headers = {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${apiKey}`,
//         };

//         const prompt = `Check th equality of code ${code}`

//         const requestData = {
//             prompt,
//             max_tokens: 100,
//             temperature: 0.7,
//         };

//         const response = await axios.post(apiUrl, requestData, { headers });
//         const debugedCode = response.data.choices[0].text;
//         const formattedDebugedCode = debugedCode.match(/.{1,50}/g).join('\n');

//         // console.log(debugedCode);

//         res.send({ debugedCode: formattedDebugedCode });
//     } catch (error) {
//         console.error('Error converting code:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

app.listen(PORT, () => {
    try {
        console.log(`Server running on port ${PORT}`);
    } catch (error) {
        console.log(error);
    }
});