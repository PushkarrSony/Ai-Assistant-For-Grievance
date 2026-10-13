import React, { useState, useRef, useEffect } from 'react';
import { SupportedLanguage, ChatMessage, Grievance } from '../types';
import { translations } from '../locales';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Copy, 
  Check, 
  Printer, 
  Star, 
  ThumbsUp, 
  RotateCcw,
  Building,
  GraduationCap
} from 'lucide-react';

interface Props {
  language: SupportedLanguage;
  onNavigateToTrack: (id: string) => void;
  onOpenReceipt: (grievance: Grievance) => void;
}

export const ChatAssistant: React.FC<Props> = ({
  language,
  onNavigateToTrack,
  onOpenReceipt
}) => {
  const t = translations[language];
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submittingDraft, setSubmittingDraft] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Complainant name & contact for draft submission
  const [draftUserName, setDraftUserName] = useState('');
  const [draftContact, setDraftContact] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Feedback state per confirmed complaint
  const [feedbackRating, setFeedbackRating] = useState<Record<string, number>>({});
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize initial greeting in chosen language
  useEffect(() => {
    let welcomeText = '';
    if (language === 'Hindi') {
      welcomeText = 'नमस्ते! AI शिकायत निवारण सहायक (Grievance Redressal Assistant) में आपका स्वागत है। मैं आपकी शिकायतों को निष्पक्ष, पारदर्शी एवं सटीक तरीके से दर्ज करने और उनका निवारण ट्रैक करने में आपकी सहायता करूँगा।\n\nआप आज क्या करना चाहते हैं?\n1. नई शिकायत दर्ज करें (Register a Complaint)\n2. मौजूदा शिकायत की स्थिति जांचें (Track Complaint)\n3. शिकायत निवारण प्रक्रिया व मार्गदर्शन प्राप्त करें (Get Guidance)';
    } else if (language === 'Marathi') {
      welcomeText = 'नमस्कार! AI तक्रार निवारण सहाय्यकामध्ये आपले स्वागत आहे. मी आपल्या तक्रारींची पारदर्शक, निष्पक्ष आणि कार्यक्षम पद्धतीने नोंदणी, वर्गीकरण आणि ट्रॅकिंग करण्यासाठी येथे आहे.\n\nमी आज आपल्याला कशी मदत करू शकतो?\n1. नवीन तक्रार नोंदवा (Register a Complaint)\n2. नोंदवलेल्या तक्रारीची स्थिती तपासा (Track Complaint)\n3. निवारण मार्गदर्शन आणि पायऱ्या जाणून घ्या (Get Guidance)';
    } else {
      welcomeText = 'Hello! Welcome to the AI Grievance Redressal Assistant. I am designed to help students, citizens, employees, and customers register complaints, classify them accurately, and track their resolution transparently.\n\nHow can I help you today?\n1. Register a complaint\n2. Track an existing complaint\n3. Get grievance guidance & escalation procedure';
    }

    setMessages([
      {
        id: 'initial-greeting',
        role: 'assistant',
        content: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          language
        })
      });

      const data = await response.json();

      if (data.success) {
        const assistantMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: data.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          draft: data.draft || undefined
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: 'I encountered an issue processing your request. Please try again or rephrase your complaint.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Unable to reach the grievance backend server. Please check your connection and retry.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit confirmed draft into actual database
  const handleConfirmSubmission = async (messageId: string, draft: Partial<Grievance>) => {
    setSubmittingDraft(true);
    try {
      const payload = {
        userName: isAnonymous ? 'Anonymous Citizen' : (draftUserName.trim() || 'Complainant'),
        contactEmail: draftContact.includes('@') ? draftContact.trim() : undefined,
        phone: !draftContact.includes('@') && draftContact ? draftContact.trim() : undefined,
        category: draft.category || 'Education',
        department: draft.department || 'Department of Public Grievances',
        title: draft.title || 'Official Grievance Registration',
        description: draft.summary || draft.title || 'Grievance registered via conversational AI assistant.',
        summary: draft.summary,
        priority: draft.priority || 'Medium',
        isSafetyThreat: draft.isSafetyThreat || false,
        suggestedAction: draft.suggestedAction
      };

      const res = await fetch('/api/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();
      if (resData.success && resData.data) {
        const confirmed: Grievance = resData.data;

        // Update messages with confirmation
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === messageId) {
              return {
                ...msg,
                confirmedId: confirmed.id,
                draft: undefined // clear draft card
              };
            }
            return msg;
          })
        );

        // Add follow-up assistant confirmation message with next steps
        const confirmFollowup: ChatMessage = {
          id: `confirm-followup-${Date.now()}`,
          role: 'assistant',
          content: `Your grievance has been officially registered and verified in our database under Complaint Reference ID: **${confirmed.id}**.\n\n` +
            `• **Department Allocated:** ${confirmed.department}\n` +
            `• **Priority Classification:** ${confirmed.priority}\n` +
            `• **Next Steps:** An inspection notice has been forwarded to the assigned nodal desk. You will receive progress notifications as the ticket advances through Review, Investigation, and Resolution.\n\n` +
            `You can track its status live anytime using this reference ID or print an official acknowledgement slip below. Was this guidance helpful to you?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          confirmedId: confirmed.id
        };

        setMessages((prev) => [...prev, confirmFollowup]);
      }
    } catch (err) {
      alert('Failed to submit grievance to database. Please retry.');
    } finally {
      setSubmittingDraft(false);
    }
  };

  // Submit Feedback
  const handleFeedback = async (complaintId: string, rating: number, helpful: boolean) => {
    try {
      await fetch(`/api/grievances/${complaintId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, helpful, comment: 'Submitted via AI Assistant feedback prompt' })
      });
      setFeedbackSubmitted((prev) => ({ ...prev, [complaintId]: true }));
    } catch (err) {
      console.error('Failed to submit feedback', err);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleResetChat = () => {
    let welcomeText = 'Hello! Welcome to the AI Grievance Redressal Assistant. How can I help you today?\n1. Register a complaint\n2. Track an existing complaint\n3. Get grievance guidance';
    if (language === 'Hindi') {
      welcomeText = 'नमस्ते! AI शिकायत निवारण सहायक में आपका स्वागत है। मैं आपकी शिकायतों के त्वरित समाधान में सहायता करूँगा।\n1. नई शिकायत दर्ज करें\n2. शिकायत ट्रैक करें\n3. निवारण मार्गदर्शन प्राप्त करें';
    } else if (language === 'Marathi') {
      welcomeText = 'नमस्कार! AI तक्रार निवारण सहाय्यकामध्ये आपले स्वागत आहे. मी आज आपल्याला कशी मदत करू शकतो?\n1. नवीन तक्रार नोंदवा\n2. तक्रारीची स्थिती तपासा\n3. निवारण मार्गदर्शन जाणून घ्या';
    }

    setMessages([
      {
        id: `reset-${Date.now()}`,
        role: 'assistant',
        content: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-5xl mx-auto p-2 sm:p-4">
      {/* Assistant Header & Context */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-3 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white ring-1 ring-emerald-500/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                AI Grievance Redressal Assistant
              </h2>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                Online & Connected to DB
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Natural Language Classification • Automated Department Routing • Fair Escalation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetChat}
            title="Start fresh conversation"
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Chat</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto bg-slate-50/70 border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`flex items-start gap-2.5 max-w-[92%] sm:max-w-[85%] ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-semibold ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-blue-700 border border-slate-200 shadow-xs'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className="flex flex-col">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs whitespace-pre-wrap'
                  }`}
                >
                  {msg.content}
                </div>

                <span
                  className={`text-[10px] text-slate-400 mt-1 px-1 ${
                    msg.role === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  {msg.timestamp}
                </span>

                {/* Inline Grievance Draft Card for Confirmation (Step 5 of workflow) */}
                {msg.draft && (
                  <div className="mt-3 bg-white border-2 border-blue-200 rounded-2xl p-4 shadow-md max-w-xl animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                          {t.draftTitle}
                        </h4>
                      </div>
                      <span className="text-[10px] font-semibold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        Confirmation Required
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-2 mb-3">
                      {t.draftNotice}
                    </p>

                    <div className="space-y-2.5 text-xs">
                      <div>
                        <span className="text-slate-400 text-[11px] font-medium block">Title / Subject:</span>
                        <span className="font-semibold text-slate-900">{msg.draft.title}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                          <span className="text-slate-400 text-[10px] block">Category:</span>
                          <span className="font-semibold text-blue-700">{msg.draft.category}</span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                          <span className="text-slate-400 text-[10px] block">Priority:</span>
                          <span className={`font-semibold ${
                            msg.draft.priority === 'Urgent' ? 'text-rose-600' : 'text-slate-700'
                          }`}>
                            {msg.draft.priority}
                          </span>
                        </div>
                      </div>

                      <div className="bg-blue-50/60 p-2.5 rounded-lg border border-blue-100">
                        <span className="text-slate-500 text-[10px] block font-medium">Assigned Department Desk:</span>
                        <span className="font-semibold text-blue-900">{msg.draft.department}</span>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <span className="text-slate-400 text-[10px] block">Concise Summary:</span>
                        <span className="text-slate-700 italic">"{msg.draft.summary}"</span>
                      </div>

                      {/* Optional Complainant info before DB commit */}
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <label className="text-slate-600 font-medium">Complainant Details (Optional):</label>
                          <label className="flex items-center gap-1.5 cursor-pointer text-slate-600">
                            <input
                              type="checkbox"
                              checked={isAnonymous}
                              onChange={(e) => setIsAnonymous(e.target.checked)}
                              className="rounded-sm text-blue-600"
                            />
                            <span>File Anonymously</span>
                          </label>
                        </div>

                        {!isAnonymous && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Your Name (e.g. Rahul Sharma)"
                              value={draftUserName}
                              onChange={(e) => setDraftUserName(e.target.value)}
                              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 focus:outline-blue-500"
                            />
                            <input
                              type="text"
                              placeholder="Email or Mobile (optional)"
                              value={draftContact}
                              onChange={(e) => setDraftContact(e.target.value)}
                              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 focus:outline-blue-500"
                            />
                          </div>
                        )}
                      </div>

                      {/* Submit to DB Action */}
                      <button
                        onClick={() => handleConfirmSubmission(msg.id, msg.draft!)}
                        disabled={submittingDraft}
                        className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md shadow-blue-500/20 text-xs transition-all disabled:opacity-50"
                      >
                        {submittingDraft ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Registering in Grievance Database...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{t.confirmAndSubmit}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Confirmed Ticket Reference Card */}
                {msg.confirmedId && (
                  <div className="mt-3 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-4 shadow-sm max-w-xl">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-emerald-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span className="font-bold text-xs sm:text-sm text-emerald-950">
                          {t.submissionSuccess}
                        </span>
                      </div>
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ACTIVE IN DB
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-emerald-200 flex items-center justify-between my-2">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">
                          {t.complaintIdLabel}
                        </span>
                        <span className="text-base font-mono font-bold text-emerald-700">
                          {msg.confirmedId}
                        </span>
                      </div>

                      <button
                        onClick={() => copyToClipboard(msg.confirmedId!)}
                        className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      >
                        {copiedId === msg.confirmedId ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy ID</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        onClick={() => onNavigateToTrack(msg.confirmedId!)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3 rounded-xl shadow-xs transition-colors"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{t.trackThisComplaint}</span>
                      </button>

                      <button
                        onClick={async () => {
                          try {
                            const res = await fetch(`/api/grievances/${msg.confirmedId}`);
                            const data = await res.json();
                            if (data.data) onOpenReceipt(data.data);
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold py-2 px-3 rounded-xl transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-600" />
                        <span>{t.downloadReceipt}</span>
                      </button>
                    </div>

                    {/* Step 8 Feedback Widget */}
                    <div className="mt-3 pt-3 border-t border-emerald-200/80">
                      {feedbackSubmitted[msg.confirmedId] ? (
                        <p className="text-xs text-emerald-800 font-medium text-center">
                          ✓ {t.feedbackThanks}
                        </p>
                      ) : (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                          <span className="text-slate-700 font-medium text-[11px]">
                            {t.feedbackQuestion}
                          </span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => {
                                  setFeedbackRating((prev) => ({ ...prev, [msg.confirmedId!]: star }));
                                  handleFeedback(msg.confirmedId!, star, true);
                                }}
                                className="p-1 hover:scale-110 transition-transform"
                              >
                                <Star
                                  className={`w-4 h-4 ${
                                    (feedbackRating[msg.confirmedId!] || 0) >= star
                                      ? 'text-amber-500 fill-amber-500'
                                      : 'text-slate-300'
                                  }`}
                                />
                              </button>
                            ))}
                            <button
                              onClick={() => handleFeedback(msg.confirmedId!, 5, true)}
                              className="ml-2 px-2 py-1 bg-emerald-600 text-white rounded-md text-[10px] font-semibold hover:bg-emerald-700"
                            >
                              Helpful 👍
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 px-4 py-2.5 rounded-2xl w-fit shadow-xs">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>Analyzing grievance details and categorizing department...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* CIE Quick Demonstration Buttons (Matches prompt CIE test scenarios) */}
      <div className="my-2 flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
          CIE Demo Prompts:
        </span>
        <button
          onClick={() => handleSendMessage('I want to register a complaint about a college issue. My 6th-semester revaluation results have been delayed for 45 days and my company onboarding is stalled.')}
          className="bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 px-2.5 py-1 rounded-lg transition-colors text-[11px] shrink-0 font-medium"
        >
          🎓 College Marksheet Issue
        </button>
        <button
          onClick={() => handleSendMessage('Contaminated brown tap water supply in Sector 4 Ward 12 for 3 days; children falling sick due to pipeline leak.')}
          className="bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 px-2.5 py-1 rounded-lg transition-colors text-[11px] shrink-0 font-medium"
        >
          💧 Water Contamination (Urgent)
        </button>
        <button
          onClick={() => handleSendMessage('Track status of my complaint ID GRV-2026-1042')}
          className="bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 px-2.5 py-1 rounded-lg transition-colors text-[11px] shrink-0 font-medium"
        >
          🔍 Track ID: GRV-2026-1042
        </button>
        <button
          onClick={() => handleSendMessage('What are the escalation procedures if the bank does not reverse an unauthorized ATM debit?')}
          className="bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-200 px-2.5 py-1 rounded-lg transition-colors text-[11px] shrink-0 font-medium"
        >
          🏦 Banking Escalation Guidance
        </button>
      </div>

      {/* Input Form Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm flex items-center gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={t.inputPlaceholder}
          disabled={isLoading}
          className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
        />

        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white p-2.5 sm:px-4 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <span className="hidden sm:inline">{t.send}</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
