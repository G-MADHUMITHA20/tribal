import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#f8fafc] py-8 px-4 flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white border border-slate-300 rounded-lg shadow-md overflow-hidden">
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
            Citizen Self-Service Password Assistance
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Password Reset Instructions Dispatched
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                If an official citizen account matching <strong>{email}</strong> exists, verification instructions have been dispatched to your registered email address and linked SMS gateway.
              </p>
              <div className="pt-3">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0b2853] hover:bg-[#134685] text-white text-xs font-bold rounded shadow"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Login</span>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-lg font-black text-[#0b2853]">
                  Reset Account Password
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Enter your registered citizen or officer email address to receive password reset instructions.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="reset-email"
                    className="block text-xs font-bold text-slate-700 mb-1"
                  >
                    Registered Email Address <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="reset-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. scholar@tribal.gov.in"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-800 text-slate-900"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#0b2853] hover:bg-[#134685] text-white font-bold text-xs rounded shadow uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-blue-800"
                >
                  Send Reset Link
                </button>
              </form>

              <div className="pt-3 border-t border-slate-200 text-center text-xs text-slate-600">
                <Link
                  to="/login"
                  className="text-blue-900 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Login</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
