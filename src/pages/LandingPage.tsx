import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, School, Users, Shield, UserCheck, ExternalLink, ChevronLeft, ChevronRight, Award, Target, BookOpen, Lightbulb } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGoTo = (path: string) => navigate(path);
  const [slide, setSlide] = React.useState(0);
  const slides = [
    'https://rguktn.ac.in/assets_new/gallery/5.jpg',
    'https://rguktn.ac.in/assets_new/gallery/c.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/e/e6/RGUKTN.jpg',
    'https://rguktn.ac.in/assets_new/gallery/11.jpg',
    'https://rguktn.ac.in/assets_new/gallery/9.jpg',
  ];

  React.useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, []);
  // return (
  //   <div className="min-h-screen bg-[#801316]">
  //     {/* RGUKT Navbar & Letterhead */}
  //     <nav className="bg-[#801316] shadow-lg">
  //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
  //         <div className="flex items-center space-x-4">
  //           <img src="https://www.rguktn.ac.in/images/logo.png" alt="RGUKT Logo" className="h-12 w-12 object-contain" />
  //           <div className="flex flex-col">
  //             <span className="text-xl font-bold text-white">Rajiv Gandhi University of Knowledge Technologies</span>
  //             <span className="text-sm text-white">Nuzvid Campus, Andhra Pradesh, India</span>
  //           </div>
  //         </div>
  //         <div className="flex items-center space-x-6">
  //           <span className="text-xs text-white font-semibold bg-[#a32c2c] px-3 py-1 rounded-full border border-white">Accredited by NAAC with B+ Grade</span>
  //           <button
  //             onClick={() => handleGoTo('/login')}
  //             className="px-6 py-2 bg-white text-[#801316] font-bold rounded-lg shadow hover:bg-[#fbeaea] border-2 border-[#801316] transition-colors duration-200"
  //           >
  //             Portal Login
  //           </button>
  //         </div>
  //       </div>
  //       <div className="w-full h-1 bg-gradient-to-r from-[#801316] via-[#a32c2c] to-[#fbeaea]" />
  //     </nav>
  //     {/* Letterhead Info Bar */}
  //     <div className="bg-[#fbeaea] text-[#801316] py-2 text-center text-sm font-semibold border-b border-[#801316]">
  //       Catering to the Educational Needs of Gifted Rural Youth of Andhra Pradesh &nbsp;|&nbsp; Established by Govt. of Andhra Pradesh &nbsp;|&nbsp; UGC Recognized
  //     </div>
  //     {/* Institutional Initiative Tagline */}
  //     <div className="bg-[#801316] py-8">
  //       <div className="max-w-4xl mx-auto px-4 text-center">
  //         <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">SIH Internal Hackathon 2025</h2>
  //         <p className="text-base sm:text-lg text-white/90 max-w-3xl mx-auto leading-relaxed">
  //           An institutional initiative to identify, mentor, and prepare exceptional student teams for the National Smart India Hackathon, fostering innovation and problem-solving excellence
  //         </p>
  //       </div>
  //     </div>
  return (
    <div className="min-h-screen bg-white">
      {/* ===== Professional Navbar ===== */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-lg">
        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo + Title */}
            <div className="flex items-center space-x-4">
              <img
                src="https://rgukt.in/assets/media/logos/rgukt.png"
                alt="RGUKT Logo"
                className="h-14 w-14 object-contain"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900 leading-tight">
                  Rajiv Gandhi University of Knowledge Technologies
                </span>
                <span className="text-sm text-blue-700 font-medium">
                  Nuzvid, Andhra Pradesh
                </span>
              </div>
            </div>

            {/* Nav Links */}
            <div className="hidden lg:flex items-center space-x-8">
              <a 
                href="#about" 
                className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
              >
                About
              </a>
              <a 
                href="#program" 
                className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
              >
                Program
              </a>
              <a 
                href="#leadership" 
                className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
              >
                Leadership
              </a>
              <a 
                href="#campus" 
                className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
              >
                Campus
              </a>
              <a 
                href="#contact" 
                className="text-gray-700 hover:text-blue-700 font-medium transition-colors"
              >
                Contact
              </a>
              <button
                onClick={() => handleGoTo('/login')}
                className="px-6 py-2.5 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors shadow-sm hover:shadow"
              >
                Portal Login
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== Hero Section ===== */}
      <header className="pt-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 pattern-grid-lg opacity-30"></div>
        
        <div className="relative">
          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-8">
                <span className="text-sm font-semibold text-blue-800">
                  Internal Selection 2025
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                Smart India Hackathon at
                <span className="text-blue-700 block mt-2">RGUKT Nuzvid</span>
              </h1>
              <p className="text-xl text-gray-700 mb-10 leading-relaxed">
                Empowering student innovators to develop solutions for real-world challenges. 
                Join our elite program to showcase your talent at the national level.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <button
                  onClick={() => handleGoTo('/login')}
                  className="px-8 py-4 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <UserCheck className="h-5 w-5 mr-2" />
                  Start Your Journey
                </button>
                <a
                  href="#about"
                  className="px-8 py-4 bg-white border-2 border-blue-700 text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-all flex items-center justify-center"
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Learn More
                </a>
              </div>
            </div>
          </div>

          {/* Image Carousel */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-200">
              <img
                src={slides[slide]}
                alt={`RGUKT Nuzvid Campus - Slide ${slide + 1}`}
                className="w-full h-[28rem] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
              
              {/* Slide Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="max-w-3xl">
                  <div className="flex items-center space-x-2 mb-3">
                    <Shield className="h-5 w-5" />
                    <span className="text-sm font-medium">RGUKT Nuzvid Campus</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Excellence in Innovation</h3>
                  <p className="text-white/90">
                    A vibrant ecosystem fostering technological innovation and research excellence.
                  </p>
                </div>
              </div>
              
              {/* Navigation Controls */}
              <div className="absolute left-4 right-4 top-1/2 transform -translate-y-1/2 flex justify-between">
                <button
                  onClick={() => setSlide((slide - 1 + slides.length) % slides.length)}
                  className="p-2 rounded-full bg-black/30 text-white hover:bg-black/40 backdrop-blur-sm transition-all"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() => setSlide((slide + 1) % slides.length)}
                  className="p-2 rounded-full bg-black/30 text-white hover:bg-black/40 backdrop-blur-sm transition-all"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
              
              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === slide ? 'bg-white w-8' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Icons */}
        <div className="bg-gradient-to-b from-transparent to-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* SIH 2024 Winner */}
              <div className="flex flex-col items-center bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:border-blue-300 transition-all">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Trophy className="h-8 w-8 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">SIH 2024 Winner</h3>
                <p className="text-center text-gray-600">
                  First place in Smart India Hackathon 2024 for innovative transport solution
                </p>
              </div>
              
              {/* Research Excellence */}
              <div className="flex flex-col items-center bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:border-blue-300 transition-all">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Lightbulb className="h-8 w-8 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Research Hub</h3>
                <p className="text-center text-gray-600">
                  Leading research center with state-of-the-art facilities and expert mentorship
                </p>
              </div>
              
              {/* Innovation Leadership */}
              <div className="flex flex-col items-center bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:border-blue-300 transition-all">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Target className="h-8 w-8 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation Hub</h3>
                <p className="text-center text-gray-600">
                  Fostering creativity and technical excellence through collaborative projects
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Call-to-Action and Achievements */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full mb-6">
              <Award className="h-4 w-4 text-green-600" />
              <span className="text-sm font-semibold text-green-800">Proven Track Record • SIH 2024</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Innovation Driven by Excellence
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Celebrating our outstanding achievements in Smart India Hackathon 2024 - 
              showcasing the talent and innovation of RGUKT Nuzvid students
            </p>
          </div>

          {/* Winner Images Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Winner Team 1 */}
            <div className="group relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-300">
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src="/sih_2024_winnner.jpg" 
                  alt="SIH 2024 Winner Team 1" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Trophy className="h-6 w-6 text-yellow-400" />
                  <span className="text-yellow-400 font-bold text-sm tracking-wide">WINNER</span>
                </div>
                <h3 className="text-white text-xl font-bold mb-2">Champion Team</h3>
                <p className="text-white/90 text-sm">
                  Dynamic Route Rationalization System - Winners of SIH 2024
                </p>
              </div>
              <div className="absolute top-4 right-4">
                <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                  🏆 Winner
                </div>
              </div>
            </div>

            {/* Winner Team 2 */}
            <div className="group relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-300">
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src="/sih_2024_winner_2.jpg" 
                  alt="SIH 2024 Winner Team 2" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Trophy className="h-6 w-6 text-yellow-400" />
                  <span className="text-yellow-400 font-bold text-sm tracking-wide">WINNER</span>
                </div>
                <h3 className="text-white text-xl font-bold mb-2">Excellence Team</h3>
                <p className="text-white/90 text-sm">
                  National Wide Winners - SIH 2024
                </p>
              </div>
              <div className="absolute top-4 right-4">
                <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                  🏆 Winner
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Details */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                  <span className="font-bold text-gray-900 text-lg">Winner Team Achievement</span>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">
                  Dynamic Route Rationalization System
                </h4>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Our winning team developed an innovative solution for Delhi Transport Corporation's 
                  challenge on Dynamic Route Rationalization and Bus Bunching mitigation (Problem Code: SIH1614).
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-medium">
                    <strong>Key Innovation:</strong> Data-driven pipeline for demand-aware routing, 
                    schedule optimization, and real-time analytics to enhance public transport efficiency.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                    <div className="text-2xl font-bold text-blue-800">500+</div>
                    <div className="text-sm text-blue-700 font-medium">Students Participated</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                    <div className="text-2xl font-bold text-green-800">50+</div>
                    <div className="text-sm text-green-700 font-medium">Project Submissions</div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => handleGoTo('/login')}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Users className="h-5 w-5 mr-2" />
                    Access Portals
                  </button>
                  <a 
                    href="#about"
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-blue-800 text-blue-800 font-semibold rounded-lg hover:bg-blue-50 transition-colors duration-200"
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    Learn More
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-blue-200">
              <p className="text-sm text-gray-600 text-center">
                This achievement demonstrates RGUKT Nuzvid's commitment to developing practical, 
                technology-driven solutions for real-world challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portal Access Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Access Your Portal</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Secure, role-based access to hackathon management systems designed for participants, 
              evaluators, and administrators
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
              onClick={() => handleGoTo('/login')}
              className="group bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl hover:border-blue-200 transition-all duration-300 text-left"
            >
              <div className="mb-4">
                <div className="w-12 h-12 bg-blue-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-900 transition-colors duration-200">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Participant Portal</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Submit project proposals, upload presentation materials, and track evaluation progress
                </p>
              </div>
              <div className="flex items-center text-blue-800 font-semibold text-sm">
                <span>Access Portal</span>
                <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </button>
            
            <button 
              onClick={() => handleGoTo('/login')}
              className="group bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 text-left"
            >
              <div className="mb-4">
                <div className="w-12 h-12 bg-indigo-700 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-800 transition-colors duration-200">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Jury Portal</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Structured evaluation interface with comprehensive scoring rubrics and feedback systems
                </p>
              </div>
              <div className="flex items-center text-indigo-700 font-semibold text-sm">
                <span>Access Portal</span>
                <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </button>
            
            <button 
              onClick={() => handleGoTo('/login')}
              className="group bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl hover:border-purple-200 transition-all duration-300 text-left"
            >
              <div className="mb-4">
                <div className="w-12 h-12 bg-purple-700 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-800 transition-colors duration-200">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Admin Portal</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Comprehensive management dashboard for submissions, evaluations, and reporting
                </p>
              </div>
              <div className="flex items-center text-purple-700 font-semibold text-sm">
                <span>Access Portal</span>
                <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* About and Program Details */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About the Internal Hackathon</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                The Smart India Hackathon Internal Selection at RGUKT Nuzvid represents our institutional commitment 
                to fostering innovation, critical thinking, and collaborative problem-solving among students. This 
                comprehensive program serves as a gateway to national-level participation while developing essential 
                skills for future technology leaders.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                  <div className="flex items-center mb-3">
                    <Target className="h-5 w-5 text-blue-700 mr-2" />
                    <h3 className="font-bold text-gray-900">Mission</h3>
                  </div>
                  <p className="text-sm text-gray-700">
                    Identify and nurture exceptional talent through structured mentorship, 
                    rigorous evaluation, and comprehensive support systems.
                  </p>
                </div>
                
                <div className="bg-green-50 border border-green-100 rounded-xl p-6">
                  <div className="flex items-center mb-3">
                    <Lightbulb className="h-5 w-5 text-green-700 mr-2" />
                    <h3 className="font-bold text-gray-900">Innovation Focus</h3>
                  </div>
                  <p className="text-sm text-gray-700">
                    Emphasis on practical, scalable solutions addressing real-world challenges 
                    across diverse domains and industries.
                  </p>
                </div>
                
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
                  <div className="flex items-center mb-3">
                    <BookOpen className="h-5 w-5 text-indigo-700 mr-2" />
                    <h3 className="font-bold text-gray-900">Learning Outcomes</h3>
                  </div>
                  <p className="text-sm text-gray-700">
                    Development of technical expertise, project management skills, 
                    and collaborative leadership capabilities.
                  </p>
                </div>
                
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-6">
                  <div className="flex items-center mb-3">
                    <Award className="h-5 w-5 text-orange-700 mr-2" />
                    <h3 className="font-bold text-gray-900">Success Pathway</h3>
                  </div>
                  <p className="text-sm text-gray-700">
                    Structured progression from concept development to prototype validation 
                    and national competition preparation.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Program Highlights</h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Open to all RGUKT Nuzvid students across disciplines</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Team-based collaborative approach</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Industry-aligned problem statements</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Expert mentorship and guidance</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Comprehensive evaluation framework</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Key Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-800">95%</div>
                    <div className="text-xs text-blue-700">Completion Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-800">85%</div>
                    <div className="text-xs text-blue-700">Industry Relevance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-800">20+</div>
                    <div className="text-xs text-blue-700">Expert Mentors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-800">15+</div>
                    <div className="text-xs text-blue-700">Problem Domains</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Combined Program Leadership & Messages Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Program Leadership</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Meet the leadership team guiding the Smart India Hackathon initiative and read their messages of vision and encouragement.
            </p>
          </div>
          <div className="flex flex-col gap-10">
            {/* Director */}
            <div className="flex flex-row bg-white rounded-xl shadow-lg border border-gray-200 p-8 items-center gap-8">
              <img src="https://www.rguktrkv.ac.in/images/staff/CE/1161503.jpg" alt="Director" className="h-48 w-40 object-cover rounded-lg shadow-md" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Prof. Amarendra Kumar</h3>
                <p className="text-base font-semibold text-blue-800 mb-2">Director, RGUKT Nuzvid</p>
                <blockquote className="text-gray-700 leading-relaxed italic">
                  "At RGUKT Nuzvid, we envision a future where every student becomes an agent of positive change through 
                  innovation and technological excellence. The Smart India Hackathon represents more than a competition—it 
                  embodies our commitment to nurturing creative problem-solvers who will shape tomorrow's world. Our students' 
                  outstanding performance in SIH 2024, achieving both winner and finalist positions, validates our approach 
                  to holistic education and research-driven learning. I encourage all participants to embrace this opportunity 
                  with enthusiasm and dedication."
                </blockquote>
              </div>
            </div>
            {/* Dean of Academics */}
            <div className="flex flex-row bg-white rounded-xl shadow-lg border border-gray-200 p-8 items-center gap-8">
              <img src="https://media.licdn.com/dms/image/v2/D5603AQGMEQ3tiC60IQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1714803123003?e=2147483647&v=beta&t=cHiyQjxOp6sueRIExbOvjEkGD365cthSUs2NME8Hw6k" alt="Dean of Academics" className="h-48 w-40 object-cover rounded-lg shadow-md" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Dr. Sadu Chiranjeevi</h3>
                <p className="text-base font-semibold text-indigo-800 mb-2">Dean of Academics • Event Convener</p>
                <blockquote className="text-gray-700 leading-relaxed italic">
                  "Academic excellence and innovation are inseparable pillars of our educational philosophy. The Internal Hackathon 
                  serves as a bridge between theoretical knowledge and practical application, enabling students to transform 
                  classroom learning into impactful solutions. Our remarkable achievements in SIH 2024 demonstrate the caliber 
                  of talent and dedication our students possess. This program continues to strengthen our reputation as a 
                  center of excellence in technology education and research."
                </blockquote>
              </div>
            </div>
            {/* SPOC */}
            <div className="flex flex-row bg-white rounded-xl shadow-lg border border-gray-200 p-8 items-center gap-8">
              <img src="https://media.licdn.com/dms/image/v2/D5603AQGoJKVdHBcjzA/profile-displayphoto-scale_400_400/B56Zk8t.xpH8Ag-/0/1757660312590?e=1760572800&v=beta&t=paXHZb_BgtNjcmFDsqpXZWtlA5uPid1M6hKws22MYM4" alt="SPOC" className="h-48 w-40 object-cover rounded-lg shadow-md" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Mr. Ch. Srinivasu</h3>
                <p className="text-base font-semibold text-purple-800 mb-2">Assistant Professor (CSE) • SPOC</p>
                <blockquote className="text-gray-700 leading-relaxed italic">
                  "As the Program Coordinator, I witness firsthand the transformation that occurs when passionate students 
                  engage with meaningful challenges. The energy, creativity, and collaborative spirit demonstrated throughout 
                  our Internal Hackathon consistently exceed expectations. Our success in SIH 2024, with teams achieving 
                  winner and finalist positions, reflects the dedication of our participants and the robustness of our 
                  preparation process. I invite all students to join this journey of discovery, innovation, and excellence."
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Excellence Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Campus Excellence</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              A world-class residential campus fostering academic excellence, research innovation, 
              and holistic student development
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { title: 'Academic Blocks', image: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=800' },
              { title: 'Research Labs', image: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800' },
              { title: 'Campus Life', image: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=800' },
              { title: 'Innovation Hub', image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800' }
            ].map((item, index) => (
              <div key={index} className="group relative rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={item.image}
                    alt={`RGUKT Nuzvid ${item.title}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-center">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="text-3xl font-bold text-blue-800 mb-2">9,000+</div>
              <div className="text-sm font-semibold text-gray-700">Students</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="text-3xl font-bold text-green-700 mb-2">200+</div>
              <div className="text-sm font-semibold text-gray-700">Faculty</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="text-3xl font-bold text-purple-700 mb-2">50+</div>
              <div className="text-sm font-semibold text-gray-700">Research Labs</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="text-3xl font-bold text-orange-600 mb-2">100+</div>
              <div className="text-sm font-semibold text-gray-700">Acres Campus</div>
            </div>
          </div>
        </div>
      </section>

      {/* Official Footer */}
      <footer className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <School className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">RGUKT Nuzvid</h3>
                  <p className="text-blue-200 text-sm">Smart India Hackathon</p>
                </div>
              </div>
              <p className="text-blue-200 text-sm leading-relaxed">
                Rajiv Gandhi University of Knowledge Technologies, Nuzvid Campus, 
                Andhra Pradesh, India - Fostering Innovation and Excellence
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li><button onClick={() => handleGoTo('/login')} className="hover:text-white transition-colors">Participant Portal</button></li>
                <li><button onClick={() => handleGoTo('/login')} className="hover:text-white transition-colors">Jury Portal</button></li>
                <li><button onClick={() => handleGoTo('/login')} className="hover:text-white transition-colors">Admin Portal</button></li>
                <li><a href="#about" className="hover:text-white transition-colors">About Program</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact Information</h4>
              <div className="space-y-2 text-sm text-blue-200">
                <p>RGUKT Nuzvid Campus</p>
                <p>Andhra Pradesh, India</p>
                <p>Academic Year: 2024-25</p>
                <p className="mt-3 text-xs">
                  Official University Program
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-blue-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-blue-200">
              <UserCheck className="h-4 w-4" />
              <span>Developed by <strong><a href="https://www.linkedin.com/in/nikhileswara-rao-sulake/">Nikhileswara Rao Sulake</a></strong></span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-blue-200">
              <Trophy className="h-4 w-4" />
              <span>Smart India Hackathon • Internal Selection • RGUKT Nuzvid</span>
            </div>
            <div className="mt-2 sm:mt-0 text-sm text-blue-300">
              &copy; {new Date().getFullYear()} RGUKT Nuzvid. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}