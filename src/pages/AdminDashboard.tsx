import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, ExternalLink, Search, Trash2, CheckCircle2, ArrowUpDown, Layers } from 'lucide-react';
import { apiGet, apiSend } from '../api';

type SubmissionRow = {
  id: number;
  team_id: string;
  team_name: string;
  leader_name: string;
  leader_id: string;
  phone: string;
  problem_id: number;
  slides_link: string;
  presented: number;
  created_at: string;
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [groupByProblem, setGroupByProblem] = useState(false);

  const fetchRows = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      params.set('sort', 'problem_id');
      params.set('order', sortAsc ? 'asc' : 'desc');
      const data = await apiGet(`/submissions?${params.toString()}`);
      setRows(data as SubmissionRow[]);
    } catch (e: any) {
      setError(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortAsc]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRows();
  };

  const onMarkPresented = async (id: number) => {
    await apiSend(`/submissions/${id}/presented`, { method: 'PATCH' });
    fetchRows();
  };

  const onDelete = async (id: number) => {
    if (!confirm('Delete this submission?')) return;
    await apiSend(`/submissions/${id}`, { method: 'DELETE' });
    fetchRows();
  };

  const grouped = useMemo(() => {
    if (!groupByProblem) return { All: rows } as Record<string, SubmissionRow[]>;
    return rows.reduce((acc, r) => {
      const key = `Problem ${r.problem_id}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(r);
      return acc;
    }, {} as Record<string, SubmissionRow[]>);
  }, [rows, groupByProblem]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage team submissions and view evaluation summaries.</p>
        <div className="mt-4 flex items-center space-x-2">
          <button onClick={() => navigate('/admin/scores')} className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md">View Scores</button>
          <button onClick={() => navigate('/admin/juries')} className="px-3 py-2 text-sm bg-purple-600 text-white rounded-md">Manage Juries</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Submissions</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setSortAsc(s => !s)} className="px-3 py-2 text-sm border rounded-md flex items-center space-x-1">
                <ArrowUpDown className="h-4 w-4" />
                <span>Sort by Problem ID {sortAsc ? '↑' : '↓'}</span>
              </button>
              <button onClick={() => setGroupByProblem(g => !g)} className="px-3 py-2 text-sm border rounded-md flex items-center space-x-1">
                <Layers className="h-4 w-4" />
                <span>{groupByProblem ? 'Ungroup' : 'Group'} by Problem</span>
              </button>
            </div>
          </div>
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Team ID e.g., 001_SIH_RGUKTN_ID"
              className="w-full pl-10 pr-28 py-2 border rounded-md"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md">Search</button>
          </form>
          {error && <div className="text-sm text-red-600">{error}</div>}
        </div>

        <div className="divide-y">
          {loading && <div className="p-6 text-gray-500">Loading...</div>}
          {!loading && Object.entries(grouped).map(([group, list]) => (
            <div key={group}>
              {groupByProblem && (
                <div className="px-6 py-3 bg-gray-50 text-sm font-medium text-gray-700">{group} • {list.length} submissions</div>
              )}
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problem</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leader</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {list.length === 0 && (
                      <tr><td colSpan={7} className="px-6 py-6 text-center text-gray-500">No submissions</td></tr>
                    )}
                    {list.map(row => (
                      <tr key={row.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{row.problem_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.team_id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.team_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.leader_name} ({row.leader_id})</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(row.created_at).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="inline-flex items-center space-x-2">
                            <button
                              onClick={() => window.open(row.slides_link, '_blank')}
                              className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-gray-100 flex items-center space-x-1"
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span>Slides</span>
                            </button>
                            <button
                              onClick={() => navigate(`/presentation/${row.team_id}`)}
                              className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-gray-100 flex items-center space-x-1"
                            >
                              <FileText className="h-4 w-4" />
                              <span>Present</span>
                            </button>
                            <button
                              onClick={() => onMarkPresented(row.id)}
                              className={`px-3 py-1.5 ${row.presented ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-white border border-gray-200 text-gray-700'} rounded-md hover:bg-gray-100 flex items-center space-x-1`}
                              disabled={!!row.presented}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              <span>{row.presented ? 'Done' : 'Mark Done'}</span>
                            </button>
                            <button
                              onClick={() => onDelete(row.id)}
                              className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center space-x-1"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


