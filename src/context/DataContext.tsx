import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Team {
  id: string;
  teamName: string;
  teamId: string;
  teamLeaderName: string;
  presentationLink: string;
  uploadDate: string;
  evaluations: {
    [juryId: string]: {
      pptDesign: number;
      idea: number;
      pitching: number;
      projectImpact: number;
      remarks?: string;
      totalScore: number;
      evaluatedAt: string;
    };
  };
}

interface DataContextType {
  teams: Team[];
  currentUser: string | null;
  currentUserRole: 'participant' | 'admin' | 'jury' | null;
  currentJuryInfo: { name: string; department: string } | null;
  addTeam: (team: Omit<Team, 'id' | 'uploadDate' | 'evaluations'>) => void;
  updateEvaluation: (teamId: string, juryId: string, evaluation: {
    pptDesign: number;
    idea: number;
    pitching: number;
    projectImpact: number;
    remarks?: string;
  }) => void;
  setCurrentUser: (user: string | null, role: 'participant' | 'admin' | 'jury' | null) => void;
  getAverageScore: (teamId: string) => number;
  login: (username: string, password: string) => { success: boolean; user: string | null; role: 'participant' | 'admin' | 'jury' | null };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Admin credentials
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'sih2025admin'
};

// Jury credentials with automatic ID mapping
const JURY_CREDENTIALS = [
  { 
    email: 'jury1@sih2025.com', 
    password: 'jury1pass', 
    juryId: 'jury1',
    name: 'Dr. Rajesh Kumar',
    department: 'Computer Science & Engineering'
  },
  { 
    email: 'jury2@sih2025.com', 
    password: 'jury2pass', 
    juryId: 'jury2',
    name: 'Prof. Priya Sharma',
    department: 'Information Technology'
  },
  { 
    email: 'jury3@sih2025.com', 
    password: 'jury3pass', 
    juryId: 'jury3',
    name: 'Dr. Amit Patel',
    department: 'Electronics & Communication'
  },
  { 
    email: 'jury4@sih2025.com', 
    password: 'jury4pass', 
    juryId: 'jury4',
    name: 'Prof. Sunita Gupta',
    department: 'Mechanical Engineering'
  }
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<'participant' | 'admin' | 'jury' | null>(null);
  const [currentJuryInfo, setCurrentJuryInfo] = useState<{ name: string; department: string } | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTeams = localStorage.getItem('sih-teams');
    const savedUser = localStorage.getItem('sih-current-user');
    const savedRole = localStorage.getItem('sih-current-role');
    
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams));
    }
    if (savedUser) {
      setCurrentUser(savedUser);
    }
    if (savedRole) {
      setCurrentUserRole(savedRole as 'participant' | 'admin' | 'jury');
    }
  }, []);

  // Save teams to localStorage whenever teams change
  useEffect(() => {
    localStorage.setItem('sih-teams', JSON.stringify(teams));
  }, [teams]);

  // Save current user and role to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sih-current-user', currentUser);
      if (currentUserRole) {
        localStorage.setItem('sih-current-role', currentUserRole);
      }
    } else {
      localStorage.removeItem('sih-current-user');
      localStorage.removeItem('sih-current-role');
    }
  }, [currentUser, currentUserRole]);

  const login = (username: string, password: string) => {
    // Check admin credentials
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      return { success: true, user: 'admin', role: 'admin' as const };
    }

    // Check jury credentials
    const jury = JURY_CREDENTIALS.find(j => j.email === username && j.password === password);
    if (jury) {
      return { success: true, user: jury.juryId, role: 'jury' as const };
    }

    return { success: false, user: null, role: null };
  };

  const addTeam = (teamData: Omit<Team, 'id' | 'uploadDate' | 'evaluations'>) => {
    const newTeam: Team = {
      ...teamData,
      id: `team-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      uploadDate: new Date().toISOString(),
      evaluations: {}
    };
    setTeams(prev => [...prev, newTeam]);
  };

  const updateEvaluation = (teamId: string, juryId: string, evaluation: {
    pptDesign: number;
    idea: number;
    pitching: number;
    projectImpact: number;
    remarks?: string;
  }) => {
    const totalScore = (evaluation.pptDesign + evaluation.idea + evaluation.pitching + evaluation.projectImpact) / 4;
    
    setTeams(prev => prev.map(team => 
      team.id === teamId 
        ? {
            ...team,
            evaluations: {
              ...team.evaluations,
              [juryId]: { 
                ...evaluation,
                totalScore,
                evaluatedAt: new Date().toISOString()
              }
            }
          }
        : team
    ));
  };

  const setCurrentUserWithRole = (user: string | null, role: 'participant' | 'admin' | 'jury' | null) => {
    setCurrentUser(user);
    setCurrentUserRole(role);
    
    // Set jury info if user is a jury
    if (role === 'jury' && user) {
      const juryInfo = JURY_CREDENTIALS.find(j => j.juryId === user);
      if (juryInfo) {
        setCurrentJuryInfo({ name: juryInfo.name, department: juryInfo.department });
      }
    } else {
      setCurrentJuryInfo(null);
    }
  };

  const getAverageScore = (teamId: string): number => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return 0;
    
    const scores = Object.values(team.evaluations).map(evaluation => evaluation.totalScore);
    if (scores.length === 0) return 0;
    
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  };

  return (
    <DataContext.Provider value={{
      teams,
      currentUser,
      currentUserRole,
      currentJuryInfo,
      addTeam,
      updateEvaluation,
      setCurrentUser: setCurrentUserWithRole,
      getAverageScore,
      login
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}