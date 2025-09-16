// import React, { useState } from 'react';
// import { useData } from '../context/DataContext';
// import { apiSend } from '../api';
// import { Trophy, Users, Shield, UserCheck, Lock, Mail, User } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// export default function LoginPage() {
//   const { setCurrentUser, login } = useData();
//   const navigate = useNavigate();
//   const [loginType, setLoginType] = useState<'participant' | 'admin' | 'jury' | null>(null);
//   const [credentials, setCredentials] = useState({ username: '', password: '' });
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleParticipantLogin = () => {
//     setCurrentUser('participant', 'participant');
//     navigate('/upload');
//   };

//   const handleCredentialLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);

//     try {
//       if (loginType === 'jury') {
//         const res = await apiSend('/jury/login', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ email: credentials.username, password: credentials.password })
//         });
//         // res: { jury_id, name, department }
//         setCurrentUser(res.jury_id, 'jury');
//         navigate('/evaluation');
//       } else if (loginType === 'admin') {
//         const result = login(credentials.username, credentials.password);
//         if (result.success && result.user && result.role) {
//           setCurrentUser(result.user, result.role);
//           navigate('/admin');
//         } else {
//           setError('Invalid credentials. Please check your username/email and password.');
//         }
//       }
//     } catch (err) {
//       setError('Login failed. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const resetLogin = () => {
//     setLoginType(null);
//     setCredentials({ username: '', password: '' });
//     setError('');
//   };

//   if (loginType === null) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//         <div className="max-w-4xl w-full">
//           {/* Header */}
//           <div className="text-center mb-12">
//             <div className="flex items-center justify-center space-x-4 mb-6">
//               <Trophy className="h-12 w-12 text-blue-700" />
//               <div className="text-left">
//                 <h1 className="text-4xl font-bold text-gray-900">Smart India Hackathon</h1>
//                 <p className="text-2xl text-blue-600 font-semibold">2025</p>
//               </div>
//             </div>
//             <div className="max-w-2xl mx-auto">
//               <h2 className="text-2xl font-semibold text-gray-800 mb-3">Internal Evaluation Portal</h2>
//               <p className="text-gray-600 text-lg">
//                 Welcome to the official evaluation platform for Smart India Hackathon 2025. 
//                 Choose your access type to continue.
//               </p>
//             </div>
//           </div>

//           {/* Access Type Selection */}
//           <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
//             <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Select Access Type</h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {/* Participant Access */}
//               <button
//                 onClick={() => setLoginType('participant')}
//                 className="group p-8 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition text-center bg-white"
//               >
//                 <div className="flex justify-center mb-4">
//                   <Users className="h-8 w-8 text-green-700" />
//                 </div>
//                 <h4 className="text-xl font-bold text-gray-900 mb-2">Team Participant</h4>
//                 <p className="text-gray-600 mb-4">Upload your team presentation and project details</p>
//                 <div className="inline-flex items-center px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">No Login Required</div>
//               </button>

//               {/* Admin Access */}
//               <button
//                 onClick={() => setLoginType('admin')}
//                 className="group p-8 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition text-center bg-white"
//               >
//                 <div className="flex justify-center mb-4">
//                   <Shield className="h-8 w-8 text-blue-700" />
//                 </div>
//                 <h4 className="text-xl font-bold text-gray-900 mb-2">Administrator</h4>
//                 <p className="text-gray-600 mb-4">Manage presentations, evaluations, and system settings</p>
//                 <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">Secure Login</div>
//               </button>

//               {/* Jury Access */}
//               <button
//                 onClick={() => setLoginType('jury')}
//                 className="group p-8 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition text-center bg-white"
//               >
//                 <div className="flex justify-center mb-4">
//                   <UserCheck className="h-8 w-8 text-purple-700" />
//                 </div>
//                 <h4 className="text-xl font-bold text-gray-900 mb-2">Jury Panel</h4>
//                 <p className="text-gray-600 mb-4">Evaluate team presentations and provide scores</p>
//                 <div className="inline-flex items-center px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-200">Jury Login</div>
//               </button>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="text-center mt-8">
//             <p className="text-gray-500">&copy; 2025 Smart India Hackathon. All rights reserved.</p>
//             <p className="text-sm text-gray-400 mt-1">Developed for internal evaluation purposes</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (loginType === 'participant') {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//         <div className="max-w-md w-full">
//           <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
//             <div className="text-center mb-6">
//               <div className="flex justify-center mb-4">
//                 <Users className="h-10 w-10 text-green-700" />
//               </div>
//               <h2 className="text-2xl font-bold text-gray-900 mb-2">Team Participant Access</h2>
//               <p className="text-gray-600">Ready to upload your presentation?</p>
//             </div>

//             <div className="space-y-4">
//               <button
//                 onClick={handleParticipantLogin}
//                 className="w-full py-3 px-6 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
//               >
//                 Continue to Upload Portal
//               </button>
              
//               <button
//                 onClick={resetLogin}
//                 className="w-full py-3 px-6 text-gray-600 hover:text-gray-800 transition-colors"
//               >
//                 ← Back to Access Selection
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//       <div className="max-w-md w-full">
//         <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
//           <div className="text-center mb-6">
//             <div className="flex justify-center mb-4">
//               {loginType === 'admin' ? (
//                 <Shield className="h-10 w-10 text-blue-700" />
//               ) : (
//                 <UserCheck className="h-10 w-10 text-purple-700" />
//               )}
//             </div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">
//               {loginType === 'admin' ? 'Administrator Login' : 'Jury Panel Login'}
//             </h2>
//             <p className="text-gray-600">
//               {loginType === 'admin' 
//                 ? 'Enter your admin credentials to continue' 
//                 : 'Enter your jury credentials to access evaluations'
//               }
//             </p>
//           </div>

//           {error && (
//             <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">{error}</div>
//           )}

//           <form onSubmit={handleCredentialLogin} className="space-y-4">
//             <div>
//               <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
//                 {loginType === 'admin' ? <User className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
//                 <span>{loginType === 'admin' ? 'Username' : 'Email'}</span>
//               </label>
//               <input
//                 type={loginType === 'admin' ? 'text' : 'email'}
//                 value={credentials.username}
//                 onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
//                 placeholder={loginType === 'admin' ? 'Enter username' : 'Enter your email'}
//                 required
//               />
//             </div>

//             <div>
//               <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
//                 <Lock className="h-4 w-4" />
//                 <span>Password</span>
//               </label>
//               <input
//                 type="password"
//                 value={credentials.password}
//                 onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
//                 placeholder="Enter password"
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
//                 isLoading
//                   ? 'bg-gray-400 cursor-not-allowed'
//                   : loginType === 'admin'
//                   ? 'bg-blue-600 hover:bg-blue-700'
//                   : 'bg-purple-600 hover:bg-purple-700'
//               } text-white`}
//             >
//               {isLoading ? (
//                 <div className="flex items-center justify-center space-x-2">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                   <span>Signing In...</span>
//                 </div>
//               ) : (
//                 'Sign In'
//               )}
//             </button>

//             <button
//               type="button"
//               onClick={resetLogin}
//               className="w-full py-3 px-6 text-gray-600 hover:text-gray-800 transition-colors"
//             >
//               ← Back to Access Selection
//             </button>
//           </form>

//           {loginType === 'admin' && (
//             <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
//               <strong>Demo Credentials:</strong> Username: admin • Password: sih2025admin
//             </div>
//           )}

//           {loginType === 'jury' && (
//             <div className="mt-6 p-3 bg-purple-50 border border-purple-200 rounded text-xs text-purple-800">
//               Enter the jury email and password set in Admin → Manage Juries.
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { apiSend } from '../api';
import { Trophy, Users, Shield, UserCheck, Lock, Mail, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { setCurrentUser, login } = useData();
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState<'participant' | 'admin' | 'jury' | null>(null);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleParticipantLogin = () => {
    setCurrentUser('participant', 'participant');
    navigate('/upload');
  };

  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (loginType === 'jury') {
        const res = await apiSend('/jury/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: credentials.username, password: credentials.password })
        });
        setCurrentUser(res.jury_id, 'jury');
        navigate('/evaluation');
      } else if (loginType === 'admin') {
        const result = login(credentials.username, credentials.password);
        if (result.success && result.user && result.role) {
          setCurrentUser(result.user, result.role);
          navigate('/admin');
        } else {
          setError('Invalid credentials. Please check your username/email and password.');
        }
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetLogin = () => {
    setLoginType(null);
    setCredentials({ username: '', password: '' });
    setError('');
  };

  const goBackToLanding = () => {
    navigate('/');
  };

  if (loginType === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <div className="max-w-5xl w-full bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-800 to-indigo-800">
            <div className="flex items-center space-x-3">
              <Trophy className="h-10 w-10 text-yellow-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Smart India Hackathon</h1>
                <p className="text-sm text-indigo-100 font-medium">Internal Portal • 2025</p>
              </div>
            </div>
            <button
              onClick={goBackToLanding}
              className="flex items-center px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Landing
            </button>
          </div>

          <div className="p-10">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Select Your Access</h2>
            <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
              Choose your access type below to continue to the respective portal.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <button
                onClick={() => setLoginType('participant')}
                className="group p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-lg transition text-center"
              >
                <Users className="h-10 w-10 text-green-700 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-900 mb-2">Team Participant</h4>
                <p className="text-gray-600 mb-4">Upload your team presentation and details</p>
                <span className="inline-block px-4 py-1 bg-green-600 text-white rounded-full text-sm font-medium">
                  No Login Required
                </span>
              </button>

              <button
                onClick={() => setLoginType('admin')}
                className="group p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-lg transition text-center"
              >
                <Shield className="h-10 w-10 text-blue-700 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-900 mb-2">Administrator</h4>
                <p className="text-gray-600 mb-4">Manage presentations and system settings</p>
                <span className="inline-block px-4 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                  Secure Login
                </span>
              </button>

              <button
                onClick={() => setLoginType('jury')}
                className="group p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-lg transition text-center"
              >
                <UserCheck className="h-10 w-10 text-purple-700 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-900 mb-2">Jury Panel</h4>
                <p className="text-gray-600 mb-4">Evaluate presentations and provide feedback</p>
                <span className="inline-block px-4 py-1 bg-purple-600 text-white rounded-full text-sm font-medium">
                  Jury Login
                </span>
              </button>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center text-sm text-gray-500">
            &copy; 2025 RGUKT Nuzvid • Smart India Hackathon Internal Portal
          </div>
        </div>
      </div>
    );
  }

  if (loginType === 'participant') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-6">
            <Users className="h-12 w-12 text-green-700 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-gray-900">Team Participant Access</h2>
            <p className="text-gray-600">Ready to upload your presentation?</p>
          </div>
          <div className="space-y-4">
            <button
              onClick={handleParticipantLogin}
              className="w-full py-3 px-6 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Continue to Upload Portal
            </button>
            <button
              onClick={resetLogin}
              className="w-full py-3 px-6 text-gray-600 hover:text-gray-800 transition"
            >
              ← Back to Access Selection
            </button>
            <button
              onClick={goBackToLanding}
              className="w-full py-3 px-6 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Landing
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <div className="text-center mb-6">
          {loginType === 'admin' ? (
            <Shield className="h-12 w-12 text-blue-700 mx-auto mb-3" />
          ) : (
            <UserCheck className="h-12 w-12 text-purple-700 mx-auto mb-3" />
          )}
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {loginType === 'admin' ? 'Administrator Login' : 'Jury Panel Login'}
          </h2>
          <p className="text-gray-600">
            {loginType === 'admin'
              ? 'Enter your admin credentials to continue'
              : 'Enter your jury credentials to access evaluations'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">{error}</div>
        )}

        <form onSubmit={handleCredentialLogin} className="space-y-4">
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              {loginType === 'admin' ? <User className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
              <span>{loginType === 'admin' ? 'Username' : 'Email'}</span>
            </label>
            <input
              type={loginType === 'admin' ? 'text' : 'email'}
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              placeholder={loginType === 'admin' ? 'Enter username' : 'Enter your email'}
              required
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Lock className="h-4 w-4" />
              <span>Password</span>
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : loginType === 'admin'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-purple-600 hover:bg-purple-700'
            } text-white`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Signing In...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>

          <button
            type="button"
            onClick={resetLogin}
            className="w-full py-3 px-6 text-gray-600 hover:text-gray-800 transition"
          >
            ← Back to Access Selection
          </button>
          <button
            type="button"
            onClick={goBackToLanding}
            className="w-full py-3 px-6 flex items-center justify-center bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Landing
          </button>
        </form>

        {loginType === 'admin' && (
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
            <strong>Demo Credentials:</strong> Username: admin • Password: sih2025admin
          </div>
        )}

        {loginType === 'jury' && (
          <div className="mt-6 p-3 bg-purple-50 border border-purple-200 rounded text-xs text-purple-800">
            Enter the jury email and password set in Admin → Manage Juries.
          </div>
        )}
      </div>
    </div>
  );
}
