import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';

export default function AccountAuth({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = '/account';
    } catch (err) {
      toast({ description: err?.message || 'Invalid email or password', variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await base44.auth.register({ email, password, fullName: fullName });
      setShowOtp(true);
      toast({ description: 'Verification code sent to your email' });
    } catch (err) {
      toast({ description: err?.message || 'Registration failed', variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode: otp });
      base44.auth.setToken(result.accessToken);
      window.location.href = '/account';
    } catch (err) {
      toast({ description: err?.message || 'Invalid verification code', variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleResendOtp = async () => {
    try {
      await base44.auth.resendOtp(email);
      toast({ description: 'New verification code sent' });
    } catch (err) {
      toast({ description: 'Could not resend code', variant: 'destructive' });
    }
  };

  if (showOtp) {
    return (
      <div className="maxWmd mxAuto px5vw py16 mdPy24">
        <h1 className="fontDisplay text2xl tracking015em uppercase mb2 textCenter">Verify Email</h1>
        <p className="textSm textMutedForeground textCenter mb8">
          Enter the code sent to {email}
        </p>
        <form onSubmit={handleVerifyOtp} className="spaceY5">
          <input
            type="text"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            placeholder="Enter verification code"
            className="wFull border borderBorder bgTransparent px4 py35 textSm tracking03em textCenter outlineNone focusBorderForeground transitionColors"
          />
          <button
            type="submit"
            disabled={loading}
            className="wFull bgForeground textBackground py35 textXs tracking025em uppercase fontMedium hoverOpacity90 disabledOpacity50"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
          <button
            type="button"
            onClick={handleResendOtp}
            className="wFull textXs textMutedForeground trackingWide hoverTextForeground transitionColors textCenter"
          >
            Resend Code
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="maxWmd mxAuto px5vw py16 mdPy24">
      <h1 className="fontDisplay text2xl tracking015em uppercase mb2 textCenter">
        {mode === 'login' ? 'Sign In' : 'Create Account'}
      </h1>
      <p className="textSm textMutedForeground textCenter mb8">
        {mode === 'login'
          ? 'Sign in to view your orders'
          : 'Create an account to track your orders'}
      </p>

      <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="spaceY5">
        {mode === 'register' && (
          <div>
            <label className="text10px tracking025em uppercase textMutedForeground block mb2">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              className="wFull border borderBorder bgTransparent px4 py35 textSm trackingWide outlineNone focusBorderForeground transitionColors"
              placeholder="Your Name"
            />
          </div>
        )}

        <div>
          <label className="text10px tracking025em uppercase textMutedForeground block mb2">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="wFull border borderBorder bgTransparent px4 py35 textSm trackingWide outlineNone focusBorderForeground transitionColors"
            placeholder="you@email.com"
          />
        </div>

        <div>
          <label className="text10px tracking025em uppercase textMutedForeground block mb2">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="wFull border borderBorder bgTransparent px4 py35 textSm trackingWide outlineNone focusBorderForeground transitionColors"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="wFull bgForeground textBackground py35 textXs tracking025em uppercase fontMedium hoverOpacity90 disabledOpacity50"
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      <p className="textSm textCenter mt6 textMutedForeground">
        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
        <button
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          className="textForeground borderB borderForeground pb05"
        >
          {mode === 'login' ? 'Create one' : 'Sign in'}
        </button>
      </p>
    </div>
  );
}