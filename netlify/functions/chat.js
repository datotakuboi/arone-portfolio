const { GoogleGenerativeAI } = require("@google/generative-ai");

const portfolioProfile = {
  name: "Arone Christian V. Titong",
  title: "AI Software Developer",
  summary:
    "AI Software Developer building intelligent solutions with Next.js, Python, and React. Specializes in AI agents, machine learning, and full-stack development.",
  location: "Cebu City, Philippines",
  workPreference: "Available for remote work",
  contact: {
    email: "aronetitong@gmail.com",
    phone: "+63 997 682 8086",
    linkedin: "https://www.linkedin.com/in/arone-christian-titong-2a12aa307",
    github: "https://github.com/datotakuboi",
  },
  experience: [
    {
      role: "AI Software Developer",
      company: "Outrank Strategy",
      period: "April 2025 - Present",
      location: "Centerville, UT · Remote",
      highlights: [
        "Developed the SimplaBots web platform, a suite of agentic AI assistants for businesses",
        "Built responsive, high-performance UIs using Next.js, TypeScript, and Tailwind CSS",
        "Implemented whitelabel configuration features for branded AI agents",
        "Integrated OpenAI, Claude, and Gemini with Pinecone vector search",
        "Collaborated on real-time analytics powered by AWS SQS and SES",
      ],
    },
    {
      role: "Data Scientist Intern",
      company: "Connext",
      period: "July 2024 - August 2024",
      location: "Pampanga, Philippines · Remote",
      highlights: [
        "Architected and deployed a company-wide chatbot using Streamlit and Python",
        "Implemented RAG and fine-tuned LLMs for technical documentation accuracy",
        "Performed web scraping and data extraction from complex website structures",
      ],
    },
  ],
  education: {
    degree: "Bachelor of Science in Computer Engineering",
    school: "Cebu Institute of Technology University",
    period: "July 2021 - May 2025",
  },
  skills: {
    languages: ["JavaScript", "TypeScript", "Python", "HTML", "CSS"],
    frontend: ["React", "Next.js", "Node.js", "Tailwind CSS"],
    backend: ["PostgreSQL", "SQL", "Prisma ORM", "Firebase", "AWS"],
    ai: [
      "AI Agents",
      "RAG",
      "LLM Fine-tuning",
      "Pinecone",
      "OpenAI",
      "Claude",
      "Gemini",
      "Vector Search",
    ],
    tools: ["Make", "Flowise", "n8n", "Zapier", "Cursor", "Windsurf"],
  },
  projects: [
    {
      name: "SimplaBots Platform",
      year: "2025",
      description:
        "A suite of agentic AI assistants for businesses with whitelabel capabilities, real-time analytics, and multi-AI integration.",
      stack: ["Next.js", "TypeScript", "PostgreSQL", "OpenAI", "AWS"],
      url: "https://simplabots.com/",
    },
    {
      name: "Marci Metzger Website",
      year: "2025",
      description:
        "Modern single-page website redesign with responsive design, smooth animations, and professional typography.",
      stack: ["HTML", "CSS", "JavaScript"],
      url: "https://magenta-stroopwafel-2e14c2.netlify.app/",
    },
    {
      name: "AI Chatbot with Gemini",
      year: "2025",
      description:
        "Streamlit-based AI chatbot with Google Gemini-Flash integration, user authentication, and chat history management.",
      stack: ["Python", "Streamlit", "Firebase", "Gemini"],
      url: "https://ai-chatbot-vkuzpra8bb6qgbqdyseutu.streamlit.app/",
    },
    {
      name: "Compliance Website",
      year: "2025",
      description:
        "Comprehensive compliance management web application for regulatory processes and organizational standards adherence.",
      stack: ["React", "Node.js", "Database"],
      url: "https://phcompliance.netlify.app/",
    },
    {
      name: "Carabao Mango Sensor",
      year: "2025",
      description:
        "IoT-based environmental monitoring system for carabao mango cultivation with real-time data visualization and analytics.",
      stack: ["IoT", "Dashboard", "Real-time Analytics"],
      url: "mango-dashboard.html",
    },
  ],
};

const systemPrompt = `You are the portfolio assistant for Arone Christian V. Titong.

Answer questions using only the portfolio data provided to you.
Do not use outside knowledge, do not guess, and do not invent people, companies, dates, or projects.
If the answer is not in the portfolio data, say that the portfolio does not specify it.
When asked who Arone is, answer with Arone Christian V. Titong's role, experience, and specialties from the portfolio.
Keep responses concise, helpful, and professional. Prefer plain text over markdown.`;

function buildPrompt(message, conversationHistory) {
  const transcript = Array.isArray(conversationHistory)
    ? conversationHistory
        .slice(-8)
        .map((entry) => `${entry.role === "assistant" ? "Assistant" : "Visitor"}: ${entry.content}`)
        .join("\n")
    : "";

  return `${systemPrompt}

Portfolio data:
${JSON.stringify(portfolioProfile, null, 2)}

Conversation so far:
${transcript || "No prior conversation."}

Latest visitor message:
${message}

Answer based only on the portfolio data above.`;
}

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
    const prompt = buildPrompt(message, conversationHistory);

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 400,
        temperature: 0.3,
      },
    });
    const response = await result.response;
    const text = response.text().trim();

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
