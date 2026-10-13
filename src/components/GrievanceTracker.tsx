import React, { useState, useEffect } from 'react';
import { SupportedLanguage, Grievance } from '../types';
import { translations } from '../locales';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  Building, 
  User, 
  ShieldAlert, 
  ShieldCheck, 
  FileText, 
  ArrowUpRight, 
  Printer, 
  Star, 
  ChevronRight, 
  AlertCircle,
  Phone,
  Mail,
  Send,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

interface Props {
  language: SupportedLanguage;
  initialId?: string;
  onOpenReceipt: (grievance: Grievance) => void;
}

export const GrievanceTracker: React.FC<Props> = ({
  language,
  initialId = '',
  onOpenReceipt
}) => {
  const t = translations[language];
  const [searchId, setSearchId] = useState(initialId || 'GRV-2026-1042');
  const [grievance, setGrievance] = useState<Grievance | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Feedback form
  const [rating, setRating] = useState(5);
  const [helpful, setHelpful] = useState(true);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const fetchGrievance = async (idToFetch: string) => {
    if (!idToFetch.trim()) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/grievances/${encodeURIComponent(idToFetch.trim())}`);
      const data = await res.json();
      if (data.success && data.data) {
        setGrievance(data.data);
        if (data.data.feedback) {
          setRating(data.data.feedback.rating);
          setHelpful(data.data.feedback.helpful);
          setFeedbackComment(data.data.feedback.comment || '');
          setFeedbackSubmitted(true);
        } else {
          setFeedbackSubmitted(false);
        }
      } else {
        setGrievance(null);
        setErrorMsg(`Complaint ID "${idToFetch}" was not found in the verified database. Please check the reference number or file a new grievance.`);
      }
    } catch (err: any) {
      setErrorMsg('Failed to connect to the grievance server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      setSearchId(initialId);
      fetchGrievance(initialId);
    } else {
      fetchGrievance('GRV-2026-1042');
    }
  }, [initialId]);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievance) return;
    setSubmittingFeedback(true);
    try {
      const res = await fetch(`/api/grievances/${grievance.id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, helpful, comment: feedbackComment })
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackSubmitted(true);
      }
    } catch (err) {
      alert('Error submitting feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const steps = [
    { key: 'Submitted', label: '1. Registered & Triaged' },
    { key: 'Under Review', label: '2. Department Scrutiny' },
    { key: 'In Investigation', label: '3. Field Investigation' },
    { key: 'Assigned to Officer', label: '4. Officer Action' },
    { key: 'Resolved', label: '5. Resolution Confirmed' },
  ];

  const getStepStatus = (stepKey: string, currentStatus: string) => {
    const order = ['Submitted', 'Under Review', 'In Investigation', 'Assigned to Officer', 'Resolved'];
    const currentIndex = order.indexOf(currentStatus);
    const stepIndex = order.indexOf(stepKey);

    if (currentStatus === 'Escalated') {
      return 'active';
    }
    if (stepIndex <= currentIndex) {
      return 'completed';
    }
    return 'pending';
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Search Bar Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
          {t.navTrack}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mb-4">
          Enter your unique complaint reference number (e.g. GRV-2026-XXXX) to inspect real-time departmental status, officer audit trail, and escalation stages.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchGrievance(searchId);
          }}
          className="flex flex-col sm:flex-row gap-2 max-w-2xl"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value.toUpperCase())}
              placeholder="e.g. GRV-2026-1042"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-medium text-slate-800 placeholder-slate-400 focus:outline-blue-600 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            {loading ? 'Searching...' : 'Track Grievance'}
          </button>
        </form>

        {/* Quick Sample IDs for CIE Evaluator / Demonstration */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Quick Demo Samples:</span>
          {['GRV-2026-1042', 'GRV-2026-2189', 'GRV-2026-3407', 'GRV-2026-4190'].map((id) => (
            <button
              key={id}
              onClick={() => {
                setSearchId(id);
                fetchGrievance(id);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-mono text-xs border border-slate-200 transition-colors"
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {grievance && (
        <div className="space-y-6">
          {/* Main Status & Meta Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {grievance.id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    {grievance.category}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    grievance.priority === 'Urgent'
                      ? 'bg-rose-50 border-rose-200 text-rose-700'
                      : grievance.priority === 'Medium'
                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  }`}>
                    {grievance.priority} Priority
                  </span>
                  {grievance.isSafetyThreat && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                      <ShieldAlert className="w-3 h-3 text-red-600" />
                      Safety Alert
                    </span>
                  )}
                </div>

                <h1 className="text-xl font-bold text-slate-900 leading-snug">
                  {grievance.title}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Filed by: <strong className="text-slate-600">{grievance.userName}</strong> • {new Date(grievance.submissionDate).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start">
                <button
                  onClick={() => onOpenReceipt(grievance)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-medium transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>

            {/* Visual Redressal Stepper */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                Redressal Lifecycle Status
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-1">
                {steps.map((step, idx) => {
                  const status = getStepStatus(step.key, grievance.status);
                  return (
                    <div
                      key={step.key}
                      className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                        status === 'completed'
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                          : status === 'active'
                          ? 'bg-blue-50 border-blue-300 text-blue-900 ring-2 ring-blue-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-400 opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider">Step 0{idx + 1}</span>
                        {status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </div>
                      <span className="text-xs font-semibold">{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Department and Officer Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  <span>Allocated Department & Desk</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">{grievance.department}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Official grievance handling cell under territorial administrative jurisdiction.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>Assigned Redressal Officer</span>
                </div>
                {grievance.assignedOfficer ? (
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{grievance.assignedOfficer.name}</h4>
                    <p className="text-xs text-slate-600">{grievance.assignedOfficer.designation}</p>
                    <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {grievance.assignedOfficer.contact}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Triage desk assigned. Direct officer assignment in progress.</p>
                )}
              </div>
            </div>

            {/* Summary & Proposed Actions */}
            <div className="space-y-3 pt-2">
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block mb-1">
                  AI-Synthesized Complaint Summary:
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{grievance.summary}"
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Complainant Description
                </h4>
                <div className="text-xs sm:text-sm text-slate-800 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed whitespace-pre-wrap">
                  {grievance.description}
                </div>
              </div>

              {/* Next Steps List */}
              {grievance.nextSteps && grievance.nextSteps.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Action Plan & Redressal Steps
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {grievance.nextSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 3-Tier Escalation Matrix */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Transparent 3-Tier Escalation Matrix
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                If the grievance is not addressed within standard departmental SLA guidelines, complainants hold the statutory right to escalate hierarchically:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">Tier 1: Sub-Divisional Officer</div>
                  <p className="font-medium text-slate-800">{grievance.escalationMatrix.level1}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">Tier 2: District Grievance Cell</div>
                  <p className="font-medium text-slate-800">{grievance.escalationMatrix.level2}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[10px] font-bold uppercase text-purple-600 mb-1">Tier 3: Statutory Ombudsman</div>
                  <p className="font-medium text-slate-800">{grievance.escalationMatrix.level3}</p>
                </div>
              </div>
            </div>

            {/* Timeline Audit Trail */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Chronological Redressal Audit Trail</span>
              </h3>

              <div className="space-y-3 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {grievance.timeline.map((item, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                    <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                        <span className="font-semibold text-slate-800">{item.status}</span>
                        <span>{item.date}</span>
                      </div>
                      <p className="text-slate-700">{item.note}</p>
                      {item.officer && (
                        <p className="text-[10px] text-slate-400 mt-1">Logged by: {item.officer}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Citizen Feedback Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
              Feedback & Citizen Satisfaction
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Your feedback is analyzed by our continuous evaluation model to measure department responsiveness and enhance redressal quality.
            </p>

            {feedbackSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-xl text-xs sm:text-sm">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Feedback Recorded</span>
                </div>
                <p>{t.feedbackThanks}</p>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 font-medium">{t.feedbackQuestion}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            rating >= star ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={helpful}
                      onChange={(e) => setHelpful(e.target.checked)}
                      className="rounded-sm text-blue-600"
                    />
                    <span>{t.feedbackHelpful}</span>
                  </label>
                </div>

                <textarea
                  rows={2}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Additional remarks or suggestions for the redressal officer..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-blue-600 focus:bg-white"
                />

                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  {submittingFeedback ? 'Submitting...' : t.feedbackSubmit}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
