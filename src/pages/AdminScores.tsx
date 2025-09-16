import React, { useState } from 'react';
import { apiSend } from '../api';
import { Shield, Lock, BarChart3, Download, Filter } from 'lucide-react';

export default function AdminScores() {
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<{ summary: any[]; perJury: any[] } | null>(null);
  const [topOnly, setTopOnly] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await apiSend('/admin/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds)
      });
      setData(res as any);
    } catch (e: any) {
      setError(e.message || 'Unauthorized');
    } finally {
      setLoading(false);
    }
  };

  if (!data) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6">
        <div className="text-center mb-4">
          <div className="flex justify-center mb-2"><Shield className="h-10 w-10 text-blue-600" /></div>
          <h1 className="text-xl font-bold text-gray-900">Admin Scores Access</h1>
          <p className="text-gray-600">Re-authenticate to view jury scores</p>
        </div>
        {error && <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">{error}</div>}
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1"><Lock className="h-4 w-4" /><span>Username</span></label>
            <input className="w-full px-3 py-2 border rounded" value={creds.username} onChange={(e) => setCreds({ ...creds, username: e.target.value })} />
          </div>
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1"><Lock className="h-4 w-4" /><span>Password</span></label>
            <input type="password" className="w-full px-3 py-2 border rounded" value={creds.password} onChange={(e) => setCreds({ ...creds, password: e.target.value })} />
          </div>
          <button disabled={loading} className={`w-full py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>{loading ? 'Verifying...' : 'View Scores'}</button>
        </form>
      </div>
    );
  }

  const sorted = [...data.summary].sort((a: any, b: any) => (Number(b.avg_score || 0) - Number(a.avg_score || 0)));
  const rows = topOnly ? sorted.slice(0, 50) : sorted;

  const downloadCsv = () => {
    const header = ['Team ID','Team Name','Problem','Avg Score','Evaluations'];
    const lines = [header.join(',')].concat(
      rows.map((r: any) => [r.team_id, r.team_name, r.problem_id, (r.avg_score? Number(r.avg_score).toFixed(2):''), r.evaluations_count].map((v: any) => `"${String(v).replace(/"/g,'""')}"`).join(','))
    );
    const blob = new Blob(["\ufeff" + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = topOnly ? 'sih_scores_top50.csv' : 'sih_scores_all.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-3">
        <BarChart3 className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Jury Scores</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <div className="px-6 pt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTopOnly(v => !v)}
              className={`inline-flex items-center space-x-2 px-3 py-2 text-sm rounded border ${topOnly ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              <Filter className="h-4 w-4" />
              <span>{topOnly ? 'Showing Top 50' : 'Show Top 50 by Avg Score'}</span>
            </button>
            <button
              onClick={downloadCsv}
              className="inline-flex items-center space-x-2 px-3 py-2 text-sm rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Team ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Team Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Problem</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Avg Score</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Evaluations</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((r: any) => (
              <tr key={`${r.team_id}-${r.problem_id}`} className="hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-medium">{r.team_id}</td>
                <td className="px-6 py-3 text-sm">{r.team_name}</td>
                <td className="px-6 py-3 text-sm">{r.problem_id}</td>
                <td className="px-6 py-3 text-sm">{r.avg_score ? Number(r.avg_score).toFixed(1) : '-'}</td>
                <td className="px-6 py-3 text-sm">{r.evaluations_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-3">Per-Jury Scores</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {data.perJury.map((e: any, idx: number) => (
            <div key={idx} className="p-3 border rounded">
              <div className="text-sm text-gray-600">{e.team_id}</div>
              <div className="text-sm font-medium">Jury: {e.jury_id}</div>
              <div className="text-sm">Score: {Number(e.total_score).toFixed(1)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


