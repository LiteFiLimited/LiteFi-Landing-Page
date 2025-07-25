"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { ToastProvider, useToastContext } from "@/app/components/ToastProvider";
import { Toaster } from "@/components/ui/toaster";
import { authApi } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useRedirectIfAuthenticated } from "@/lib/auth";
import EmailVerificationModal from "@/app/components/EmailVerificationModal";

// Import images directly
import heroImage from "@/public/assets/images/image.png";
import logoImage from "@/public/assets/images/logo.png";

function LoginContent() {
  const { success, error } = useToastContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Redirect if already authenticated
  useRedirectIfAuthenticated();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/dashboard");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  // Get the redirect path from URL parameters if available
  useEffect(() => {
    const redirect = searchParams.get("redirect");
    if (redirect) {
      setRedirectPath(redirect);
    }
  }, [searchParams]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleVerifyEmail = async (otp: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.verifyEmail({
        email: verificationEmail,
        code: otp
      });

      if (response.success) {
        success("Email verified successfully!", "You can now log in to your account");
        setShowVerificationModal(false);
        // Optionally auto-login after verification
        // You can add auto-login logic here if needed
      } else {
        error("Verification failed", response.error || "Please try again");
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      let errorMessage = "An unexpected error occurred";
      
      if (err?.message && typeof err.message === 'string') {
        errorMessage = err.message;
      } else if (err?.error && typeof err.error === 'string') {
        errorMessage = err.error;
      }
      
      error("Verification failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await authApi.resendOtp({
        email: verificationEmail,
        type: 'email'
      });
      
      if (response.success) {
        success("Verification code sent", `A new code has been sent to ${verificationEmail}`);
      } else {
        error("Failed to resend code", response.error || "Please try again");
      }
    } catch (err: any) {
      console.error("Resend OTP error:", err);
      let errorMessage = "An unexpected error occurred";
      
      if (err?.message && typeof err.message === 'string') {
        errorMessage = err.message;
      } else if (err?.error && typeof err.error === 'string') {
        errorMessage = err.error;
      }
      
      error("Failed to resend code", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeEmail = () => {
    setShowVerificationModal(false);
    setVerificationEmail("");
  };

  const handleCloseModal = () => {
    setShowVerificationModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      setIsLoading(true);
      try {
        const response = await authApi.login({
          email,
          password
        });

        console.log("Login response:", response);

        // Check for the actual backend response structure
        // Backend returns: {success: true, user, token}
        if (response.success && response.user && response.token) {
          // Store the token and user ID using the new auth function
          const { setAuthToken, handleAuthSuccess } = await import('@/lib/auth');
          setAuthToken(response.token, response.user.id);
          
          // Store user data in local storage
          localStorage.setItem('userData', JSON.stringify(response.user));
          
          // Cookie is already set by the server with HttpOnly flag
          
          success("Login successful!", "Welcome back to LiteFi");
          
          // Check if user is admin and redirect accordingly
          const targetPath = response.user.role === 'ADMIN' ? '/console' : '/dashboard';
          
          // Redirect to the appropriate dashboard
          setTimeout(() => {
            window.location.href = targetPath;
          }, 1500);
        } else {
          // Check if this is an incomplete registration flow
          if (response.message?.toLowerCase().includes('password not set') || 
              response.message?.toLowerCase().includes('complete registration') ||
              response.message?.toLowerCase().includes('create password')) {
            error("Registration incomplete", "Please complete your registration by setting a password");
            
            // Store email for password creation flow
            sessionStorage.setItem('registrationEmail', email);
            
            // Redirect to password creation after a short delay
            setTimeout(() => {
              window.location.href = `/auth/create-password?email=${encodeURIComponent(email)}`;
            }, 2000);
          } else if (response.message?.toLowerCase().includes('verify') && 
                     response.message?.toLowerCase().includes('email')) {
            error("Email verification required", "Please verify your email to continue");
            
            // Store email for email verification flow
            sessionStorage.setItem('registrationEmail', email);
            
            // Show verification message without redirect
            // User can use the signup page for email verification
          } else if (response.message?.toLowerCase().includes('verify') && 
                     (response.message?.toLowerCase().includes('phone') || 
                      response.message?.toLowerCase().includes('otp'))) {
            error("Phone verification required", "Please verify your phone number to continue");
            
            // Store email for phone verification flow
            sessionStorage.setItem('registrationEmail', email);
            
            // Show verification message without redirect
            // User can use the signup page for email verification
          } else if (response.message?.toLowerCase().includes('verify') && 
                     (response.message?.toLowerCase().includes('email') || 
                      response.message?.toLowerCase().includes('mail'))) {
            error("Email verification required", "Please verify your email to continue");
            
            // Store email for email verification flow
            sessionStorage.setItem('registrationEmail', email);
            
            // Show verification message without redirect
            // User can use the signup page for email verification
          } else if (response.message?.toLowerCase().includes('otp') && 
                     (response.message?.toLowerCase().includes('phone') || 
                      response.message?.toLowerCase().includes('sms'))) {
            error("Phone verification required", "Please verify your phone number with OTP to continue");
            
            // Store email for phone verification flow
            sessionStorage.setItem('registrationEmail', email);
            
            // Show verification message without redirect
            // User can use the signup page for email verification
          } else if (response.message?.toLowerCase().includes('otp') && 
                     (response.message?.toLowerCase().includes('email') || 
                      response.message?.toLowerCase().includes('mail'))) {
            error("Email verification required", "Please verify your email with OTP to continue");
            
            // Store email for email verification flow
            sessionStorage.setItem('registrationEmail', email);
            
            // Redirect to sign-up for email verification
            setTimeout(() => {
              window.location.href = `/auth/sign-up`;
            }, 2000);
          } else {
            error("Login failed", response.message || "Invalid email or password");
          }
        }
      } catch (err: any) {
        console.error("Login error:", err);
        
        // Extract the actual error message from the server response
        let errorMessage = "An unexpected error occurred";
        
        // Handle the different error response structures from the backend
        if (err?.response?.status === 403) {
          // Forbidden - email verification required
          errorMessage = err?.response?.data?.message || "Please verify your email before logging in";
          
          // Check if this is specifically about email verification
          if (errorMessage.toLowerCase().includes('verify') && 
              errorMessage.toLowerCase().includes('email')) {
            // Show email verification modal instead of just error message
            setVerificationEmail(email);
            setShowVerificationModal(true);
            setIsLoading(false);
            return; // Don't show error toast, show modal instead
          }
        } else if (err?.response?.status === 401) {
          // Unauthorized - invalid credentials
          errorMessage = err?.response?.data?.message || "Invalid email or password";
        } else if (err?.response?.status === 400) {
          // Bad request - validation errors or account issues
          errorMessage = err?.response?.data?.message || "Please check your credentials";
        } else if (err?.response?.status === 404) {
          // User not found
          errorMessage = "Account not found. Please check your email or sign up for a new account";
        } else if (err?.response?.status === 409) {
          // Account exists but needs completion (email verification, etc.)
          errorMessage = err?.response?.data?.message || "Please complete your account setup";
        } else if (err?.response?.data?.message) {
          // Any other backend error with a message
          errorMessage = err.response.data.message;
        } else if (err?.message && typeof err.message === 'string') {
          // Direct error message
          errorMessage = err.message;
        } else if (err?.error && typeof err.error === 'string') {
          // Error property
          errorMessage = err.error;
        } else if (typeof err === 'string') {
          // Error as string
          errorMessage = err;
        } else if (err?.response?.status >= 500) {
          // Server errors
          errorMessage = "Server is currently unavailable. Please try again later";
        } else if (err?.code === 'NETWORK_ERROR' || !err?.response) {
          // Network errors
          errorMessage = "Unable to connect to server. Please check your internet connection";
        }
        
        console.log("Extracted error message:", errorMessage);
        
        // Handle incomplete registration scenarios in catch block
        if (errorMessage.toLowerCase().includes('verify') && 
            (errorMessage.toLowerCase().includes('phone') || 
             errorMessage.toLowerCase().includes('otp'))) {
          error("Phone verification required", "Please verify your phone number to continue");
          
          // Store email for phone verification flow
          sessionStorage.setItem('registrationEmail', email);
          
          // Show verification message without redirect
          // User can use the signup page for email verification
        } else if (errorMessage.toLowerCase().includes('verify') && 
                   (errorMessage.toLowerCase().includes('email') || 
                    errorMessage.toLowerCase().includes('mail'))) {
          error("Email verification required", "Please verify your email to continue");
          
          // Store email for email verification flow
          sessionStorage.setItem('registrationEmail', email);
          
          // Show verification message without redirect
          // User can use the signup page for email verification
        } else if (errorMessage.toLowerCase().includes('otp') && 
                   (errorMessage.toLowerCase().includes('phone') || 
                    errorMessage.toLowerCase().includes('sms'))) {
          error("Phone verification required", "Please verify your phone number with OTP to continue");
          
          // Store email for phone verification flow
          sessionStorage.setItem('registrationEmail', email);
          
          // Show verification message without redirect
          // User can use the signup page for email verification
        } else if (errorMessage.toLowerCase().includes('otp') && 
                   (errorMessage.toLowerCase().includes('email') || 
                    errorMessage.toLowerCase().includes('mail'))) {
          error("Email verification required", "Please verify your email with OTP to continue");
          
          // Store email for email verification flow
          sessionStorage.setItem('registrationEmail', email);
          
          // Show verification message without redirect
          // User can use the signup page for email verification
        } else if (errorMessage.toLowerCase().includes('password not set') || 
                   errorMessage.toLowerCase().includes('complete registration') ||
                   errorMessage.toLowerCase().includes('create password')) {
          error("Registration incomplete", "Please complete your registration by setting a password");
          
          // Store email for password creation flow
          sessionStorage.setItem('registrationEmail', email);
          
          // Redirect to password creation after a short delay
          setTimeout(() => {
            window.location.href = `/auth/create-password?email=${encodeURIComponent(email)}`;
          }, 2000);
        } else {
          error("Login failed", errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      setEmailTouched(true);
      setPasswordTouched(true);
      error("Login failed", "Please check your email and password");
    }
  };

  // Validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 8;
  const isFormValid = isEmailValid && isPasswordValid;

  const showEmailError = emailTouched && !isEmailValid;
  const showPasswordError = passwordTouched && !isPasswordValid;

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center items-center px-4 py-8">
      {/* Full width form - no side image */}
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white w-full overflow-y-auto px-6 sm:px-8 pt-8 pb-8 rounded-lg shadow-lg">
          <div className="flex justify-center mb-4">
            <Image 
              src={logoImage} 
              alt="LiteFi Logo" 
              width={100}
              height={30}
            />
          </div>

          <h1 className="text-2xl font-bold mb-2 text-center text-black">Log into your account</h1>
          <p className="text-gray-700 text-sm mb-4 text-center">Provide the details below to access your account</p>

          <form onSubmit={handleSubmit} className="space-y-5 pb-8">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-800 font-medium">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email" 
                className={`bg-gray-50 text-black placeholder:text-gray-500 ${showEmailError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                required 
                disabled={isLoading}
              />
              {showEmailError && (
                <p className="text-xs text-red-500">Please enter a valid email address</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-800 font-medium">Password</Label>
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-gray-400 hover:text-gray-500 flex items-center text-sm"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <>
                      <EyeOffIcon className="h-4 w-4 mr-1" />
                      Hide
                    </>
                  ) : (
                    <>
                      <EyeIcon className="h-4 w-4 mr-1" />
                      Show
                    </>
                  )}
                </button>
              </div>
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password"
                className={`bg-gray-50 text-black placeholder:text-gray-500 ${showPasswordError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                required
                disabled={isLoading}
              />
              {showPasswordError && (
                <p className="text-xs text-red-500">Password must be at least 8 characters</p>
              )}
            </div>

            <div className="flex justify-end">
              <Link href="/reset-password" className="text-red-600 text-sm hover:underline">
                Forgot Password?
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={((!isFormValid && (emailTouched || passwordTouched)) || isLoading)}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Don't have an account?{" "}
              <Link href="/signup" className="text-red-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
      
      {/* Email Verification Modal */}
      {showVerificationModal && (
        <EmailVerificationModal
          email={verificationEmail}
          onCloseAction={handleCloseModal}
          onVerifyAction={handleVerifyEmail}
          onResendOtpAction={handleResendOtp}
          onChangeEmailAction={handleChangeEmail}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

export default function Login() {
  return (
    <ToastProvider>
      <Suspense fallback={
        <div className="bg-gray-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      }>
        <LoginContent />
      </Suspense>
      <Toaster />
    </ToastProvider>
  );
}
