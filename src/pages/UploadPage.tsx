import React, { useEffect, useState } from 'react';
import { apiGet, apiSend } from '../api';
import {
  Upload,
  FileText,
  Link,
  Users,
  User,
  CheckCircle,
  AlertCircle,
  Phone,
  Hash,
  Search,
  ChevronDown
} from 'lucide-react';

export default function UploadPage() {
  const [formData, setFormData] = useState({
    teamName: '',
    teamId: '',
    teamLeaderName: '',
    teamLeaderId: '',
    phone: '',
    problemCode: '' as string,
    presentationLink: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [problems, setProblems] = useState<{ code: string; title: string }[]>([]);
  const [problemSearch, setProblemSearch] = useState('');

  // Team ID dropdown states
  const [teamIdSearch, setTeamIdSearch] = useState('');
  const [showTeamIdDropdown, setShowTeamIdDropdown] = useState(false);

  // Generate team IDs from 001_SIH to 160_SIH
  const teamIds = Array.from({ length: 160 }, (_, i) => {
    const num = (i + 1).toString().padStart(3, '0');
    return `${num}_SIH`;
  });

  useEffect(() => {
    const load = async () => {
      try {
        const list = await apiGet('/problems');
        setProblems(list as any);
      } catch {
        setProblems([]);
      }
    };
    load();
  }, []);

  // Handle clicking outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.team-id-dropdown') && !target.closest('.problem-dropdown')) {
        setShowTeamIdDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.teamName.trim()) {
      newErrors.teamName = 'Team name is required';
    }

    if (!formData.teamId.trim()) {
      newErrors.teamId = 'Team ID is required';
    } else if (!/^\d{3}_SIH$/i.test(formData.teamId.trim())) {
      newErrors.teamId = 'Team ID must match 001_SIH format';
    }

    if (!formData.teamLeaderName.trim()) {
      newErrors.teamLeaderName = 'Team leader name is required';
    }

    if (!formData.teamLeaderId.trim()) {
      newErrors.teamLeaderId = 'Team leader ID is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
    }

    if (!formData.presentationLink.trim()) {
      newErrors.presentationLink = 'Presentation link is required';
    } else if (!isValidUrl(formData.presentationLink)) {
      newErrors.presentationLink = 'Please enter a valid URL';
    }

    if (!formData.problemCode.trim()) {
      newErrors.problemCode = 'Problem statement ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTeamIdChange = (value: string) => {
    setFormData(prev => ({ ...prev, teamId: value }));
    setTeamIdSearch(value);
    setShowTeamIdDropdown(true);

    if (errors.teamId) {
      setErrors(prev => ({ ...prev, teamId: '' }));
    }
  };

  const selectTeamId = (teamId: string) => {
    setFormData(prev => ({ ...prev, teamId }));
    setTeamIdSearch(teamId);
    setShowTeamIdDropdown(false);
  };

  // Filter team IDs
  const filteredTeamIds = teamIds.filter(id =>
    id.toLowerCase().includes(teamIdSearch.toLowerCase())
  );

  // Filter problems (optional suggestions)
  const filteredProblems = (Array.isArray(problems) ? problems : []).filter(
    (p) =>
      p &&
      typeof p.code === 'string' &&
      (p.code.toLowerCase().includes((problemSearch || '').toLowerCase()) ||
        (p.title && p.title.toLowerCase().includes((problemSearch || '').toLowerCase())))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await apiSend('/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team_id: formData.teamId.trim(),
          team_name: formData.teamName.trim(),
          leader_name: formData.teamLeaderName.trim(),
          leader_id: formData.teamLeaderId.trim(),
          phone: formData.phone.trim(),
          problem_code: formData.problemCode.trim(),
          slides_link: formData.presentationLink.trim()
        })
      });
      setSubmitStatus('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setFormData({
        teamName: '',
        teamId: '',
        teamLeaderName: '',
        teamLeaderId: '',
        phone: '',
        problemCode: '',
        presentationLink: ''
      });
      setProblemSearch('');
      setTeamIdSearch('');
    } catch (error: any) {
      setSubmitStatus('error');
      setErrors(prev => ({ ...prev, submit: error.message || 'Submission failed' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Upload className="h-10 w-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Upload Presentation</h1>
          </div>
          <p className="text-gray-600">
            Submit your team's Google Slides link. Ensure sharing is set to "Anyone with the link can view".
          </p>
        </div>

        {submitStatus === 'success' && (
          <div className="mb-6 p-5 sm:p-6 bg-green-50 border border-green-300 rounded-xl flex items-start space-x-3">
            <CheckCircle className="h-6 w-6 text-green-700 mt-0.5" />
            <div>
              <p className="text-green-900 text-base sm:text-lg font-semibold">Submission recorded successfully!</p>
              <p className="text-green-800 text-sm mt-1">Your presentation link and details have been saved.</p>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800">{errors.submit || 'Failed to submit. Please check the form and try again.'}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Name */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Users className="h-4 w-4" />
              <span>Team Name</span>
            </label>
            <input
              type="text"
              name="teamName"
              value={formData.teamName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.teamName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your team name"
            />
            {errors.teamName && <p className="mt-1 text-sm text-red-600">{errors.teamName}</p>}
          </div>

          {/* Team ID */}
          <div className="relative team-id-dropdown">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4" />
              <span>Team ID</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={teamIdSearch}
                onChange={(e) => handleTeamIdChange(e.target.value)}
                onFocus={() => setShowTeamIdDropdown(true)}
                className={`w-full px-4 py-3 pr-10 border rounded-lg ${
                  errors.teamId ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Type to search... (e.g., 001_SIH)"
                autoComplete="off"
              />
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />

              {showTeamIdDropdown && filteredTeamIds.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredTeamIds.slice(0, 10).map((teamId) => (
                    <button
                      key={teamId}
                      type="button"
                      onClick={() => selectTeamId(teamId)}
                      className="w-full px-4 py-2 text-left hover:bg-blue-50"
                    >
                      {teamId}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.teamId && <p className="mt-1 text-sm text-red-600">{errors.teamId}</p>}
          </div>

          {/* Team Leader Name */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4" />
              <span>Team Leader Name</span>
            </label>
            <input
              type="text"
              name="teamLeaderName"
              value={formData.teamLeaderName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.teamLeaderName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter team leader's name"
            />
            {errors.teamLeaderName && <p className="mt-1 text-sm text-red-600">{errors.teamLeaderName}</p>}
          </div>

          {/* Team Leader ID */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Hash className="h-4 w-4" />
              <span>Team Leader ID</span>
            </label>
            <input
              type="text"
              name="teamLeaderId"
              value={formData.teamLeaderId}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.teamLeaderId ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter leader's ID"
            />
            {errors.teamLeaderId && <p className="mt-1 text-sm text-red-600">{errors.teamLeaderId}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Phone className="h-4 w-4" />
              <span>Phone Number</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.phone ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="10-digit phone number"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>

          {/* Presentation Link */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Link className="h-4 w-4" />
              <span>Google Slides Share Link</span>
            </label>
            <input
              type="url"
              name="presentationLink"
              value={formData.presentationLink}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.presentationLink ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="https://docs.google.com/presentation/d/..."
            />
            {errors.presentationLink && <p className="mt-1 text-sm text-red-600">{errors.presentationLink}</p>}
          </div>

          {/* Problem Statement */}
          <div className="relative problem-dropdown">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Search className="h-4 w-4" />
              <span>Problem Statement ID</span>
            </label>
            <input
              type="text"
              value={problemSearch}
              onChange={(e) => {
                const value = e.target.value;
                setProblemSearch(value);
                setFormData(prev => ({ ...prev, problemCode: value }));
                if (errors.problemCode) {
                  setErrors(prev => ({ ...prev, problemCode: '' }));
                }
              }}
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.problemCode ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter problem code manually or search (e.g., SIH25010)"
            />
            {errors.problemCode && <p className="mt-1 text-sm text-red-600">{errors.problemCode}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-semibold ${
              isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isSubmitting ? 'Uploading...' : 'Submit Presentation'}
          </button>
        </form>
      </div>
    </div>
  );
}
