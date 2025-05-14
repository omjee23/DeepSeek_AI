import OpenAI from "openai";
import axios from 'axios'
import {prompt} from '../model/prompt.model.js'

export const sendPrompt = async(req,res)=>{
    const {content} = req.body;
    if(!content || content.trim() === ""){
        return res.status(400).json({error: 'Prompt Content is required'});
    }
    try {
        const userPrompt = await prompt.create({role:'user',content}) // save prompt  in data base 
         
        console.log("data saved to data base",userPrompt);
        
        // sent to openAi

        const completion = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'openai/gpt-3.5-turbo',
                messages: [{ role: "user", content }]
            },
              {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_ApiKey}`,
                    'HTTP-Referer': process.env.PORT, 
                    'X-Title': 'DeepSeek_AI_App'
                }
            }
        )
        console.log(completion.data, "completion data is coming...............");
        
         const aiContent = completion.data.choices[0].message.content
         console.log(aiContent); // log in console 
         
         // save to data base 
         const aiResponse = await prompt.create({role:'assistant', content: aiContent})
        return res.status(201).json({reply:aiContent})

        console.log('saving response in db', aiResponse);
        
    } catch (error) {
        console.log(error, "error in prompt");
        return res.status(500).json({error: 'Something went wrong with AI response !'});   
    }
    
}

