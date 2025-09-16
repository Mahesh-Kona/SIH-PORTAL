import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { LogOut, Trophy, Users, Upload, BarChart3 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { currentUser, currentUserRole, setCurrentUser, currentJuryInfo } = useData();
  const navigate = useNavigate();

  const handleLogout = () => {
    setCurrentUser(null, null);
    navigate('/');
  };

  const getUserRole = () => {
    if (currentUserRole === 'admin') return 'Administrator';
    if (currentUserRole === 'participant') return 'Participant';
    if (currentUserRole === 'jury' && currentUser?.startsWith('jury')) {
      return currentJuryInfo ? `${currentJuryInfo.name} (Jury ${currentUser.slice(-1)})` : `Jury ${currentUser.slice(-1)}`;
    }
    return 'User';
  };

  const getNavItems = () => {
    if (currentUserRole === 'admin') {
      return [
        { icon: BarChart3, label: 'Dashboard', path: '/admin' },
        { icon: BarChart3, label: 'Scores', path: '/admin/scores' }
      ];
    }
    if (currentUserRole === 'participant') {
      return [
        { icon: Upload, label: 'Upload Presentation', path: '/upload' }
      ];
    }
    if (currentUserRole === 'jury') {
      return [
        { icon: Users, label: 'Evaluate Teams', path: '/evaluation' }
      ];
    }
    return [];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-8 w-8 text-[#7b0000]" />
                <div>
                  <h1 className="text-xl font-bold text-[#7b0000]">Smart India Hackathon 2025</h1>
                  <p className="text-sm text-gray-600">Internal Evaluation Portal</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{getUserRole()}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      {getNavItems().length > 0 && (
        <nav className="bg-[#7b0000] shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {getNavItems().map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex items-center space-x-2 px-3 py-4 text-sm font-medium text-white hover:text-rose-100 transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}