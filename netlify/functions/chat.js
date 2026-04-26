const { GoogleGenerativeAI } = require("@google/generative-ai");

const systemPrompt = `You are an AI assistant representing Arone Christian V. Titong, an AI Software Developer. 
Your role is to help visitors learn about Arone's experience, skills, and projects.

Key information about Arone:
- AI Software Developer at Outrank Strategy (Current)
- 2+ years of experience in full-stack development
- Skills: Next.js, React, TypeScript, Python, PostgreSQL, AWS, OpenAI/Claude/Gemini integration
- Specializes in AI agents, machine learning, and full-stack development
- Recent work: SimplaBots Platform (AI assistants for businesses)
- Based in Cebu City, Philippines (Remote)

Be friendly, professional, and helpful. Answer questions about:
- Projects and experience
- Technical skills and technologies
- Collaboration opportunities
- How to get in touch

Keep responses concise and engaging. Encourage visitors to explore the portfolio or reach out via email.`;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Missing GEMINI_API_KEY environment variable",
        }),
      };
    }

    const { message, conversationHistory } = JSON.parse(event.body);

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Message is required" }),
      };
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Build conversation history
    let history = [];
    if (conversationHistory && Array.isArray(conversationHistory)) {
      history = conversationHistory.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));
    }

    // Start or continue chat session
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });

    const prompt = history.length === 0
      ? `${systemPrompt}\n\nUser message: ${message}`
      : message;

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reply: text,
        success: true,
      }),
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Failed to process message",
        details: error.message,
      }),
    };
  }
};
