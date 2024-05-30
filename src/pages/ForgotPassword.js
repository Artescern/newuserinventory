import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doPasswordReset } from '../auth';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [emailMsg, setEmailMsg] = useState(false);

  const forgotPassword = async (e) => {
    e.preventDefault();
    try {
      setMessage('');
      setLoading(true);
      await doPasswordReset(email);
      setEmailMsg(true);
    } catch (error) {
      setMessage('Could not send email');
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-20 w-auto"
          src="https://codedifferently.com/wp-content/uploads/2020/06/Code-Differently-logo-2020-2.png"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Forgot Password
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={forgotPassword}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-customBlue sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-customOrange px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#d6692a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#50d71e]"
            >
              Send reset link
            </button>
          </div>
          {emailMsg && (
            <p className="mt-2 text-sm text-gray-500">
              Check your email for further instructions.
            </p>
          )}
          {message && (
            <p className="mt-2 text-sm text-red-600">
              {message}
            </p>
          )}
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Remember your password?{' '}
          <Link to="/" className="font-semibold leading-6 text-customBlue hover:text-[#345ca6]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;