import React, { useEffect, useState } from 'react';
import { apiGet, apiSend } from '../api';
import { Users, Plus, Trash2, UploadCloud, FileText, Save, Loader2, ListChecks } from 'lucide-react';

type Jury = { jury_id: string; name: string; email?: string | null; department: string };

export default function AdminJuries() {
  const [juries, setJuries] = useState<Jury[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<Jury & { password?: string }>({ jury_id: '', name: '', email: '', department: '', password: '' });
  const [saving, setSaving] = useState(false);

  const [csvText, setCsvText] = useState('team_id,jury_id\n');
  const [importing, setImporting] = useState(false);

  // Assignment editor state
  const [selectedJury, setSelectedJury] = useState<string>('');
  const [teamSearch, setTeamSearch] = useState('');
  const [teamIds, setTeamIds] = useState<string[]>([]);
  const [assignedTeamIds, setAssignedTeamIds] = useState<string[]>([]);
  const [savingAssign, setSavingAssign] = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const list: Jury[] = await apiGet('/admin/juries');
      setJuries(list);
    } catch (e: any) {
      setError(e.message || 'Failed to load juries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Load team ids for assignment UI lazily when needed
  const loadTeams = async () => {
    try {
      const data = await apiGet('/submissions');
      const unique: string[] = Array.from(new Set((data as any[]).map(r => r.team_id)));
      setTeamIds(unique);
    } catch {}
  };

  const loadAssignments = async (jury_id: string) => {
    try {
      const ids: string[] = await apiGet(`/admin/assignments/${encodeURIComponent(jury_id)}`);
      setAssignedTeamIds(ids);
    } catch {}
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await apiSend('/admin/juries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setForm({ jury_id: '', name: '', email: '', department: '', password: '' });
      await load();
    } catch (e: any) {
      setError(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (jury_id: string) => {
    if (!confirm('Delete this jury?')) return;
    try {
      await apiSend(`/admin/juries/${encodeURIComponent(jury_id)}`, { method: 'DELETE' });
      await load();
    } catch (e: any) {
      setError(e.message || 'Failed to delete');
    }
  };

  const onPickJury = async (jury_id: string) => {
    setSelectedJury(jury_id);
    await loadTeams();
    await loadAssignments(jury_id);
  };

  const toggleAssign = (tid: string) => {
    setAssignedTeamIds(prev => prev.includes(tid) ? prev.filter(x => x !== tid) : [...prev, tid]);
  };

  const saveAssignments = async () => {
    if (!selectedJury) return;
    setSavingAssign(true);
    setError('');
    try {
      await apiSend(`/admin/assignments/${encodeURIComponent(selectedJury)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_ids: assignedTeamIds })
      });
      alert('Assignments saved');
    } catch (e: any) {
      setError(e.message || 'Failed to save assignments');
    } finally {
      setSavingAssign(false);
    }
  };

  const onImportCsv = async () => {
    setImporting(true);
    setError('');
    try {
      await apiSend('/admin/jury-mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv: csvText })
      });
      alert('Mapping imported');
    } catch (e: any) {
      setError(e.message || 'Failed to import mapping');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-6 w-6 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">Manage Juries</h1>
        </div>
        {loading && <div className="text-sm text-gray-500 flex items-center"><Loader2 className="h-4 w-4 mr-2 animate-spin" />Loading...</div>}
      </div>

      {error && <div className="max-w-4xl mx-auto p-3 bg-red-50 border border-red-200 text-red-800 rounded">{error}</div>}

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Jury Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><Plus className="h-4 w-4 mr-2" />Add / Update Jury</h2>
          <form onSubmit={onSave} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jury ID</label>
              <input value={form.jury_id} onChange={(e) => setForm({ ...form, jury_id: e.target.value })} className="w-full px-3 py-2 border rounded" placeholder="e.g., CSE01" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded" placeholder="Full name" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
              <input type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border rounded" placeholder="name@org.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full px-3 py-2 border rounded" placeholder="e.g., CSE" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password (set/reset)</label>
              <input type="password" value={form.password || ''} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-3 py-2 border rounded" placeholder="leave blank to keep existing" />
            </div>
            <button disabled={saving} className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded text-white ${saving ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'}`}>
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Jury'}</span>
            </button>
          </form>
        </div>

        {/* CSV Mapping Import */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><UploadCloud className="h-4 w-4 mr-2" />Import Team–Jury Mapping (CSV)</h2>
          <div className="text-sm text-gray-600 mb-2">Format: <code>team_id,jury_id</code> one pair per line, header required.</div>
          <textarea value={csvText} onChange={(e) => setCsvText(e.target.value)} rows={10} className="w-full px-3 py-2 border rounded font-mono text-sm" placeholder={'team_id,jury_id\n001_SIH_RGUKTN_ABC,CSE01'} />
          <div className="mt-3 flex items-center space-x-2">
            <button onClick={onImportCsv} disabled={importing} className={`px-3 py-2 rounded text-white ${importing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {importing ? 'Importing...' : 'Import Mapping'}
            </button>
          </div>
          <div className="mt-3 text-xs text-gray-500 flex items-center"><FileText className="h-3 w-3 mr-1" />You can paste from Excel or a CSV file.</div>
        </div>
      </div>

      {/* Interactive Assignment Editor */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><ListChecks className="h-4 w-4 mr-2" />Map Juries to Presentations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Jury</label>
            <select value={selectedJury} onChange={(e) => onPickJury(e.target.value)} className="w-full px-3 py-2 border rounded">
              <option value="">-- pick jury --</option>
              {juries.map(j => (
                <option key={j.jury_id} value={j.jury_id}>{j.jury_id} - {j.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Team ID</label>
            <input value={teamSearch} onChange={(e) => setTeamSearch(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="filter team ids..." />
          </div>
        </div>
        {selectedJury && (
          <div className="mt-4">
            <div className="max-h-64 overflow-y-auto border rounded">
              <div className="divide-y">
                {teamIds.filter(t => t.toLowerCase().includes(teamSearch.toLowerCase())).map(tid => (
                  <label key={tid} className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer">
                    <span className="text-sm font-mono">{tid}</span>
                    <input type="checkbox" checked={assignedTeamIds.includes(tid)} onChange={() => toggleAssign(tid)} />
                  </label>
                ))}
                {teamIds.length === 0 && (
                  <div className="px-3 py-3 text-sm text-gray-500">No submissions yet</div>
                )}
              </div>
            </div>
            <div className="mt-3 text-right">
              <button onClick={saveAssignments} disabled={savingAssign} className={`px-4 py-2 rounded text-white ${savingAssign ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}>{savingAssign ? 'Saving...' : 'Save Assignments'}</button>
            </div>
          </div>
        )}
      </div>

      {/* List of Juries */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Jury ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Department</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {juries.map(j => (
              <tr key={j.jury_id} className="hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-medium">{j.jury_id}</td>
                <td className="px-6 py-3 text-sm">{j.name}</td>
                <td className="px-6 py-3 text-sm">{j.email || '-'}</td>
                <td className="px-6 py-3 text-sm">{j.department}</td>
                <td className="px-6 py-3 text-sm text-right">
                  <div className="inline-flex items-center space-x-2">
                    <button onClick={() => setForm({ jury_id: j.jury_id, name: j.name, email: j.email || '', department: j.department, password: '' })} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-gray-100">Edit</button>
                    <button onClick={() => onDelete(j.jury_id)} className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center space-x-1"><Trash2 className="h-4 w-4" /><span>Delete</span></button>
                  </div>
                </td>
              </tr>
            ))}
            {juries.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-6 text-center text-gray-500">No juries yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


