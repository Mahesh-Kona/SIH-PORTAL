import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { apiGet, apiSend } from '../api';
import { ArrowLeft, Star, Save, Users, BarChart3, MessageSquare, Search } from 'lucide-react';

export default function EvaluationPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const { currentUser, currentJuryInfo } = useData();

  type AssignedTeam = {
    team_id: string;
    team_name: string;
    leader_name: string;
    leader_id?: string;
    slides_link: string;
    evaluated: number;
    problem_id: number;
    avg_score?: number | null;
  };

  const [searchTeamId, setSearchTeamId] = useState('');
  const [assignedTeams, setAssignedTeams] = useState<AssignedTeam[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(teamId || null);
  const [evaluation, setEvaluation] = useState({
    pptDesign: 0,
    idea: 0,
    pitching: 0,
    projectImpact: 0,
    remarks: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);

  const team = assignedTeams.find(t => t.team_id === selectedTeam);
  const currentJuryId = currentUser || '';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load assigned teams for this jury
  useEffect(() => {
    const load = async () => {
      if (!currentJuryId) return;
      setLoading(true);
      setError('');
      try {
        const list: AssignedTeam[] = await apiGet(`/jury/${encodeURIComponent(currentJuryId)}/assigned-teams`);
        const visible = list.filter(t => Number(t.evaluated) === 0);
        setAssignedTeams(visible);
        if (teamId && visible.some(t => t.team_id === teamId)) {
          setSelectedTeam(teamId);
        } else if (!teamId && visible.length) {
          setSelectedTeam(visible[0].team_id);
        }
      } catch (e: any) {
        setError(e.message || 'Failed to load assigned teams');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentJuryId]);

  // Filter teams based on search
  const filteredTeams = assignedTeams.filter(team => 
    team.team_id.toLowerCase().includes(searchTeamId.toLowerCase()) ||
    team.team_name.toLowerCase().includes(searchTeamId.toLowerCase())
  );

  useEffect(() => {
    setEvaluation({
      pptDesign: 0,
      idea: 0,
      pitching: 0,
      projectImpact: 0,
      remarks: ''
    });
    setSaveStatus(null);
  }, [selectedTeam]);

  const handleSave = async () => {
    if (!selectedTeam || evaluation.pptDesign === 0 || evaluation.idea === 0 || evaluation.pitching === 0 || evaluation.projectImpact === 0) {
      setSaveStatus('error');
      return;
    }

    setIsSaving(true);
    setSaveStatus(null);

    try {
      await apiSend('/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team_id: selectedTeam,
          jury_id: currentJuryId,
          ppt_design: evaluation.pptDesign,
          idea: evaluation.idea,
          pitching: evaluation.pitching,
          project_impact: evaluation.projectImpact,
          remarks: evaluation.remarks || ''
        })
      });
      setSaveStatus('success');
      // Remove from list and select next
      setAssignedTeams(prev => prev.filter(t => t.team_id !== selectedTeam));
      setSelectedTeam(prev => {
        const remaining = assignedTeams.filter(t => t.team_id !== (prev || ''));
        return remaining.length ? remaining[0].team_id : null;
      });
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const renderStarRating = (value: number, onChange: (rating: number) => void, label: string) => {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => onChange(rating)}
              className={`p-2 rounded-lg transition-colors ${
                rating <= value
                  ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100'
                  : 'text-gray-300 hover:text-gray-400 hover:bg-gray-50'
              }`}
            >
              <Star className={`h-5 w-5 ${rating <= value ? 'fill-current' : ''}`} />
            </button>
          ))}
          <span className="ml-3 text-lg font-semibold text-gray-900">
            {value}/10
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Jury Evaluation Panel</h1>
              {currentJuryInfo && (
                <p className="text-gray-600">{currentJuryInfo.name} - {currentJuryInfo.department}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Team Selection Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Team</h2>
            
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Team ID..."
                  value={searchTeamId}
                  onChange={(e) => setSearchTeamId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Team List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredTeams.map((t) => {
                const isSelected = selectedTeam === t.team_id;
                
                return (
                  <button
                    key={t.team_id}
                    onClick={() => setSelectedTeam(t.team_id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm text-gray-900">{t.team_id}</div>
                        <div className="text-xs text-gray-600 truncate">{t.team_name}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
              {filteredTeams.length === 0 && (
                <div className="text-sm text-gray-500 p-3 text-center">No teams pending for you</div>
              )}
            </div>
          </div>
        </div>

        {/* Evaluation Form */}
        <div className="lg:col-span-2">
          {!team ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Team</h3>
              <p className="text-gray-500">Choose a team from the left panel to start evaluation</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{team.team_name}</h2>
                <p className="text-gray-600">Team ID: {team.team_id} | Leader: {team.leader_name}{team.leader_id ? ` (${team.leader_id})` : ''}</p>
              </div>

              {saveStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800">Evaluation saved successfully!</p>
                </div>
              )}

              {saveStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">Please provide scores for all criteria before saving.</p>
                </div>
              )}

              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
                {/* PPT Design */}
                {renderStarRating(
                  evaluation.pptDesign,
                  (rating) => setEvaluation(prev => ({ ...prev, pptDesign: rating })),
                  'PPT Design (1-10)'
                )}

                {/* Idea (Approach) */}
                {renderStarRating(
                  evaluation.idea,
                  (rating) => setEvaluation(prev => ({ ...prev, idea: rating })),
                  'Idea (Approach) (1-10)'
                )}

                {/* Pitching */}
                {renderStarRating(
                  evaluation.pitching,
                  (rating) => setEvaluation(prev => ({ ...prev, pitching: rating })),
                  'Pitching (1-10)'
                )}

                {/* Project Impact */}
                {renderStarRating(
                  evaluation.projectImpact,
                  (rating) => setEvaluation(prev => ({ ...prev, projectImpact: rating })),
                  'Project Impact (1-10)'
                )}

                {/* Remarks */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                    <MessageSquare className="h-4 w-4" />
                    <span>Remarks (Optional)</span>
                  </label>
                  <textarea
                    value={evaluation.remarks}
                    onChange={(e) => setEvaluation(prev => ({ ...prev, remarks: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Provide additional feedback or remarks..."
                  />
                </div>

                {/* Save Button */}
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                    isSaving
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                  } text-white`}
                >
                  <Save className="h-4 w-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Evaluation'}</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Team Summary */}
        <div className="lg:col-span-1">
          {team && (
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Evaluation Summary
              </h3>

              {/* Open Slides */}
              <div className="mb-6">
                <button
                  onClick={() => window.open(team.slides_link, '_blank')}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  View Presentation
                </button>
              </div>

              {/* Aggregate score (if any) */}
              {typeof team.avg_score !== 'undefined' && team.avg_score !== null && (
                <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg text-center">
                  <div className="text-sm text-gray-600">Current Average</div>
                  <div className="text-2xl font-bold text-gray-900">{Number(team.avg_score).toFixed(1)}</div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="mt-6 space-y-2"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}