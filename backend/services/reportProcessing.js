/**
 * Rule-Based Multi-Stage Report Processing Algorithm
 *
 * Phase 1: Data integrity (required fields, sanitize, store)
 * Phase 2: Priority scoring (category → score → CRITICAL/HIGH/NORMAL)
 * Phase 3: Admin routing (category → csa_admin | clinic_admin)
 * Phase 4: State transition model (SUBMITTED → IN_PROGRESS → RESOLVED → CLOSED)
 * Phase 5: Timeline logging on status change
 */

// --- Phase 4: State constants (deterministic, testable)
export const REPORT_STATUS = {
  SUBMITTED: 'SUBMITTED',       // S0
  IN_PROGRESS: 'IN_PROGRESS',   // S1
  RESOLVED: 'RESOLVED',         // S2
  CLOSED: 'CLOSED',             // S3
}

export const PRIORITY_LEVEL = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  NORMAL: 'NORMAL',
}

export const ASSIGNED_TO = {
  CSA_ADMIN: 'csa_admin',
  CLINIC_ADMIN: 'clinic_admin',
}

// Valid transitions: from -> [to]
const VALID_TRANSITIONS = {
  [REPORT_STATUS.SUBMITTED]: [REPORT_STATUS.IN_PROGRESS],
  [REPORT_STATUS.IN_PROGRESS]: [REPORT_STATUS.RESOLVED],
  [REPORT_STATUS.RESOLVED]: [REPORT_STATUS.CLOSED],
  [REPORT_STATUS.CLOSED]: [], // terminal
}

const REQUIRED_FIELDS = [
  'category',
  'locationCategory',
  'description',
  'email',
  'photo_url',
]

/**
 * Phase 1: Check required fields. Returns error message or null.
 */
export function missingRequiredFields(userInput) {
  for (const field of REQUIRED_FIELDS) {
    const value = userInput[field]
    if (value === undefined || value === null || String(value).trim() === '') {
      return `Missing required field: ${field}`
    }
  }
  // Sub-location required when location has sub-options (caller can pass subLocation)
  if (userInput.subLocationRequired && !userInput.subLocation?.trim()) {
    return 'Missing required field: subLocation'
  }
  return null
}

/**
 * Phase 1: Sanitize string inputs (trim, limit length, basic XSS).
 */
export function sanitize(userInput) {
  const out = {}
  const maxLen = {
    description: 5000,
    first_name: 200,
    email: 255,
    category: 200,
    locationCategory: 200,
    subLocation: 200,
    photo_url: 2048,
  }
  for (const [key, value] of Object.entries(userInput)) {
    if (value === undefined || value === null) {
      out[key] = null
      continue
    }
    if (typeof value !== 'string') {
      out[key] = value
      continue
    }
    let s = value.trim()
    const limit = maxLen[key]
    if (limit && s.length > limit) s = s.slice(0, limit)
    // Reduce stored/script injection risk in fields that may appear in HTML or rich UIs later
    if (
      [
        'description',
        'first_name',
        'email',
        'category',
        'locationCategory',
        'subLocation',
      ].includes(key)
    ) {
      s = s.replace(/[<>]/g, '')
    }
    out[key] = s
  }
  return out
}

/**
 * Phase 1: Generate unique report ID (UUID v4).
 */
export function generateUniqueID() {
  return crypto.randomUUID()
}

/**
 * Phase 2: Compute priority score from category (deterministic, testable).
 */
export function computePriorityScore(category) {
  let priority_score = 0
  const c = (category || '').trim()
  if (c === 'Student Welfare') priority_score += 7
  if (c === 'Peer Conflict') priority_score += 5
  if (c === 'Harassment') priority_score += 5
  if (c === 'Trauma') priority_score += 8
  if (c === 'Medical Treatment' || c === "Medical Treatment (Open Wounds etc.)") priority_score += 10
  return priority_score
}

/**
 * Phase 2: Map priority_score to priority level.
 */
export function scoreToPriorityLevel(priority_score) {
  if (priority_score >= 10) return PRIORITY_LEVEL.CRITICAL
  if (priority_score >= 6) return PRIORITY_LEVEL.HIGH
  return PRIORITY_LEVEL.NORMAL
}

/**
 * Phase 3: Route category to admin (csa_admin vs clinic_admin).
 * Student Welfare, Harassment, Peer Conflict → csa_admin; else → clinic_admin.
 */
export function routeAssignedTo(category) {
  const c = (category || '').trim()
  if (c === 'Student Welfare' || c === 'Harassment' || c === 'Peer Conflict') {
    return ASSIGNED_TO.CSA_ADMIN
  }
  return ASSIGNED_TO.CLINIC_ADMIN
}

/**
 * Phase 5: Check if status transition is allowed.
 */
export function isValidTransition(currentStatus, newStatus) {
  const allowed = VALID_TRANSITIONS[currentStatus]
  return Array.isArray(allowed) && allowed.includes(newStatus)
}

/**
 * Full Phase 1–3 pipeline: validate → sanitize → compute priority & assignment.
 * Returns { sanitizedInput, reportID, status, priority, priority_score, assigned_to } or throws.
 */
export function processReportSubmission(userInput) {
  const missing = missingRequiredFields(userInput)
  if (missing) {
    const err = new Error('Submission Failed')
    err.code = 'MISSING_REQUIRED_FIELDS'
    err.detail = missing
    throw err
  }

  const sanitizedInput = sanitize(userInput)
  const reportID = generateUniqueID()
  const status = REPORT_STATUS.SUBMITTED

  const category = sanitizedInput.category
  const priority_score = computePriorityScore(category)
  const priority = scoreToPriorityLevel(priority_score)
  const assigned_to = routeAssignedTo(category)

  return {
    reportID,
    status,
    priority,
    priority_score,
    assigned_to,
    sanitizedInput,
  }
}

export default {
  REPORT_STATUS,
  PRIORITY_LEVEL,
  ASSIGNED_TO,
  missingRequiredFields,
  sanitize,
  generateUniqueID,
  computePriorityScore,
  scoreToPriorityLevel,
  routeAssignedTo,
  isValidTransition,
  processReportSubmission,
  VALID_TRANSITIONS,
}
