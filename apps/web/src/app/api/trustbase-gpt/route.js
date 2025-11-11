import { auth } from "@/auth";
// /api/trustbase-gpt/route.js

export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    // Predefined demo responses
    const predefinedResponses = {
      hi: "Hello! I'm TrustBase GPT, your friendly assistant for understanding data transparency in Nigeria. How can I help you today?",
      hello:
        "Hello! I'm TrustBase GPT, your friendly assistant for understanding data transparency in Nigeria. How can I help you today?",
      "what is data privacy":
        "Data privacy refers to the proper handling, processing, storage, and usage of personal information. In Nigeria, it means ensuring that organizations collect and use your personal data only with your consent and for legitimate purposes.",
      "what is trustbase":
        "TrustBase is a platform that promotes data transparency for Nigerian citizens. We help you understand which organizations have access to your personal data, why they need it, and give you control over granting or revoking that access.",
      default:
        "I'm here to help you understand data transparency and privacy rights in Nigeria. Ask me about data protection laws, your privacy rights, or how to protect your personal information.",
    };

    const lowerMessage = message.toLowerCase().trim();
    let response = predefinedResponses[lowerMessage];

    // Partial match fallback
    if (!response) {
      const keywords = Object.keys(predefinedResponses);
      const matchedKeyword = keywords.find(
        (keyword) => lowerMessage.includes(keyword) && keyword !== "default"
      );
      response = matchedKeyword
        ? predefinedResponses[matchedKeyword]
        : predefinedResponses.default;
    }

    // Simulate typing delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 1500)
    );

    // **Important:** return key must be 'response' to match frontend
    return Response.json({
      response: response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Demo TrustBase GPT API error:", error);
    return Response.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}


