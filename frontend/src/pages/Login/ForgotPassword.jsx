import React, { useState } from 'react';
import { KeyRound, Mail, Lock, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import '../styles/ForgotPassword.css'; // Adjust path as needed for additional custom styles if required

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const response = await fetch('http://localhost:8800/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message || 'A reset code has been sent to your email.');
                setStep(2);
            } else {
                setError(data.error || 'Failed to send reset code. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCodeSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const response = await fetch('http://localhost:8800/api/auth/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message || 'Code verified successfully.');
                setStep(3);
            } else {
                setError(data.error || 'Invalid code. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }
        try {
            const response = await fetch('http://localhost:8800/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code, newPassword }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message || 'Password reset successfully! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(data.error || 'Failed to reset password. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen relative bg-slate-900 flex items-center justify-center overflow-hidden" style={{ width: "100vw" }}>
            {/* Geometric patterns */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `url("https://www.transparenttextures.com/patterns/carbon-fibre.png")`,
                    backgroundRepeat: 'repeat'
                }}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-blue-500/20" />

            {/* Diagonal stripes */}
            <div className="absolute inset-0" style={{
                backgroundImage: `linear-gradient(45deg, rgba(255, 255, 255, 0.05) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.05) 75%, transparent 75%, transparent)`,
                backgroundSize: '100px 100px',
            }} />

            {/* Forgot Password Form */}
            <div className="relative w-full max-w-md mx-4 p-8 rounded-3xl bg-white/20 backdrop-blur-sm border border-[#FF4500]/20">
                <div className="flex items-center justify-center mb-6">
                    <div className="bg-[#FF4500] p-3 rounded-full">
                        <KeyRound size={32} className="text-white" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-white text-center mb-2">
                    {step === 1 ? 'Reset Password' : step === 2 ? 'Verify Code' : 'Set New Password'}
                </h2>
                <p className="text-gray-300 text-center mb-8">
                    {step === 1 ? 'Enter your email to reset password' : step === 2 ? 'Enter the code sent to your email' : 'Enter your new password'}
                </p>

                {message && (
                    <div className="text-green-500 text-center mb-4">{message}</div>
                )}
                {error && (
                    <div className="text-red-500 text-center mb-4">{error}</div>
                )}

                {/* Step 1: Forgot Password - Email Input */}
                {step === 1 && (
                    <form className="space-y-6" onSubmit={handleForgotPasswordSubmit}>
                        <div className="space-y-4">
                            <div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email address"
                                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-[#FF4500]/30 text-white placeholder-gray-400 focus:outline-none focus:border-[#FF4500] focus:ring-1 focus:ring-[#FF4500] transition duration-200"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 rounded-xl bg-[#FF4500] hover:bg-[#FF4500]/90 text-white font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF4500]/50"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Reset Password'}
                        </button>

                        <div className="text-center text-gray-300">
                            <button
                                type="button"
                                onClick={handleBackToLogin}
                                className="text-sm text-[#FF4500] hover:text-[#FF4500]/80 transition duration-200"
                            >
                                Back to Login
                            </button>
                        </div>
                    </form>
                )}

                {/* Step 2: Verify Code */}
                {step === 2 && (
                    <form className="space-y-6" onSubmit={handleVerifyCodeSubmit}>
                        <div className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="Verification Code"
                                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-[#FF4500]/30 text-white placeholder-gray-400 focus:outline-none focus:border-[#FF4500] focus:ring-1 focus:ring-[#FF4500] transition duration-200"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 rounded-xl bg-[#FF4500] hover:bg-[#FF4500]/90 text-white font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF4500]/50"
                            disabled={loading}
                        >
                            {loading ? 'Verifying...' : 'Verify Code'}
                        </button>

                        <div className="text-center text-gray-300">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-sm text-[#FF4500] hover:text-[#FF4500]/80 transition duration-200"
                            >
                                Back to Email
                            </button>
                        </div>
                    </form>
                )}

                {/* Step 3: Reset Password */}
                {step === 3 && (
                    <form className="space-y-6" onSubmit={handleResetPasswordSubmit}>
                        <div className="space-y-4">
                            <div>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="New Password"
                                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-[#FF4500]/30 text-white placeholder-gray-400 focus:outline-none focus:border-[#FF4500] focus:ring-1 focus:ring-[#FF4500] transition duration-200"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm Password"
                                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-[#FF4500]/30 text-white placeholder-gray-400 focus:outline-none focus:border-[#FF4500] focus:ring-1 focus:ring-[#FF4500] transition duration-200"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 rounded-xl bg-[#FF4500] hover:bg-[#FF4500]/90 text-white font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF4500]/50"
                            disabled={loading}
                        >
                            {loading ? 'Resetting...' : 'Set New Password'}
                        </button>

                        <div className="text-center text-gray-300">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="text-sm text-[#FF4500] hover:text-[#FF4500]/80 transition duration-200"
                            >
                                Back to Verify Code
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
