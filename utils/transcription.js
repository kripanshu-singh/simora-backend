const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

async function transcribeVideo(filePath) {
    try {
        // 1. Upload the file to Gemini
        const uploadResponse = await fileManager.uploadFile(filePath, {
            mimeType: "video/mp4",
            displayName: "Video for transcription",
        });

        console.log(`Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`);

        // 2. Wait for the file to be active
        let file = await fileManager.getFile(uploadResponse.file.name);
        while (file.state === "PROCESSING") {
            process.stdout.write(".");
            await new Promise((resolve) => setTimeout(resolve, 2000));
            file = await fileManager.getFile(uploadResponse.file.name);
        }

        if (file.state === "FAILED") {
            throw new Error("Video processing failed.");
        }

        console.log(`\nFile ${file.displayName} is ready: ${file.uri}`);

        // 3. Generate content (transcription)
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        const prompt = `
            Transcribe the audio from this video into captions.
            Return a JSON array where each object has:
            - "start": start time in seconds (number)
            - "end": end time in seconds (number)
            - "text": the spoken text (string)
            
            Ensure the captions are accurate and handle Hinglish (Hindi + English) correctly.
            Do not include any markdown formatting like \`\`\`json or \`\`\`. Just return the raw JSON.
        `;

        const result = await model.generateContent([
            {
                fileData: {
                    mimeType: file.mimeType,
                    fileUri: file.uri
                }
            },
            { text: prompt }
        ]);

        const responseText = result.response.text();
        console.log("Raw response:", responseText);

        // Clean up the response text if it contains markdown code blocks
        let cleanText = responseText.trim();
        if (cleanText.startsWith('```json')) {
            cleanText = cleanText.replace(/^```json/, '').replace(/```$/, '');
        } else if (cleanText.startsWith('```')) {
            cleanText = cleanText.replace(/^```/, '').replace(/```$/, '');
        }

        return JSON.parse(cleanText);

    } catch (error) {
        console.error("Error in transcribeVideo:", error);
        throw error;
    }
}

module.exports = { transcribeVideo };
