import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGet } from '../api';
import { Play, Pause, RotateCcw, SkipForward, ArrowLeft, Clock } from 'lucide-react';

type Submission = { id: number; team_id: string; problem_id: number; slides_link: string; created_at: string };
type TeamInfo = { team_id: string; team_name: string; leader_name: string };

export default function PresentationView() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [team, setTeam] = useState<TeamInfo | null>(null);
  const [presentationLink, setPresentationLink] = useState('');
  
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'presentation' | 'qna'>('presentation');
  const [timeLeft, setTimeLeft] = useState(4 * 60); // 4 minutes in seconds
  
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const list: Submission[] = await apiGet(`/submissions/${teamId}`);
        if (!list.length) throw new Error('No submissions found for this team');
        const latest = list[0];
        setPresentationLink(latest.slides_link);
        // Fetch team fields via joined list endpoint filtered by teamId
        // Reuse list element fields through another call to /api/submissions?search=
        const metaList = await apiGet(`/submissions?search=${encodeURIComponent(teamId || '')}`);
        const m = (metaList as any[]).find(r => r.team_id === teamId);
        if (m) setTeam({ team_id: m.team_id, team_name: m.team_name, leader_name: m.leader_name });
      } catch (e: any) {
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    if (teamId) load();
  }, [teamId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Auto-switch to Q&A phase when presentation time ends
            if (currentPhase === 'presentation') {
              setCurrentPhase('qna');
              return 4 * 60; // Reset to 4 minutes for Q&A
            } else {
              // End of Q&A phase
              setIsRunning(false);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, currentPhase]);

  if (!loading && (!team || !presentationLink)) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Not found</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <button
          onClick={() => navigate('/admin')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 30) return 'bg-red-600 text-white animate-pulse'; // Last 30 seconds
    if (timeLeft <= 60) return 'bg-red-500 text-white'; // Last minute
    return 'bg-green-600 text-white'; // Safe time
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentPhase('presentation');
    setTimeLeft(4 * 60);
  };

  const handleSkipToQnA = () => {
    setCurrentPhase('qna');
    setTimeLeft(4 * 60);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{team?.team_name || teamId}</h1>
              {team?.leader_name && <p className="text-gray-600">Team Leader: {team.leader_name}</p>}
            </div>
          </div>
          
          <button
            onClick={() => navigate(`/evaluation/${teamId}`)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go to Evaluation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Timer Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Timer Control
            </h2>
            
            {/* Current Phase */}
            <div className="mb-4">
              <div className="text-sm text-gray-500 mb-2">Current Phase</div>
              <div className={`px-3 py-2 rounded-lg text-center font-semibold ${
                currentPhase === 'presentation' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {currentPhase === 'presentation' ? 'Presentation' : 'Q&A Session'}
              </div>
            </div>

            {/* Timer Display */}
            <div className={`text-center p-6 rounded-xl mb-4 ${getTimerColor()}`}>
              <div className="text-3xl font-bold font-mono">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm opacity-90 mt-1">
                {currentPhase === 'presentation' ? 'Presentation Time' : 'Q&A Time'}
              </div>
            </div>

            {/* Control Buttons */}
            <div className="space-y-3">
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  <Play className="h-4 w-4" />
                  <span>Start Timer</span>
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
                >
                  <Pause className="h-4 w-4" />
                  <span>Pause Timer</span>
                </button>
              )}

              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>

              {currentPhase === 'presentation' && (
                <button
                  onClick={handleSkipToQnA}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <SkipForward className="h-4 w-4" />
                  <span>Skip to Q&A</span>
                </button>
              )}
            </div>

            {/* Phase Information */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Phase Guidelines</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Presentation:</span>
                  <span className="font-medium">4 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Q&A Session:</span>
                  <span className="font-medium">4 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Presentation Display */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Presentation</h2>
            
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              {!loading && (
              <iframe
                src={(() => {
                  let embedUrl = presentationLink;
                  
                  // Extract the presentation ID from the URL
                  const match = embedUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
                  if (match) {
                    const presentationId = match[1];
                    return `https://docs.google.com/presentation/d/${presentationId}/embed?start=false&loop=false&delayms=3000`;
                  }
                  
                  // Fallback: if already an embed URL, use as is
                  if (embedUrl.includes('/embed')) {
                    return embedUrl;
                  }
                  
                  // Fallback: simple replace
                  return embedUrl.replace('/edit', '/embed') + '?start=false&loop=false&delayms=3000';
                })()}
                className="w-full h-full border-0"
                allowFullScreen={true}
                mozallowfullscreen="true"
                webkitallowfullscreen="true"
                title={`${team?.team_name || teamId} Presentation`}
              />
              )}
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Presentation Instructions</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use the timer on the left to track presentation and Q&A time</li>
                <li>• The timer will automatically switch from presentation to Q&A phase</li>
                <li>• Timer turns red when time is running low</li>
                <li>• You can skip directly to Q&A if presentation finishes early</li>
                <li>• Use the evaluation button to score this presentation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}