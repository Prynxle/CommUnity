import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// No AI: rule-based response generator
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Load knowledge base
let knowledgeBase = [];
try {
  const filePath = path.join(process.cwd(), 'data', 'knowledge_base.json');
  const data = fs.readFileSync(filePath, 'utf8');
  knowledgeBase = JSON.parse(data).documents || [];
} catch (error) {
  console.warn('Could not load knowledge base:', error.message);
}

/**
 * Simple retrieval: Find relevant documents using keyword matching
 */
function retrieveRelevantDocs(query, maxResults = 3) {
  // Split query into meaningful tokens (remove small words)
  const tokens = query
    .toLowerCase()
    .split(/\W+/)
    .filter((t) => t.length > 2);

  const scored = knowledgeBase
    .map((doc) => {
      const title = doc.title.toLowerCase();
      const content = doc.content.toLowerCase();

      let score = 0;
      for (const token of tokens) {
        const regex = new RegExp(`\\b${token}\\b`, "i");
        if (regex.test(title)) score += 3;
        if (regex.test(content)) score += 1;

        // Fallback: partial match (e.g., "report" in "reporting")
        if (title.includes(token)) score += 1;
        if (content.includes(token)) score += 0.5;
      }

      return { ...doc, score };
    })
    .filter((doc) => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

  return scored;
}

/**
 * Strict content filtering
 */
function filterResponse(response) {
  // Block inappropriate content
  const blockedPatterns = [
    /\b(hack|exploit|illegal|drugs?|alcohol|weapon)/i,
    /\b(violence|threat|harass)/i,
    /\b(personal|private|contact|phone|address)/i, // Block sharing personal info
  ];

  for (const pattern of blockedPatterns) {
    if (pattern.test(response)) {
      return "I'm sorry, but I can only provide information related to school reports and emergency contacts. Please ask about campus services or reporting procedures.";
    }
  }

  // Ensure response is relevant to school context
  const schoolKeywords = ['report', 'emergency', 'campus', 'school', 'student', 'office', 'clinic', 'security'];
  const hasSchoolContext = schoolKeywords.some(keyword =>
    response.toLowerCase().includes(keyword)
  );

  if (!hasSchoolContext && response.length > 50) {
    return "I can help you with questions about submitting reports, tracking reports, emergency contacts, and school policies. What would you like to know?";
  }

  return response;
}

/**
 * Generate a safe local fallback response when AI is unavailable.
 */
function generateFallbackAnswer(userQuery) {
  const t = userQuery.toLowerCase();

  if (t.includes("emergency") || t.includes("security") || t.includes("clinic") || t.includes("nurse") || t.includes("hotline")) {
    return (
      "If this is urgent:\n" +
      "• Campus Security: 0949-673-3019\n" +
      "• Campus Clinic/Nurse: 0942-0055\n" +
      "• National Emergency: 161\n\n" +
      "If someone is in immediate danger, call 161 first."
    );
  }

  if (t.includes("submit") || (t.includes("report") && !t.includes("track"))) {
    return (
      "To submit a report:\n" +
      "1) Click “Create a Report”\n" +
      "2) Choose Category + Location\n" +
      "3) Describe what happened (include when/where)\n" +
      "4) Add evidence (optional)\n" +
      "5) Submit\n\n" +
      "Tip: Clear details help the right office respond faster."
    );
  }

  if (t.includes("track")) {
    return (
      "To track your report:\n" +
      "1) Go to the “Track” page\n" +
      "2) Enter your reference/ID\n" +
      "3) View status updates and actions\n\n" +
      "If you don’t have your ID, check your confirmation message/email."
    );
  }

  if (t.includes("anonymous")) {
    return (
      "If anonymous reporting is enabled by your school, you’ll see an “Anonymous” option when submitting.\n" +
      "If it’s not visible, it may be disabled by the admin."
    );
  }

  if (t.includes("details") || t.includes("include")) {
    return (
      "Include:\n" +
      "• What happened\n" +
      "• Date/time (approx. is okay)\n" +
      "• Location (floor/room/area)\n" +
      "• Who was involved (if known)\n" +
      "• Evidence (optional)\n\n" +
      "Avoid posting sensitive info publicly—use the report form instead."
    );
  }

  if (t.includes("who sees") || t.includes("privacy") || t.includes("confidential")) {
    return (
      "Reports are typically visible only to authorized school personnel (e.g., guidance/admin/security) depending on category.\n" +
      "If your school supports anonymous reports, your identity won’t be shown to reviewers."
    );
  }

  return (
    "I’m here to help with school reports, emergency contacts, and campus policies. " +
    "Try asking something like: \"How do I submit a report?\" or \"Who do I contact in an emergency?\""
  );
}

/**
 * Generate RAG response using the Generative AI API (or fall back to local rules).
 */
export async function generateRAGResponse(userQuery) {
  try {
    // Retrieve relevant documents
    const relevantDocs = retrieveRelevantDocs(userQuery);

    if (relevantDocs.length === 0) {
      return {
        text: generateFallbackAnswer(userQuery),
        sources: []
      };
    }

    // Prepare context for the model
    const context = relevantDocs
      .map((doc) => `Title: ${doc.title}\nContent: ${doc.content}`)
      .join('\n\n');

    const prompt = `
You are a helpful school virtual assistant for OLOPSC (school reporting system).

Use ONLY the provided context information to answer the user's question. Do not add external knowledge or make assumptions.

Context:
${context}

User Question: ${userQuery}

Instructions:
- Answer based ONLY on the provided context
- Be helpful, clear, and concise
- If the question cannot be answered from the context, say so politely
- Keep responses school-appropriate and professional
- For emergencies, always prioritize calling emergency numbers

Answer:`;

    if (!genAI) {
      return {
        text: generateFallbackAnswer(userQuery),
        sources: relevantDocs.map((doc) => ({ id: doc.id, title: doc.title })),
      };
    }

    const model = genAI.getGenerativeModel({
      // Use a supported model (text-bison is generally available in the Google Generative AI API).
      // Update this if you have access to a different model such as gemini-1.5.
      model: 'text-bison-001',
      generationConfig: {
        temperature: 0.3, // Low temperature for consistent, factual responses
        maxOutputTokens: 200,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
      ],
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text();

    // Apply strict filtering
    text = filterResponse(text);

    // If the model output was blocked by safety or is not school-related, fall back.
    if (text.includes('I can help you with questions about submitting reports') || text.includes('I’m sorry, but I can only provide information')) {
      return {
        text: generateFallbackAnswer(userQuery),
        sources: relevantDocs.map((doc) => ({ id: doc.id, title: doc.title })),
      };
    }

    return {
      text,
      sources: relevantDocs.map((doc) => ({ id: doc.id, title: doc.title })),
    };

  } catch (error) {
    console.error('RAG generation error:', error);
    return {
      text: generateFallbackAnswer(userQuery),
      sources: [],
    };
  }
}

/**
 * Update knowledge base (for admin use)
 */
export function updateKnowledgeBase(newDocuments) {
  knowledgeBase = newDocuments;
}

/**
 * Get all documents (for admin management)
 */
export function getKnowledgeBase() {
  return knowledgeBase;
}
