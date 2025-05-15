import axios from 'axios';
import { prompt } from '../model/prompt.model.js';

export const sendPrompt = async (req, res) => {
    const { content } = req.body;
    const userId = req.userId

    if (!content || content.trim() === "") {
        return res.status(400).json({ error: 'Prompt content is required' });
    }

    try {
        // Save user prompt to DB
        const userPrompt = await prompt.create({ userId, role: 'user', content });
        console.log("User prompt saved:", userPrompt);

        // Send to OpenAI via OpenRouter
        const completion = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'openai/gpt-3.5-turbo',
                messages: [{ role: "user", content }]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_ApiKey}`,
                    'HTTP-Referer': process.env.BASE_URL || 'http://localhost:3000',
                    'X-Title': 'DeepSeek_AI_App'
                }
            }
        );

        const aiContent = completion?.data?.choices?.[0]?.message?.content;

        if (!aiContent) {
            return res.status(500).json({ error: 'AI did not return a valid response' });
        }

        console.log("AI response:", aiContent);

        // Save assistant response to DB
        const aiResponse = await prompt.create({ userId , role: 'assistant', content: aiContent });
        console.log("AI response saved:", aiResponse);

        // Respond to frontend
        return res.status(201).json({ reply: aiContent });

    } catch (error) {
        console.error("Error in sendPrompt:", error.message || error);
        return res.status(500).json({ error: 'Something went wrong while communicating with AI!' });
    }
};
