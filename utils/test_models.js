const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // There isn't a direct listModels on genAI instance in the node SDK easily exposed, 
    // but we can try to just run a simple text prompt on gemini-pro to see if it works.
    // Actually, let's try to use the model that definitely exists: gemini-pro
    console.log("Testing gemini-pro...");
    const proModel = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await proModel.generateContent("Hello");
    console.log("gemini-pro response:", result.response.text());

    console.log("Testing gemini-1.5-flash...");
    const flashModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const flashResult = await flashModel.generateContent("Hello");
    console.log("gemini-1.5-flash response:", flashResult.response.text());

  } catch (error) {
    console.error("Error:", error);
  }
}

listModels();
