import React, { useState, useEffect } from 'react';
import { Grievance, StatsData } from '../types';
import { 
  LayoutDashboard, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  User, 
  Building, 
  Star, 
  Printer, 
  Eye, 
  Edit3, 
  RefreshCw,
  TrendingUp,
  Award,
  ChevronRight,
  X
} from 'lucide-react';

interface Props {
  onOpenReceipt: (grievance: Grievance) => void;
  onInspectGrievance: (id: string) => void;
}

export const OfficerDashboard: React.FC<Props> = ({
  onOpenReceipt,
  onInspectGrievance
}) => {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Status management modal
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [newStatus, setNewStatus] = useState<string>('In Investigation');
  const [officerNote, setOfficerNote] = useState('');
  const [officerName, setOfficerName] = useState('Nodal Grievance Officer');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [grievancesRes, statsRes] = await Promise.all([
        fetch(`/api/grievances?category=${categoryFilter}&priority=${priorityFilter}&status=${statusFilter}&search=${encodeURIComponent(search)}`),
        fetch('/api/stats')
      ]);

      const gData = await grievancesRes.json();
      const sData = await statsRes.json();

      if (gData.success) setGrievances(gData.data);
      if (sData.success) setStats(sData.data);
    } catch (err) {
      console.error('Error fetching dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryFilter, priorityFilter, statusFilter]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrievance) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/grievances/${selectedGrievance.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          note: officerNote.trim() || `Status updated to ${newStatus} by ${officerName}`,
          officer: officerName
        })
      });

      const data = await res.json();
      if (data.success) {
        setSelectedGrievance(null);
        setOfficerNote('');
        fetchData();
      }
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Department Grievance Officer Desk & Management Portal
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time administrative view of registered grievances, AI triage accuracy, investigation updates, and SLA tracking.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* KPI Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Lodged</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold text-slate-900">{stats.total}</span>
              <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-md">Live DB</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Grievances recorded</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Resolution Rate</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold text-emerald-600">{stats.resolutionRate}%</span>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                {stats.resolved} Resolved
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">{stats.pending} currently under active review</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Urgent Priority</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold text-rose-600">{stats.urgent}</span>
              <span className="text-xs text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded-md">High Alert</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Immediate intervention required</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Citizen Satisfaction</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-bold text-amber-500 flex items-center gap-1">
                {stats.avgSatisfaction}
                <Star className="w-4 h-4 fill-amber-500 inline" />
              </span>
              <span className="text-xs text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">Feedback</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Average rating across resolved cases</p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchData()}
            placeholder="Search by ID, title, complainant..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-blue-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-blue-600"
          >
            <option value="All">All Categories</option>
            <option value="Education">Education</option>
            <option value="Public Services">Public Services</option>
            <option value="Banking">Banking</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Workplace Issues">Workplace Issues</option>
            <option value="Technical Problems">Technical Problems</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-blue-600"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="Medium">Medium</option>
            <option value="Standard">Standard</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-blue-600"
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="In Investigation">In Investigation</option>
            <option value="Assigned to Officer">Assigned to Officer</option>
            <option value="Resolved">Resolved</option>
          </select>

          <button
            onClick={fetchData}
            className="px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Table of Grievances */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-4">Complaint ID</th>
                <th className="py-3 px-4">Subject & Complainant</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grievances.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No grievances found matching selected filters.
                  </td>
                </tr>
              ) : (
                grievances.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {g.id}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900 truncate" title={g.title}>
                        {g.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {g.userName} • {new Date(g.submissionDate).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-medium">
                        {g.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        g.priority === 'Urgent'
                          ? 'bg-rose-50 border-rose-200 text-rose-700'
                          : g.priority === 'Medium'
                          ? 'bg-amber-50 border-amber-200 text-amber-700'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      }`}>
                        {g.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        g.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : g.status === 'In Investigation'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {g.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {g.feedback ? (
                        <div className="flex items-center gap-1 text-amber-500 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span>{g.feedback.rating}/5</span>
                        </div>
                      ) : (
                        <span className="text-slate-300 text-[11px]">Pending</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedGrievance(g);
                            setNewStatus(g.status);
                          }}
                          title="Update Status & Officer Remarks"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onInspectGrievance(g.id)}
                          title="Track in Citizen View"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onOpenReceipt(g)}
                          title="Official Acknowledgement Slip"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Officer Status Update Modal */}
      {selectedGrievance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-400" />
                <h3 className="font-semibold text-sm">Update Grievance Status & Audit Trail</h3>
              </div>
              <button
                onClick={() => setSelectedGrievance(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="p-6 space-y-4 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold uppercase text-[10px]">Complaint Reference:</span>
                <span className="font-mono font-bold text-sm text-blue-700">{selectedGrievance.id}</span>
                <p className="font-semibold text-slate-800 mt-1">{selectedGrievance.title}</p>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Advance Status To:</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-semibold focus:outline-blue-600"
                >
                  <option value="Submitted">Submitted (Initial lodging)</option>
                  <option value="Under Review">Under Review (Scrutiny by Triage)</option>
                  <option value="In Investigation">In Investigation (Requisitioning logs/files)</option>
                  <option value="Assigned to Officer">Assigned to Officer (Field squad on site)</option>
                  <option value="Resolved">Resolved (Resolution confirmed & closed)</option>
                  <option value="Escalated">Escalated (Referred to statutory ombudsman)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Officer Name / Designation:</label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-blue-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Official Action Remark / Audit Note *:</label>
                <textarea
                  rows={3}
                  value={officerNote}
                  onChange={(e) => setOfficerNote(e.target.value)}
                  placeholder="Detail the steps taken, documents requested, or settlement terms..."
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedGrievance(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center gap-1.5"
                >
                  {isUpdating ? 'Recording...' : 'Commit Status Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
