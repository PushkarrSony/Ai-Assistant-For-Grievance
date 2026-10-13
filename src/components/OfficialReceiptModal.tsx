import React from 'react';
import { Grievance } from '../types';
import { Printer, X, ShieldCheck, CheckCircle2, Building, Calendar, User, AlertCircle } from 'lucide-react';

interface Props {
  grievance: Grievance | null;
  onClose: () => void;
}

export const OfficialReceiptModal: React.FC<Props> = ({ grievance, onClose }) => {
  if (!grievance) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white text-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm">Official Grievance Acknowledgement Slip</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-8 space-tight" id="printable-slip">
          {/* Official Seal / National Portal Header */}
          <div className="text-center border-b pb-5 mb-5 border-slate-200">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 border border-slate-300 text-slate-800 mb-2">
              <Building className="w-6 h-6 text-slate-700" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              CENTRALIZED GRIEVANCE REDRESSAL SYSTEM
            </h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">
              Public & Institutional Redressal Directorate • AI Verification Cell
            </p>
            <div className="mt-3 inline-block bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-1 rounded-full font-medium">
              Official Electronic Acknowledgement
            </div>
          </div>

          {/* Reference Meta Box */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
            <div>
              <span className="text-xs text-slate-500 uppercase block font-semibold">Complaint Reference ID</span>
              <span className="text-lg font-mono font-bold text-blue-700">{grievance.id}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase block font-semibold">Filing Date & Time</span>
              <span className="text-sm font-medium text-slate-800">
                {new Date(grievance.submissionDate).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase block font-semibold">Complainant Name</span>
              <span className="text-sm font-medium text-slate-800">{grievance.userName || 'Anonymous'}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase block font-semibold">Current System Status</span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                <CheckCircle2 className="w-3 h-3" />
                {grievance.status}
              </span>
            </div>
          </div>

          {/* Complaint Details */}
          <div className="space-y-4 text-sm mb-6">
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Subject / Grievance Title</h4>
              <p className="font-semibold text-slate-900 text-base">{grievance.title}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Classified Category</h4>
                <p className="font-medium text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg inline-block text-xs border border-slate-200">
                  {grievance.category}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Assigned Priority</h4>
                <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold border ${
                  grievance.priority === 'Urgent'
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : grievance.priority === 'Medium'
                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}>
                  {grievance.priority}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Assigned Department / Authority</h4>
              <p className="font-medium text-slate-800 bg-blue-50/60 p-2.5 rounded-lg border border-blue-100 text-xs">
                {grievance.department}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">AI Verified Summary</h4>
              <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs leading-relaxed italic">
                "{grievance.summary}"
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Redressal & Escalation Procedure</h4>
              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                <div><strong className="text-slate-800">Tier 1:</strong> {grievance.escalationMatrix.level1}</div>
                <div><strong className="text-slate-800">Tier 2:</strong> {grievance.escalationMatrix.level2}</div>
                <div><strong className="text-slate-800">Tier 3 (Appellate):</strong> {grievance.escalationMatrix.level3}</div>
              </div>
            </div>
          </div>

          {/* Barcode & Notice Footer */}
          <div className="border-t border-slate-200 pt-5 flex items-center justify-between text-xs text-slate-500">
            <div>
              <div className="font-mono text-xs tracking-widest text-slate-400">||| | |||| | ||||| || ||| |||||||</div>
              <span className="font-mono text-[10px] text-slate-400">{grievance.id} • SECURE TOKEN</span>
              <p className="text-[11px] text-slate-500 mt-1 max-w-sm">
                This is a computer-generated acknowledgement receipt generated by the AI Grievance Redressal Assistant. No physical signature is required.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] block text-slate-400">Citizen Helpline</span>
              <span className="font-bold text-slate-700">1800-11-4000</span>
            </div>
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-medium hover:bg-slate-700 transition-colors"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
