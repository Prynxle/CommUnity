import fs from 'fs'
import path from 'path'
import { getReportById, getReportTimeline } from './reports'

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
 * Simple retrieval: Find relevant documents using keyword matching + light scoring.
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
 * Normalize text for matching.
 */
function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[\u2019']/g, "'")
    .replace(/[^\p{L}\p{N}\s-]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenize(text) {
  const t = normalize(text)
  if (!t) return []
  const stop = new Set([
    'a','an','the','and','or','but','to','of','in','on','at','for','from','with','without',
    'is','are','was','were','be','been','being','do','does','did','can','could','should','would',
    'i','me','my','we','our','you','your','they','them','their','this','that','these','those',
    'please','help','hi','hello','hey','thanks','thank'
  ])
  return t.split(' ').filter((w) => w.length >= 2 && !stop.has(w))
}

function includesAny(haystack, needles) {
  for (const n of needles) {
    if (!n) continue
    if (haystack.includes(n)) return true
  }
  return false
}

function extractReportId(text) {
  const raw = String(text || '')
  // UUID v4-like (your report ids are UUIDs)
  const m = raw.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)
  return m ? m[0] : null
}

function formatDateTime(value) {
  if (!value) return null
  try {
    return new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return String(value)
  }
}

/**
 * Strict content filtering (UI-safe).
 */
function filterResponse(response) {
  const text = String(response || '')

  // Allow listing *official* campus / emergency hotlines (these will contain phone numbers).
  // We only want to block doxxing / private contact info about individuals.
  const looksLikeOfficialHotline =
    /\b(campus|security|clinic|nurse|hotline|emergency|national emergency)\b/i.test(text)

  // Block inappropriate content (UI-safe)
  const blockedPatterns = [
    /\b(hack|exploit|illegal|drugs?|alcohol|weapon)/i,
    /\b(violence|threat|harass)\b/i,
  ]

  for (const pattern of blockedPatterns) {
    if (pattern.test(text)) {
      return "I can help with campus reporting, tracking, and official emergency contacts. What would you like to know?"
    }
  }

  // Block sharing *personal* contact info (but allow official hotlines).
  // Heuristic: only trigger when response looks like it contains private identifiers,
  // and it's not clearly an official hotline listing.
  const privateInfoPatterns = [
    /\b(home\s*address|residential\s*address)\b/i,
    /\b(ssn|social security)\b/i,
    /\b(passport|driver'?s\s*license)\b/i,
    /\b(bank|credit\s*card|debit\s*card)\b/i,
    /\b(my|his|her|their)\s+(phone|number|address|email)\b/i,
    /\bemail\s*:\s*\S+@\S+\.\S+/i,
  ]
  const hasPrivateInfo = privateInfoPatterns.some((p) => p.test(text))
  if (hasPrivateInfo && !looksLikeOfficialHotline) {
    return "I can’t help share personal contact information. If this is related to a campus concern, I can help you submit a report or share official campus office contacts."
  }

  // Ensure response is relevant to school context
  const schoolKeywords = ['report', 'emergency', 'campus', 'school', 'student', 'office', 'clinic', 'security'];
  const hasSchoolContext = schoolKeywords.some(keyword =>
    text.toLowerCase().includes(keyword)
  );

  if (!hasSchoolContext && text.length > 80) {
    return "I can help you with questions about submitting reports, tracking reports, emergency contacts, and school policies. What would you like to know?";
  }

  return text;
}

/**
 * Deterministic answer set (no external AI required).
 */
function generateFallbackAnswer(userQuery) {
  const t = normalize(userQuery);

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
 * Build a concise, deterministic response that feels “smart”:
 * - intent scoring (emergency / submit / track / anonymity / privacy / required details / etc.)
 * - optional report ID lookup for tracking (safe fields only)
 * - knowledge-base snippet fallback
 */
export async function generateAssistantResponse(userQuery) {
  try {
    const q = normalize(userQuery)
    const tokens = tokenize(q)
    const reportId = extractReportId(userQuery)

    // 1) Report tracking by ID (feels very “AI-like” because it’s actually doing work)
    if (reportId) {
      try {
        const report = await getReportById(reportId)
        if (!report) {
          return {
            text:
              `I couldn’t find a report for that Report ID.\n\n` +
              `Tips:\n` +
              `- Make sure you pasted the full ID (it looks like a UUID).\n` +
              `- If you submitted recently, wait a minute and try again.\n\n` +
              `You can also track it in the Track section by pasting the ID.`,
            sources: [],
          }
        }

        let timeline = []
        try {
          timeline = (await getReportTimeline(reportId)) ?? []
        } catch {
          timeline = []
        }
        const last = timeline.length ? timeline[timeline.length - 1] : null
        const lastUpdate = last?.changed_at || report.updated_at || report.created_at || null

        const safeAssigned =
          report.assigned_to === 'csa_admin'
            ? 'CSA / Guidance Office'
            : report.assigned_to === 'clinic_admin'
              ? 'Clinic / Health Office'
              : 'Assigned office'

        const safeLocation = [report.location_category, report.sub_location].filter(Boolean).join(' • ')

        const text =
          `Here’s the latest status for your report:\n\n` +
          `Report ID: ${report.report_id}\n` +
          `Status: ${report.status}\n` +
          `Assigned office: ${safeAssigned}\n` +
          `Category: ${report.category || '-'}\n` +
          `Location: ${safeLocation || '-'}\n` +
          `Submitted: ${formatDateTime(report.created_at) || '-'}\n` +
          `Last update: ${formatDateTime(lastUpdate) || 'Waiting for update'}\n\n` +
          `If you need to add details, submit a new report referencing this ID in the description (don’t post private info in chat).`

        return { text: filterResponse(text), sources: [] }
      } catch {
        // If DB/env isn’t configured, don’t crash the chat experience.
        return {
          text:
            `I found a Report ID in your message, but I can’t check the database right now.\n\n` +
            `You can still track it in the Track section using that ID. If it still doesn’t show, try again later.`,
          sources: [],
        }
      }
    }

    // 2) Intent scoring
    const intents = [
      {
        id: 'emergency',
        weight: 4,
        terms: ['emergency','urgent','danger','help now','security','guard','clinic','nurse','ambulance','hotline','fire','police','161'],
      },
      { id: 'submit', weight: 3, terms: ['submit','file','send','create','make a report','report an incident','report concern','reporting'] },
      { id: 'track', weight: 3, terms: ['track','status','update','follow up','reference id','report id','progress'] },
      { id: 'anonymous', weight: 3, terms: ['anonymous','anonymity','hide my name','privacy of identity'] },
      { id: 'what_to_include', weight: 2, terms: ['what details','what should i include','include','details','evidence','photo','screenshot','when','where'] },
      { id: 'who_sees', weight: 2, terms: ['who sees','who can see','confidential','privacy','data','visible to','access'] },
      { id: 'smalltalk', weight: 1, terms: ['hi','hello','hey','good morning','good afternoon','good evening','thanks','thank you'] },
    ]

    const scores = new Map()
    for (const intent of intents) scores.set(intent.id, 0)

    for (const intent of intents) {
      const hay = q
      for (const term of intent.terms) {
        const n = normalize(term)
        if (!n) continue
        if (hay.includes(n)) {
          scores.set(intent.id, (scores.get(intent.id) || 0) + intent.weight)
        }
      }
    }
    // token reinforcement
    if (includesAny(tokens.join(' '), ['track','status','progress'])) scores.set('track', (scores.get('track') || 0) + 1)
    if (includesAny(tokens.join(' '), ['submit','report','incident'])) scores.set('submit', (scores.get('submit') || 0) + 1)

    const ranked = Array.from(scores.entries()).sort((a, b) => b[1] - a[1])
    const top = ranked[0]?.[0] || null
    const topScore = ranked[0]?.[1] || 0

    let text = null

    if (topScore === 0) {
      // 3) Knowledge-base retrieval as a last structured fallback
      const relevantDocs = retrieveRelevantDocs(userQuery)
      if (relevantDocs.length) {
        const best = relevantDocs[0]
        text =
          `${best.title}\n\n` +
          `${String(best.content || '').trim()}\n\n` +
          `If you want, tell me whether you need help with (1) submitting a report, (2) tracking a report, or (3) emergency contacts.`
        return {
          text: filterResponse(text),
          sources: relevantDocs.map((doc) => ({ id: doc.id, title: doc.title })),
        }
      }
      return { text: generateFallbackAnswer(userQuery), sources: [] }
    }

    switch (top) {
      case 'emergency':
        text =
          `If this is an emergency, call 161 first.\n\n` +
          `Campus contacts (quick):\n` +
          `- Campus Security: 0949-673-3019\n` +
          `- Campus Clinic/Nurse: 0942-0055\n\n` +
          `If you’re safe now, you can also submit a report with details + evidence so the right office can respond.`
        break
      case 'submit':
        text =
          `To submit a report:\n` +
          `1) Open the Report Form (“Report an Incident or Concern”)\n` +
          `2) Select Category and Location (choose sub-location if shown)\n` +
          `3) Describe what happened (what/when/where)\n` +
          `4) Attach evidence (photo/screenshot)\n` +
          `5) Submit and save your Report ID\n\n` +
          `If you paste what category + location you’re unsure about, I can guide you to the right one.`
        break
      case 'track':
        text =
          `To track your report:\n` +
          `1) Go to the Track your Reports section\n` +
          `2) Paste your *Report ID\n` +
          `3) You’ll see the assigned office and current status\n\n` +
          `If you paste your Report ID here, I can also summarize the latest status in chat.`
        break
      case 'anonymous':
        text =
          `You can leave the “Your name (optional)” field blank—your report will be stored with a neutral name (e.g., Anonymous).\n\n` +
          `Your contact email is still required so you can receive your Report ID and updates. Only authorized offices should access your report.`
        break
      case 'who_sees':
        text =
          `Only authorized school personnel should see reports, based on the assigned office:\n` +
          `- CSA / Guidance Office: student welfare, harassment, peer conflict\n` +
          `- Clinic / Health Office: trauma, medical, treatment-related cases\n\n` +
          `If you want, tell me the category you selected and I’ll confirm which office receives it.`
        break
      case 'what_to_include':
        text =
          `Good reports include:\n` +
          `- What happened (clear summary)\n` +
          `- When it happened (date/time or approximate)\n` +
          `- Where (floor/room/area)\n` +
          `- Who was involved (if known)\n` +
          `- Evidence (photo/screenshot) which is required\n\n` +
          `Tip: Avoid posting sensitive personal info in chat—put it in the report form instead.`
        break
      case 'smalltalk':
      default:
        text =
          `Hi! I can help with:\n` +
          `- Emergency contacts\n` +
          `- How to submit a report\n` +
          `- How to track a report\n\n` +
          `What do you need right now?`
        break
    }

    return { text: filterResponse(text), sources: [] }
  } catch (error) {
    console.error('Assistant generation error:', error)
    return { text: generateFallbackAnswer(userQuery), sources: [] }
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

// Back-compat export (older imports)
export const generateRAGResponse = generateAssistantResponse
