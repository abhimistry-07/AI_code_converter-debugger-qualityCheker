const express = require('express');
const ConversionRouter = express.Router();
require('dotenv').config();
const apiKey = process.env.OPENAI_API_KEY;

ConversionRouter.post('/', async (req, res) => {
    try {
        const { code, language } = req.body;

        // console.log(code, language, ">>>>>>");

        const apiUrl = 'https://api.openai.com/v1/engines/text-davinci-002/completions';

        const headers = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        };

        const requestData = {
            prompt: `Convert the following ${language} code:\n\n${code}\n\nTo:\n\n`,
            max_tokens: 100,
        };

        axios.post(apiUrl, requestData, { headers })
            .then(response => {
                // Handle the API response here
                console.log(response.data);

                const convertedCode = response.data.choices[0].text;

                res.send({ convertedCode });

            })
            .catch(error => {
                // Handle errors here
                console.error("error");
            });

        // const response = await axios.post(apiUrl, requestData, { headers });

        // const convertedCode = response.data.choices[0].text;

        // res.send({ convertedCode });
    } catch (error) {
        console.error('Error converting code:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = { ConversionRouter }