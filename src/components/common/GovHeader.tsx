import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Search, Eye, User, LogIn, UserPlus, LogOut, LayoutDashboard, Bell, X, CheckCircle2, RotateCcw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const GovHeader: React.FC = () => {
  const {
    language,
    setLanguage,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    toggleHighContrast
  } = useApp();

  const { isAuthenticated, user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { adminNotifications = [], markNotificationAsRead } = useApp();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState<'ALL' | 'UNREAD' | 'STARTED' | 'SUBMITTED' | 'RESUBMITTED'>('ALL');

  const unreadCount = adminNotifications.filter(n => !n.isRead).length;

  const filteredNotifications = adminNotifications.filter(n => {
    if (notificationFilter === 'UNREAD') return !n.isRead;
    if (notificationFilter === 'STARTED') return n.actionType === 'Application Started';
    if (notificationFilter === 'SUBMITTED') return n.actionType === 'Application Submitted' || n.actionType === 'New Application Submitted';
    if (notificationFilter === 'RESUBMITTED') return n.actionType === 'Application Resubmitted';
    return true;
  });

  const handleNotificationClick = (n: any) => {
    markNotificationAsRead(n.id);
    setIsNotificationOpen(false);
    navigate(`/admin/applications?scheme=${n.schemeCode}&app=${n.applicationId}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/schemes?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200">
      {/* Top micro-bar: Accessibility, Language, Tricolor strip */}
      <div className="gov-strip-bg w-full"></div>
      
      <div className="bg-slate-100 text-slate-700 text-xs py-1.5 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          {/* Left: Official Government of India claim */}
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-wide text-slate-900">
              भारत सरकार | Government of India
            </span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-slate-600">
              माननीय जनजातीय कार्य मंत्रालय (MoTA)
            </span>
          </div>

          {/* Right: Accessibility toolbar & Language */}
          <div className="flex items-center gap-3">
            {/* Screen Reader Access link */}
            <a
              href="#main-content"
              className="text-blue-800 hover:underline hidden md:inline focus:ring-2 focus:ring-blue-600 px-1 font-medium"
            >
              Skip to Main Content
            </a>

            <div className="h-3 w-px bg-slate-300 hidden md:block"></div>

            {/* Font size adjustments */}
            <div className="flex items-center gap-1 border border-slate-300 rounded bg-white px-1 py-0.5">
              <span className="text-[11px] text-slate-500 font-medium mr-1">Text:</span>
              <button
                onClick={decreaseFontSize}
                className="px-1 font-bold hover:text-blue-700 focus:outline-none"
                title="Decrease font size"
                aria-label="Decrease text size"
              >
                A-
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={resetFontSize}
                className="px-1 font-bold hover:text-blue-700 focus:outline-none"
                title="Default font size"
                aria-label="Default text size"
              >
                A
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={increaseFontSize}
                className="px-1 font-bold hover:text-blue-700 focus:outline-none"
                title="Increase font size"
                aria-label="Increase text size"
              >
                A+
              </button>
            </div>

            {/* High Contrast */}
            <button
              onClick={toggleHighContrast}
              className="border border-slate-300 rounded bg-white px-1.5 py-0.5 flex items-center gap-1 hover:bg-slate-50 text-slate-700"
              title="Toggle High Contrast Mode"
              aria-label="Toggle High Contrast"
            >
              <Eye className="w-3 h-3 text-slate-600" />
              <span className="text-[11px] font-medium hidden sm:inline">Contrast</span>
            </button>

            <div className="h-3 w-px bg-slate-300"></div>

            {/* Language Switcher */}
            <div className="flex items-center font-medium">
              <button
                onClick={() => setLanguage('EN')}
                className={`px-1.5 py-0.5 rounded text-xs ${
                  language === 'EN'
                    ? 'font-bold text-blue-900 underline'
                    : 'text-slate-600 hover:text-blue-800'
                }`}
              >
                English
              </button>
              <span className="text-slate-400">/</span>
              <button
                onClick={() => setLanguage('HI')}
                className={`px-1.5 py-0.5 rounded text-xs ${
                  language === 'HI'
                    ? 'font-bold text-blue-900 underline'
                    : 'text-slate-600 hover:text-blue-800'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Government Header Banner */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: National Emblem & Ministry Identity */}
          <Link to="/" className="flex items-center gap-3 sm:gap-4 group">
            {/* MoTA Emblem / Logo */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <img
                src="/images/mota-emblem.png"
                alt="Government of India emblem"
                className="h-10 sm:h-12 md:h-14 w-auto max-w-[120px] sm:max-w-[160px] md:max-w-[200px] object-contain flex-shrink-0"
              />
            </div>

            {/* Ministry Text */}
            <div className="border-l border-slate-300 pl-3 sm:pl-3.5">
              <h2 className="text-xs sm:text-sm font-bold tracking-tight text-slate-800 leading-tight uppercase font-sans">
                {language === 'HI' ? 'जनजातीय कार्य मंत्रालय' : 'MINISTRY OF TRIBAL AFFAIRS'}
              </h2>
              <p className="text-[11px] sm:text-xs font-semibold text-slate-600 leading-tight">
                {language === 'HI' ? 'भारत सरकार' : 'Government of India'}
              </p>
              <h1 className="text-sm sm:text-lg font-bold text-[#0b2853] tracking-tight leading-snug mt-0.5 sm:mt-1">
                {language === 'HI'
                  ? 'एकीकृत एआई-सक्षम छात्रवृत्ति एवं अध्येतावृत्ति पोर्टल'
                  : 'Unified AI-Enabled Scholarship & Fellowship Portal'}
              </h1>
            </div>
          </Link>

          {/* Right: Search and Dynamic Auth State */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Global Search Bar */}
            <form onSubmit={handleSearch} className="relative min-w-[220px] sm:min-w-[260px]">
              <input
                type="text"
                placeholder={language === 'HI' ? 'योजनाएं, दिशानिर्देश खोजें...' : 'Search schemes, guidelines...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-800 text-slate-900 placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              <button type="submit" className="sr-only">Search</button>
            </form>

            {/* Dynamic Authentication Actions */}
            <div className="flex items-center gap-2">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-[#0b2853] hover:bg-[#134685] text-white text-xs font-bold shadow-sm transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-slate-500" />
                    <span>Sign Up</span>
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-bold text-slate-900 block leading-tight">
                      {user?.name}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">
                      {user?.role}
                    </span>
                  </div>

                  <Link
                    to={user?.role === 'APPLICANT' ? '/applicant/dashboard' : '/admin'}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-[#0b2853] hover:bg-[#134685] text-white text-xs font-bold shadow-sm transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-amber-300" />
                    <span>Dashboard</span>
                  </Link>

                  {user?.role !== 'APPLICANT' && (
                    <div className="relative">
                      <button
                        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                        className="relative p-1.5 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition-colors"
                        title="Notifications"
                        aria-label="Notifications"
                      >
                        <Bell className="w-4 h-4" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                            {unreadCount}
                          </span>
                        )}
                      </button>

                      {isNotificationOpen && (
                        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-lg shadow-xl z-50 flex flex-col overflow-hidden">
                          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                              Admin Notifications
                              {unreadCount > 0 && (
                                <span className="bg-[#0b2853] text-white text-[10px] px-2 py-0.5 rounded-full">
                                  {unreadCount} New
                                </span>
                              )}
                            </h3>
                            <button onClick={() => setIsNotificationOpen(false)} className="text-slate-400 hover:text-slate-600">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="px-2 py-2 border-b border-slate-100 flex gap-1 overflow-x-auto text-[10px] sm:text-xs">
                            {['ALL', 'UNREAD', 'STARTED', 'SUBMITTED', 'RESUBMITTED'].map((filter) => (
                              <button
                                key={filter}
                                onClick={() => setNotificationFilter(filter as any)}
                                className={`px-2 py-1 rounded whitespace-nowrap ${notificationFilter === filter ? 'bg-blue-100 text-blue-800 font-bold' : 'text-slate-600 hover:bg-slate-100'}`}
                              >
                                {filter === 'STARTED' ? 'Application Started' : filter === 'SUBMITTED' ? 'Submitted' : filter === 'RESUBMITTED' ? 'Resubmitted' : filter === 'ALL' ? 'All' : 'Unread'}
                              </button>
                            ))}
                          </div>

                          <div className="max-h-80 overflow-y-auto">
                            {filteredNotifications.length === 0 ? (
                              <div className="px-4 py-6 text-center text-sm text-slate-500">
                                No notifications match this filter.
                              </div>
                            ) : (
                              <div className="divide-y divide-slate-100">
                                {filteredNotifications.map(n => (
                                  <button
                                    key={n.id}
                                    onClick={() => handleNotificationClick(n)}
                                    className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-start gap-3 ${!n.isRead ? 'bg-blue-50/30' : ''}`}
                                  >
                                    <div className="flex-shrink-0 mt-0.5">
                                      {n.actionType === 'Application Started' ? (
                                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                          <UserPlus className="w-3.5 h-3.5" />
                                        </div>
                                      ) : n.actionType === 'Application Resubmitted' ? (
                                        <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                                          <RotateCcw className="w-3.5 h-3.5" />
                                        </div>
                                      ) : (
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                          <CheckCircle2 className="w-3.5 h-3.5" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className={`text-sm ${!n.isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                                        {n.title}
                                      </p>
                                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                                        <span className="font-mono text-blue-800">{n.applicationId}</span> • {n.schemeCode}
                                      </p>
                                      <p className="text-[11px] text-slate-400 mt-1 flex justify-between">
                                        <span>{n.description}</span>
                                        <span>{n.timestamp}</span>
                                      </p>
                                    </div>
                                    {!n.isRead && (
                                      <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded border border-slate-300 bg-white hover:bg-rose-50 hover:border-rose-300 text-rose-700 text-xs font-semibold shadow-sm transition-colors"
                    title="Logout from system"
                    aria-label="Logout"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export const GovernmentHeader = GovHeader;
export default GovHeader;
