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

export type SupportedLanguage = 'English' | 'Hindi' | 'Marathi';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  draft?: Partial<Grievance>;
  confirmedId?: string;
}

export interface StatsData {
  total: number;
  resolved: number;
  pending: number;
  urgent: number;
  resolutionRate: number;
  avgSatisfaction: number;
  categoryBreakdown: Record<string, number>;
  statusBreakdown: Record<string, number>;
}
