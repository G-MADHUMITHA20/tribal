import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, User, Phone, AlertCircle, ShieldCheck } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [applicantCategory, setApplicantCategory] = useState('SCHEDULED_TRIBE');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form validations
    if (!name.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword) {
      setErrorMessage('Please fill in all mandatory fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Password and Confirm Password do not match.');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('You must review and accept the statutory terms and Aadhaar verification consent.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
      });
      navigate('/applicant/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#f8fafc] py-8 px-4 flex flex-col justify-center items-center">
      <div className="max-w-lg w-full bg-white border border-slate-300 rounded-lg shadow-md overflow-hidden">
        {/* Ministry Branding Header */}
        <div className="bg-[#0b2853] text-white p-6 text-center border-b-4 border-amber-500">
          <div className="flex justify-center mb-3">
            <img
              src="/images/mota-emblem.png"
              alt="Government of India emblem"
              className="h-16 w-auto object-contain filter brightness-0 invert"
            />
          </div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-200">
            Government of India
          </h2>
          <h1 className="text-base font-black uppercase tracking-tight text-white mt-0.5">
            Ministry of Tribal Affairs
          </h1>
          <p className="text-[11px] text-amber-300 font-semibold mt-1">
            New Citizen & Scholar Account Registration
          </p>
        </div>

        {/* Signup Form */}
        <div className="p-6 sm:p-8 space-y-5">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-lg font-black text-[#0b2853]">
              Create Citizen Profile
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Register with your statutory details to apply for Pre-Matric, Post-Matric, and National Fellowships.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div
              role="alert"
              aria-live="polite"
              className="p-3.5 bg-rose-50 border-l-4 border-rose-600 rounded text-xs text-rose-900 flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-rose-700 flex-shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="signup-name"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Full Name (As per Aadhaar / Official Records) <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  id="signup-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Birsa Munda"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-800 text-slate-900"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="signup-email"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Email Address <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  id="signup-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. birsa@tribal.gov.in"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-800 text-slate-900"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label
                htmlFor="signup-phone"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Mobile Number (Aadhaar / DBT Linked) <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  id="signup-phone"
                  type="tel"
                  required
                  maxLength={15}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-800 text-slate-900 font-mono"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Applicant Category */}
            <div>
              <label
                htmlFor="signup-category"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Target Beneficiary Category
              </label>
              <select
                id="signup-category"
                value={applicantCategory}
                onChange={(e) => setApplicantCategory(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-800 text-slate-900 font-medium"
              >
                <option value="SCHEDULED_TRIBE">Scheduled Tribe (ST) - Statutory Category</option>
                <option value="PVTG">Particularly Vulnerable Tribal Group (PVTG)</option>
                <option value="RESEARCH_SCHOLAR">ST Higher Education / Fellowship Scholar</option>
              </select>
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="signup-password"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Password <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 chars"
                    className="w-full pl-8 pr-8 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-800 text-slate-900"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2 top-2.5 p-1 text-slate-500 hover:text-slate-800"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-confirm-password"
                  className="block text-xs font-bold text-slate-700 mb-1"
                >
                  Confirm Password <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    id="signup-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-8 pr-8 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-800 text-slate-900"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    className="absolute right-2 top-2.5 p-1 text-slate-500 hover:text-slate-800"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms and Consent Checkbox */}
            <div className="pt-2">
              <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded border border-slate-200">
                <input
                  id="signup-terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-900 border-slate-300 rounded focus:ring-blue-800"
                />
                <label
                  htmlFor="signup-terms"
                  className="text-[11px] text-slate-700 leading-relaxed"
                >
                  I hereby declare that I belong to the Scheduled Tribe community and consent to verification of my certificates through DigiLocker, state databases, and MoTA review panels under the Aadhaar (Targeted Delivery of Financial and Other Subsidies, Benefits and Services) Act.
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-[#0b2853] hover:bg-[#134685] text-white font-bold text-xs rounded shadow uppercase tracking-wider transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-1 disabled:bg-slate-400"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-amber-400 rounded-full animate-spin" />
                  <span>Registering Citizen Profile...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="pt-3 border-t border-slate-200 text-center text-xs text-slate-600">
            <span>Already registered with MoTA? </span>
            <Link
              to="/login"
              className="text-blue-900 font-bold hover:underline focus:outline-none focus:ring-1 focus:ring-blue-800 rounded px-1"
            >
              Login to Citizen Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
