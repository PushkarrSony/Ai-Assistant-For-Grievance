import React, { useState } from 'react';
import { SupportedLanguage, Grievance } from '../types';
import { translations } from '../locales';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  User, 
  Building, 
  FileText, 
  ArrowRight,
  Printer
} from 'lucide-react';

interface Props {
  language: SupportedLanguage;
  onNavigateToTrack: (id: string) => void;
  onOpenReceipt: (grievance: Grievance) => void;
}

export const DirectRegisterForm: React.FC<Props> = ({
  language,
  onNavigateToTrack,
  onOpenReceipt
}) => {
  const t = translations[language];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Education' | 'Public Services' | 'Banking' | 'Healthcare' | 'Workplace Issues' | 'Technical Problems' | 'Other'>('Education');
  const [department, setDepartment] = useState('');
  const [priority, setPriority] = useState<'Urgent' | 'Medium' | 'Standard'>('Medium');
  const [userName, setUserName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // AI Co-Pilot analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any | null>(null);
  const [isSafetyThreat, setIsSafetyThreat] = useState(false);
  const [summary, setSummary] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdGrievance, setCreatedGrievance] = useState<Grievance | null>(null);

  // Trigger AI NLP analysis on description
  const handleRunAiAnalysis = async () => {
    if (!description.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-grievance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: description, language })
      });
      const data = await res.json();
      if (data.success && data.data) {
        const d = data.data;
        setAiAnalysisResult(d);
        if (d.title && !title) setTitle(d.title);
        if (d.category) setCategory(d.category);
        if (d.department) setDepartment(d.department);
        if (d.priority) setPriority(d.priority);
        if (d.summary) setSummary(d.summary);
        if (d.isSafetyThreat) setIsSafetyThreat(d.isSafetyThreat);
      }
    } catch (err) {
      console.error('AI analysis error', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !title.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        userName: isAnonymous ? 'Anonymous Citizen' : (userName.trim() || 'Complainant'),
        contactEmail: contactEmail.trim() || undefined,
        phone: phone.trim() || undefined,
        category,
        department: department.trim() || 'Department of Public Grievances',
        title: title.trim(),
        description: description.trim(),
        summary: summary || description.substring(0, 160) + '...',
        priority,
        isSafetyThreat,
        suggestedAction: aiAnalysisResult?.suggestedAction,
        nextSteps: aiAnalysisResult?.resolutionSteps,
        escalationMatrix: aiAnalysisResult?.escalationMatrix
      };

      const res = await fetch('/api/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCreatedGrievance(data.data);
      }
    } catch (err) {
      alert('Failed to register grievance');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {createdGrievance ? (
        <div className="bg-white rounded-2xl border border-emerald-300 p-8 shadow-md text-center space-y-5 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Registration Confirmed
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2">
              Grievance Successfully Lodged in Database
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mt-1">
              Your complaint has been assigned a unique reference ID and routed to the corresponding department.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-md mx-auto text-left space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold uppercase">Complaint ID:</span>
              <span className="font-mono text-lg font-bold text-blue-700">{createdGrievance.id}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold uppercase">Department:</span>
              <span className="font-semibold text-slate-800">{createdGrievance.department}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold uppercase">Priority:</span>
              <span className="font-semibold text-rose-600">{createdGrievance.priority}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigateToTrack(createdGrievance.id)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-xs flex items-center gap-2"
            >
              <span>Track Resolution Live</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onOpenReceipt(createdGrievance)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Print Acknowledgement Slip</span>
            </button>
            <button
              onClick={() => {
                setCreatedGrievance(null);
                setTitle('');
                setDescription('');
                setSummary('');
                setAiAnalysisResult(null);
              }}
              className="px-4 py-2.5 text-slate-500 hover:text-slate-800 text-xs font-medium"
            >
              Register Another Grievance
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Direct Grievance Registration with AI Co-Pilot
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Describe your issue in plain words. Our AI Natural Language Processing engine will automatically categorize, triage priority, and draft your official grievance.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Description & AI Trigger */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Complaint Description *
                </label>
                <button
                  type="button"
                  onClick={handleRunAiAnalysis}
                  disabled={!description.trim() || isAnalyzing}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xs transition-all disabled:opacity-40"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAnalyzing ? 'Analyzing with AI...' : 'Auto-Classify with AI'}</span>
                </button>
              </div>

              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your issue with dates, department involved, and specific impact (e.g., 'Applied for 6th sem revaluation 45 days ago, placement verification delayed...')"
                required
                className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-blue-600 focus:bg-white"
              />
              <span className="text-[11px] text-slate-400">
                Tip: Click "Auto-Classify with AI" above to automatically detect category, department, and priority.
              </span>
            </div>

            {/* AI Assistant Insight Box if analyzed */}
            {aiAnalysisResult && (
              <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border border-blue-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-blue-950">AI NLP Triage & Entity Extraction</span>
                  </div>
                  <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    Confidence: {Math.round(aiAnalysisResult.confidenceScore * 100)}%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-blue-100">
                    <span className="text-slate-400 text-[10px] block">Detected Category:</span>
                    <span className="font-bold text-blue-700">{aiAnalysisResult.category}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-blue-100">
                    <span className="text-slate-400 text-[10px] block">Computed Priority:</span>
                    <span className="font-bold text-rose-600">{aiAnalysisResult.priority}</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-blue-100">
                    <span className="text-slate-400 text-[10px] block">Emergency Threat:</span>
                    <span className="font-bold text-slate-700">
                      {aiAnalysisResult.isSafetyThreat ? '🚨 Active Alert' : 'No threat'}
                    </span>
                  </div>
                </div>

                {aiAnalysisResult.extractedEntities && aiAnalysisResult.extractedEntities.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                    <span className="text-slate-500 font-medium">Extracted Entities:</span>
                    {aiAnalysisResult.extractedEntities.map((ent: string, idx: number) => (
                      <span key={idx} className="bg-white text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                        {ent}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Title / Subject */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                Complaint Title / Subject *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Concise summary title (e.g., Delay in 6th Sem Revaluation Marksheet)"
                required
                className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-blue-600 focus:bg-white"
              />
            </div>

            {/* Category & Priority Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                  Complaint Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-blue-600 focus:bg-white"
                >
                  <option value="Education">Education (Colleges, Exams, Fees)</option>
                  <option value="Public Services">Public Services (Water, Roads, Sanitation)</option>
                  <option value="Banking">Banking & Finance (ATM, Unauthorized Debits)</option>
                  <option value="Healthcare">Healthcare (Hospitals, Price Caps, Negligence)</option>
                  <option value="Workplace Issues">Workplace Issues (Wages, Harassment, Safety)</option>
                  <option value="Technical Problems">Technical Problems (Portals, Cyber, Login)</option>
                  <option value="Other">Other Category</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                  Priority Urgency Level
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-blue-600 focus:bg-white"
                >
                  <option value="Standard">Standard (Routine timeline)</option>
                  <option value="Medium">Medium (Time-sensitive, exam or job deadline)</option>
                  <option value="Urgent">Urgent (Health risk, financial fraud, hazard)</option>
                </select>
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                Suggested Department / Authority
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. University Examination Controller / Municipal Water Works"
                className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-blue-600 focus:bg-white"
              />
            </div>

            {/* Personal Details & Privacy */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Complainant Identification
                </span>
                <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded-sm text-blue-600"
                  />
                  <span>File Anonymously (Identity Protected)</span>
                </label>
              </div>

              {!isAnonymous && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-blue-600"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="Email Address (optional)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-blue-600"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone Number (optional)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-blue-600"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !description.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-3 px-6 rounded-xl text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Grievance to Database...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Submit & Register Grievance</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
