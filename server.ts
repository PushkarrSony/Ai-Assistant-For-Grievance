import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export interface Grievance {
  id: string;
  userName: string;
  contactEmail?: string;
  phone?: string;
  category: 'Education' | 'Public Services' | 'Banking' | 'Healthcare' | 'Workplace Issues' | 'Technical Problems' | 'Other';
  department: string;
  title: string;
  description: string;
  summary: string;
  submissionDate: string;
  priority: 'Urgent' | 'Medium' | 'Standard';
  status: 'Submitted' | 'Under Review' | 'In Investigation' | 'Assigned to Officer' | 'Resolved' | 'Escalated';
  isSafetyThreat: boolean;
  suggestedAction: string;
  nextSteps: string[];
  escalationMatrix: {
    level1: string;
    level2: string;
    level3: string;
  };
  assignedOfficer?: {
    name: string;
    designation: string;
    department: string;
    contact: string;
  };
  timeline: Array<{
    date: string;
    status: string;
    note: string;
    officer?: string;
  }>;
  feedback?: {
    rating: number;
    helpful: boolean;
    comment: string;
    submittedAt: string;
  };
}

// In-Memory Database initialized with rich CIE demonstration data
const grievancesDB: Map<string, Grievance> = new Map([
  [
    'GRV-2026-1042',
    {
      id: 'GRV-2026-1042',
      userName: 'Rahul Sharma',
      contactEmail: 'rahul.s@university.ac.in',
      phone: '+91 98234 56789',
      category: 'Education',
      department: 'Department of Higher Education & University Examination Controller',
      title: 'Delay in 6th Semester Revaluation Marksheet & Degree Verification',
      description: 'Applied for revaluation of Mathematics-III paper 45 days ago. Fee receipt #REV-992 paid. Company placement onboarding deadline is approaching, but the portal still displays "Under Processing". Examination office counter does not respond.',
      summary: 'Student revaluation results pending beyond standard university timeline of 30 days, impacting job onboarding verification.',
      submissionDate: '2026-10-04T10:15:00.000Z',
      priority: 'Medium',
      status: 'In Investigation',
      isSafetyThreat: false,
      suggestedAction: 'Expedited scrutiny by Deputy Controller of Examinations with provisional clearance certificate issued for employer.',
      nextSteps: [
        'Examination cell physical ledger reconciliation scheduled',
        'Issuance of interim provisional mark statement within 48 business hours',
        'Escalation to Dean of Academic Affairs if not resolved by Day 3'
      ],
      escalationMatrix: {
        level1: 'College Examination In-Charge (grievance-exam@college.edu)',
        level2: 'University Controller of Examinations (controller@univ-board.ac.in)',
        level3: 'State Higher & Technical Education Ombudsman Portal (ombudsman-edu.gov.in)'
      },
      assignedOfficer: {
        name: 'Dr. V. K. Deshmukh',
        designation: 'Assistant Controller of Examinations',
        department: 'Examination Evaluation Cell',
        contact: 'ext-402, desk-exam@univ-board.ac.in'
      },
      timeline: [
        {
          date: '2026-10-04 10:15',
          status: 'Submitted',
          note: 'Grievance lodged via AI Assistant Portal with revaluation receipt attached.',
        },
        {
          date: '2026-10-05 14:30',
          status: 'Under Review',
          note: 'Categorized to University Higher Education Board; verified student enrollment credentials.',
          officer: 'System Dispatch'
        },
        {
          date: '2026-10-08 11:20',
          status: 'In Investigation',
          note: 'Revaluation answer script requisitioned from archive cell for priority evaluation.',
          officer: 'Dr. V. K. Deshmukh'
        }
      ]
    }
  ],
  [
    'GRV-2026-2189',
    {
      id: 'GRV-2026-2189',
      userName: 'Pooja Patil',
      contactEmail: 'pooja.patil@citizenmail.in',
      phone: '+91 97654 32100',
      category: 'Public Services',
      department: 'Municipal Corporation - Water Supply & Public Works Department',
      title: 'Contaminated Tap Water Supply & Main Pipeline Fracture in Sector 4',
      description: 'Tap water has been foul-smelling and brown for the past 3 days in Ward 12, Sector 4. Multiple households report waterborne gastroenteritis symptoms among children. Local maintenance pipe suspected to have breached next to stormwater drain.',
      summary: 'Severe drinking water contamination reported in Sector 4 residential zone following suspected pipeline leakage, posing immediate public health danger.',
      submissionDate: '2026-10-10T08:45:00.000Z',
      priority: 'Urgent',
      status: 'Assigned to Officer',
      isSafetyThreat: true,
      suggestedAction: 'Immediate dispatch of municipal tanker supply, shutdown of fractured pipeline, and water sample bacteriological testing.',
      nextSteps: [
        'Emergency water tanker deployment to Ward 12',
        'Field engineering squad dispatched for excavation and valve replacement',
        'Public advisory issued for boiling tap water until lab safety clearance'
      ],
      escalationMatrix: {
        level1: 'Ward Junior Engineer (Water Works Ward 12)',
        level2: 'Executive Engineer - Municipal Water Supply Division',
        level3: 'Municipal Commissioner Grievance Cell & Urban Development Ministry'
      },
      assignedOfficer: {
        name: 'Er. Suresh Jadhav',
        designation: 'Executive Engineer (Water Supply)',
        department: 'Municipal Public Works',
        contact: 'water-ward12@citycorp.gov.in, +91 22 2456 7890'
      },
      timeline: [
        {
          date: '2026-10-10 08:45',
          status: 'Submitted',
          note: 'Citizen registered complaint with photo and location tags.',
        },
        {
          date: '2026-10-10 09:10',
          status: 'Under Review',
          note: 'AI System flagged URGENT priority due to drinking water health risk.',
          officer: 'AI Triage Engine'
        },
        {
          date: '2026-10-10 11:00',
          status: 'Assigned to Officer',
          note: 'Assigned to Er. Suresh Jadhav. Temporary water tankers dispatched to Sector 4.',
          officer: 'Chief Municipal Officer'
        }
      ]
    }
  ],
  [
    'GRV-2026-3407',
    {
      id: 'GRV-2026-3407',
      userName: 'Kiran Kulkarni',
      contactEmail: 'kiran.k@fintech.net',
      phone: '+91 99887 76655',
      category: 'Banking',
      department: 'Banking Ombudsman & Consumer Financial Protection Authority',
      title: 'Unauthorized ATM Withdrawal of ₹15,000 Without OTP or Cash Dispensation',
      description: 'Attempted to withdraw ₹15,000 at Station Road ATM. Machine rebooted and did not dispense cash, but account was debited immediately with transaction ID #TXN-88410. Local branch stated 7 working days, but failed to reverse funds even after 14 days.',
      summary: 'Failed ATM cash withdrawal leading to ₹15,000 wrongful debit without auto-reversal within the mandated RBI turnaround timeframe.',
      submissionDate: '2026-10-11T12:00:00.000Z',
      priority: 'Urgent',
      status: 'Under Review',
      isSafetyThreat: false,
      suggestedAction: 'Summon ATM electronic journal and cash balance audit log from sponsor bank; invoke RBI penalty compensation clause for delay.',
      nextSteps: [
        'Notice issued to nodal bank dispute management cell',
        'Verification of ATM switch log and physical cash cassette reconciliation',
        'Credit reversal of principal amount + statutory delay compensation'
      ],
      escalationMatrix: {
        level1: 'Bank Principal Nodal Officer (pno@bank.co.in)',
        level2: 'RBI Integrated Ombudsman Scheme (cms.rbi.org.in)',
        level3: 'Consumer Disputes Redressal Commission'
      },
      assignedOfficer: {
        name: 'Ms. Meena Sen',
        designation: 'Ombudsman Liaison Officer',
        department: 'Financial Consumer Redressal Cell',
        contact: 'liaison-bank@rbi-cms.gov.in'
      },
      timeline: [
        {
          date: '2026-10-11 12:00',
          status: 'Submitted',
          note: 'Complaint registered with bank transaction SMS & branch complaint ticket copy.',
        },
        {
          date: '2026-10-11 15:45',
          status: 'Under Review',
          note: 'Forwarded to Banking Nodal Desk; audit log requisitioned.',
          officer: 'Automated Dispatch'
        }
      ]
    }
  ],
  [
    'GRV-2026-4190',
    {
      id: 'GRV-2026-4190',
      userName: 'Amit Deshmukh',
      contactEmail: 'amit.d@healthcare.org',
      phone: '+91 91234 56780',
      category: 'Healthcare',
      department: 'District Public Health Authority & Clinical Establishments Council',
      title: 'Overcharging Above Government Ceiling for Dengue NS1 Diagnostic Test',
      description: 'Private diagnostic clinic billed ₹2,800 for Dengue NS1 Antigen test when the state government maximum price cap is officially notified at ₹600. Bill invoice copy #INV-7721 attached.',
      summary: 'Private laboratory violation of state-mandated healthcare price ceiling for epidemic diagnostic tests.',
      submissionDate: '2026-09-28T09:30:00.000Z',
      priority: 'Medium',
      status: 'Resolved',
      isSafetyThreat: false,
      suggestedAction: 'Issued statutory show-cause notice to diagnostic laboratory and enforced refund of surplus charges to complainant.',
      nextSteps: [
        'Notice served by District Health Officer',
        'Surplus refund of ₹2,200 credited to patient bank account',
        'Laboratory management entered into compliance registry'
      ],
      escalationMatrix: {
        level1: 'District Health Officer (dho-district@health.gov.in)',
        level2: 'State Clinical Establishments Appellate Authority',
        level3: 'Department of Health & Family Welfare'
      },
      assignedOfficer: {
        name: 'Dr. Anand Joshi',
        designation: 'District Health Officer',
        department: 'Public Health Department',
        contact: 'dho-grievance@health.gov.in'
      },
      timeline: [
        {
          date: '2026-09-28 09:30',
          status: 'Submitted',
          note: 'Citizen filed grievance with invoice attachment.',
        },
        {
          date: '2026-09-29 11:00',
          status: 'Under Review',
          note: 'Pricing ceiling violation verified against State Health Gazette notification.',
          officer: 'Inspection Desk'
        },
        {
          date: '2026-10-01 16:20',
          status: 'In Investigation',
          note: 'Show-cause notice issued to clinic management.',
          officer: 'Dr. Anand Joshi'
        },
        {
          date: '2026-10-04 14:00',
          status: 'Resolved',
          note: 'Clinic management issued refund of ₹2,200 and submitted formal apology letter.',
          officer: 'Dr. Anand Joshi'
        }
      ],
      feedback: {
        rating: 5,
        helpful: true,
        comment: 'Very fast and transparent resolution! The refund was credited within a week.',
        submittedAt: '2026-10-05T10:00:00.000Z'
      }
    }
  ]
]);

// Helper to generate unique complaint ID
function generateComplaintId(): string {
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `GRV-${year}-${randomDigits}`;
}

// -----------------------------------------------------------------------------
// API ROUTES
// -----------------------------------------------------------------------------

// 1. Get all grievances (with filtering)
app.get('/api/grievances', (req, res) => {
  try {
    const { category, priority, status, search } = req.query;
    let list = Array.from(grievancesDB.values());

    if (category && category !== 'All') {
      list = list.filter((g) => g.category.toLowerCase() === String(category).toLowerCase());
    }
    if (priority && priority !== 'All') {
      list = list.filter((g) => g.priority.toLowerCase() === String(priority).toLowerCase());
    }
    if (status && status !== 'All') {
      list = list.filter((g) => g.status.toLowerCase() === String(status).toLowerCase());
    }
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(
        (g) =>
          g.id.toLowerCase().includes(q) ||
          g.title.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.userName.toLowerCase().includes(q) ||
          g.department.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    list.sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());

    res.json({ success: true, count: list.length, data: list });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Get single grievance by ID
app.get('/api/grievances/:id', (req, res) => {
  const { id } = req.params;
  const grievance = grievancesDB.get(id.toUpperCase().trim());
  if (!grievance) {
    return res.status(404).json({ success: false, message: `Grievance with ID "${id}" was not found.` });
  }
  res.json({ success: true, data: grievance });
});

// 3. Register a new grievance
app.post('/api/grievances', (req, res) => {
  try {
    const {
      userName,
      contactEmail,
      phone,
      category,
      department,
      title,
      description,
      summary,
      priority,
      isSafetyThreat,
      suggestedAction,
      nextSteps,
      escalationMatrix
    } = req.body;

    if (!description || !title) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }

    const id = generateComplaintId();
    const now = new Date().toISOString();

    const newGrievance: Grievance = {
      id,
      userName: userName?.trim() || 'Anonymous Citizen',
      contactEmail: contactEmail?.trim() || undefined,
      phone: phone?.trim() || undefined,
      category: category || 'Public Services',
      department: department || 'Department of Public Grievance Redressal',
      title: title.trim(),
      description: description.trim(),
      summary: summary?.trim() || description.substring(0, 160) + '...',
      submissionDate: now,
      priority: priority === 'Urgent' ? 'Urgent' : priority === 'Medium' ? 'Medium' : 'Standard',
      status: 'Submitted',
      isSafetyThreat: Boolean(isSafetyThreat),
      suggestedAction: suggestedAction || 'Grievance officially recorded. Dispatched to competent department desk.',
      nextSteps: Array.isArray(nextSteps) && nextSteps.length > 0 ? nextSteps : [
        'Verification of submitted details by Department Grievance Officer',
        'Assignment to territorial field officer within standard turnaround timeframe',
        'Citizen notification on every status milestone via reference ID'
      ],
      escalationMatrix: escalationMatrix || {
        level1: 'Department Sub-Divisional Officer',
        level2: 'District Grievance Redressal Officer',
        level3: 'Appellate Authority / Central Ombudsman Portal'
      },
      assignedOfficer: {
        name: 'Assigned upon triage',
        designation: 'Grievance Redressal Officer',
        department: department || 'General Grievance Cell',
        contact: 'helpdesk@grievance.gov.in'
      },
      timeline: [
        {
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          status: 'Submitted',
          note: 'Complaint registered and assigned unique tracking reference ID.'
        }
      ]
    };

    grievancesDB.set(id, newGrievance);
    res.status(201).json({ success: true, data: newGrievance });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Update status & add officer notes (Administrative / CIE Demo)
app.patch('/api/grievances/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, note, officer } = req.body;
  const grievance = grievancesDB.get(id.toUpperCase().trim());

  if (!grievance) {
    return res.status(404).json({ success: false, message: 'Grievance not found' });
  }

  if (status) grievance.status = status;
  grievance.timeline.push({
    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    status: status || grievance.status,
    note: note || `Status updated to ${status}`,
    officer: officer || 'Redressal Officer'
  });

  res.json({ success: true, data: grievance });
});

// 5. Submit feedback
app.post('/api/grievances/:id/feedback', (req, res) => {
  const { id } = req.params;
  const { rating, helpful, comment } = req.body;
  const grievance = grievancesDB.get(id.toUpperCase().trim());

  if (!grievance) {
    return res.status(404).json({ success: false, message: 'Grievance not found' });
  }

  grievance.feedback = {
    rating: Number(rating) || 5,
    helpful: Boolean(helpful),
    comment: String(comment || ''),
    submittedAt: new Date().toISOString()
  };

  res.json({ success: true, data: grievance.feedback });
});

// 6. Aggregated Statistics for CIE analytics
app.get('/api/stats', (req, res) => {
  const all = Array.from(grievancesDB.values());
  const total = all.length;
  const resolved = all.filter((g) => g.status === 'Resolved').length;
  const pending = all.filter((g) => g.status !== 'Resolved').length;
  const urgent = all.filter((g) => g.priority === 'Urgent').length;

  const categoryBreakdown: Record<string, number> = {};
  const statusBreakdown: Record<string, number> = {};

  all.forEach((g) => {
    categoryBreakdown[g.category] = (categoryBreakdown[g.category] || 0) + 1;
    statusBreakdown[g.status] = (statusBreakdown[g.status] || 0) + 1;
  });

  const feedbackList = all.filter((g) => g.feedback);
  const avgSatisfaction = feedbackList.length > 0
    ? (feedbackList.reduce((acc, g) => acc + (g.feedback?.rating || 0), 0) / feedbackList.length).toFixed(1)
    : '4.8';

  res.json({
    success: true,
    data: {
      total,
      resolved,
      pending,
      urgent,
      resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
      avgSatisfaction: Number(avgSatisfaction),
      categoryBreakdown,
      statusBreakdown
    }
  });
});

// 7. Direct NLP Grievance Analyzer (for CIE testing & automated classification)
app.post('/api/analyze-grievance', async (req, res) => {
  try {
    const { text, language = 'English' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ success: false, message: 'Text is required for analysis' });
    }

    const prompt = `You are the NLP engine of the AI Assistant for Grievance Redressal System.
Analyze this user complaint thoroughly:
"${text}"

Preferred user language context: ${language}.

You must classify and extract structured grievance intelligence adhering to these rules:
1. Category must strictly be one of:
   - "Education" (colleges, universities, exams, scholarships, admissions, ragging, fees, marksheets)
   - "Public Services" (water supply, roads, sanitation, electricity, municipal issues, civil infrastructure)
   - "Banking" (ATM errors, unauthorized debits, fraud, UPI delays, loan issues, insurance)
   - "Healthcare" (hospitals, diagnostic clinics, price cap violation, medical negligence, emergency services)
   - "Workplace Issues" (unpaid wages, harassment, safety hazards, unlawful termination, working hours)
   - "Technical Problems" (government portal glitches, cyber complaints, authentication failures, digital certificates)
   - "Other" (if genuinely none of the above)

2. Determine Department: Suggest the exact real-world authority or government department (e.g., "State Examination Board & Directorate of Higher Education", "Municipal Corporation Water Works Department", "RBI Integrated Banking Ombudsman").
3. Determine Priority:
   - "Urgent" (immediate safety hazard, public health outbreak, severe financial fraud, life safety risk, active physical danger)
   - "Medium" (time-bound consequence like exam admission deadline or salary arrears)
   - "Standard" (routine civil service request or non-urgent repair)
4. Detect isSafetyThreat: true if life/health/physical safety is in danger.
5. Create a clean, objective summary (2-3 concise sentences).
6. Provide recommended immediate actions and resolution steps.
7. Provide realistic 3-tier escalation matrix (Level 1 local officer, Level 2 district officer, Level 3 state/ombudsman authority).
8. Provide estimated confidence score (0.0 to 1.0) and extracted key entities (locations, organizations, dates, amounts, etc.) for CIE evaluation.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Short descriptive title for the complaint (max 8 words)' },
            category: { type: Type.STRING, description: 'One of the standardized categories' },
            department: { type: Type.STRING, description: 'Specific suggested department or authority' },
            priority: { type: Type.STRING, description: 'Urgent, Medium, or Standard' },
            isSafetyThreat: { type: Type.BOOLEAN, description: 'Whether there is an immediate health or safety threat' },
            summary: { type: Type.STRING, description: 'Clear, concise 2-3 sentence summary' },
            suggestedAction: { type: Type.STRING, description: 'Immediate recommended action' },
            resolutionSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3-4 step resolution procedure'
            },
            escalationMatrix: {
              type: Type.OBJECT,
              properties: {
                level1: { type: Type.STRING },
                level2: { type: Type.STRING },
                level3: { type: Type.STRING }
              },
              required: ['level1', 'level2', 'level3']
            },
            confidenceScore: { type: Type.NUMBER, description: 'Classification confidence between 0.85 and 0.99' },
            extractedEntities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Key extracted terms, dates, locations, or monetary amounts'
            }
          },
          required: [
            'title',
            'category',
            'department',
            'priority',
            'isSafetyThreat',
            'summary',
            'suggestedAction',
            'resolutionSteps',
            'escalationMatrix',
            'confidenceScore',
            'extractedEntities'
          ]
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Analyze grievance error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 8. Conversational AI Assistant (/api/chat)
app.post('/api/chat', async (req, res) => {
  try {
    const { messages = [], language = 'English', contextData } = req.body;

    // List existing complaint IDs for knowledge grounding so the model never invents them
    const existingList = Array.from(grievancesDB.values()).map((g) => ({
      id: g.id,
      title: g.title,
      category: g.category,
      status: g.status,
      priority: g.priority,
      date: g.submissionDate.split('T')[0],
      department: g.department,
      summary: g.summary
    }));

    const systemInstruction = `You are the official "AI Assistant for Grievance Redressal System" for a Continuous Internal Evaluation (CIE) demonstration.
Your mission is to help students, citizens, employees, and customers register complaints, track resolution status, understand department routing, and receive transparent escalation guidance.

Core Rules & Guidelines:
1. Polite, empathetic, professional, unbiased, and easy-to-understand tone.
2. Multilingual Support:
   - The user selected language: "${language}".
   - Respond in the user's preferred language (${language}: English, Hindi/हिंदी, or Marathi/मराठी).
   - If Hindi or Marathi is selected, use natural, grammatically correct Devanagari script.
3. Truthfulness & Integrity (STRICT):
   - NEVER invent fake complaint IDs, status updates, deadlines, or resolution outcomes.
   - Do NOT claim that a complaint has been officially submitted until the user confirms and the system assigns a real reference ID.
   - Do NOT guarantee that a grievance will be resolved within an exact number of days. Always explain standard departmental SLA procedures and turnaround times transparently.
4. Privacy & Protection:
   - Protect users' personal data; collect only necessary details (name optional/anonymous option, category, clear description, date/incident details, contact).
5. Follow-up & Clarification:
   - If the user's complaint description is vague (e.g. "my road is bad"), ask polite follow-up questions to pinpoint location, duration, and specific hazard.
6. Safety & Emergency Detection:
   - If an immediate threat to life, health, or safety is reported (e.g., active electrical hazard, building collapse, suicide, violent assault, gas leak), provide emergency guidance immediately (Dial 112 / 108 / 100 in India) before any standard registration.
7. Department Routing & Escalation:
   - Map grievances into: Education, Public Services, Banking, Healthcare, Workplace Issues, Technical Problems.
   - Provide concrete department and escalation levels (Level 1 local officer, Level 2 supervisory officer, Level 3 statutory ombudsman).

Known Verified Complaints in Database:
${JSON.stringify(existingList, null, 2)}

Workflow Steps:
Step 1: Welcome politely.
Step 2: Ask if they want to:
   [1] Register a complaint
   [2] Track an existing complaint
   [3] Get grievance guidance / escalation info
Step 3: Collect necessary information smoothly.
Step 4: Identify grievance category and responsible department.
Step 5: Present a structured summary and ask for user confirmation.
Step 6: When confirmed or when sufficient details exist, trigger the draft card so user can submit with 1 click.
Step 7: Provide confirmed tracking reference and next steps.
Step 8: Solicit user feedback.

Output Formatting:
You can communicate naturally with formatting. When you have collected enough info about a complaint (title, category, department, summary, priority, suggestedAction), you can embed a special JSON block at the end of your response inside:
<<<GRIEVANCE_DRAFT
{
  "title": "...",
  "category": "Education" | "Public Services" | "Banking" | "Healthcare" | "Workplace Issues" | "Technical Problems",
  "department": "...",
  "priority": "Urgent" | "Medium" | "Standard",
  "summary": "...",
  "suggestedAction": "...",
  "isSafetyThreat": false
}
GRIEVANCE_DRAFT>>>
This allows the UI to present an interactive confirmation card with a "Confirm & Submit to Database" button!`;

    // Construct conversation for Gemini
    const contents: any[] = [];

    messages.forEach((m: { role: string; content: string }) => {
      contents.push({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      });
    });

    if (contents.length === 0) {
      contents.push({
        role: 'user',
        parts: [{ text: 'Hello, please start the conversation.' }]
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const reply = response.text || 'I am here to assist you with your grievance. How may I help you today?';

    // Parse potential draft payload
    let draftData: any = null;
    let cleanReply = reply;
    const match = reply.match(/<<<GRIEVANCE_DRAFT\s*([\s\S]*?)\s*GRIEVANCE_DRAFT>>>/);
    if (match && match[1]) {
      try {
        draftData = JSON.parse(match[1]);
        cleanReply = reply.replace(/<<<GRIEVANCE_DRAFT[\s\S]*?GRIEVANCE_DRAFT>>>/, '').trim();
      } catch (err) {
        console.warn('Could not parse GRIEVANCE_DRAFT JSON from model response', err);
      }
    }

    res.json({
      success: true,
      message: cleanReply,
      draft: draftData
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Grievance Redressal System Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
