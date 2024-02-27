const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
const { ConversionRouter } = require('./router/conversionRoute');
require('dotenv').config();
const PORT = process.env.PORT || 8080;
const apiKey = process.env.OPENAI_API_KEY;

// const OpenAI = require('openai');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Home Page')
});

app.post("/convert", async (req, res) => {
    try {
        const { code, language } = req.body;

        const apiUrl = 'https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions';

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        };

        const requestData = {
            prompt: `Translate the following code ${code} into ${language}`,
            // `Convert the following ${language} code:\n\n${code}\n\nTo:\n\n`,
            max_tokens: 1000,
        };

        let attempts = 0;

        const response = await axios.post(apiUrl, requestData, { headers });
        // console.log(response.data, '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        const convertedCode = response.data.choices[0].text;
        res.status(200).send({ convertedCode });

    } catch (error) {
        console.error('Error converting code:', error);
        res.status(400).json({ error: 'Internal server error' });
    }
});

app.post('/debug', async (req, res) => {
    try {
        const { code } = req.body;

        // console.log(code);

        const apiUrl = 'https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions';

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        };

        const prompt = `I want you to act as a debuggr tool. Debug the following code:${code} and generate response. The response should contain errors if there any, provide suggestions for best code.`

        const requestData = {
            prompt,
            max_tokens: 1000,
            temperature: 0.7,
        };

        const response = await axios.post(apiUrl, requestData, { headers });
        const debugedCode = response.data.choices[0].text;
        const formattedDebugedCode = debugedCode.match(/.{1,50}/g).join('\n');

        // console.log(debugedCode);

        res.send({ debugedCode: formattedDebugedCode });
    } catch (error) {
        console.error('Error converting code:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/quality', async (req, res) => {
    try {
        const { code } = req.body;

        // console.log(code);

        const apiUrl = 'https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions';

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        };

        // const prompt = `Check the quality of this code ${code}`

        const requestData = {
            prompt: `Do the deep quality assesment and give a brief description about the code ${code} and check if it adhere to the standard coding practices or not, and also give a brief about the concepts used in the code`,
            max_tokens: 1000,
            temperature: 0.7,
        };

        const response = await axios.post(apiUrl, requestData, { headers });
        const debugedCode = response.data.choices[0].text;
        const formattedDebugedCode = debugedCode.match(/.{1,50}/g).join('\n');

        // console.log(debugedCode);

        res.send({ codeQuality: formattedDebugedCode });
    } catch (error) {
        console.error('Error converting code:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    try {
        console.log(`Server running on port ${PORT}`);
    } catch (error) {
        console.log(error);
    }
});