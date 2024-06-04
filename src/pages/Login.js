import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { doCreateUserWithEmailAndPassword, doSignInUserWithEmailAndPassword } from '../auth';

export default function Login() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await doSignInUserWithEmailAndPassword(email, password);
      navigate('/inventory', { state: { userEmail: email } });
    } catch (error) {
      setError('Email or password is invalid');
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      setError('');
      await doCreateUserWithEmailAndPassword(email, password);
      await axios.post(`${apiUrl}/users`, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        role: 'USER'
      });
      setIsRegistering(false); 
      navigate('/inventory', { state: { userEmail: email } });
    } catch (error) {
      setError('Account with email exists.');
    }
  };

  const handleSubmit = isRegistering ? handleRegistration : handleLogin;

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-20 w-auto"
          src="https://codedifferently.com/wp-content/uploads/2020/06/Code-Differently-logo-2020-2.png"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {isRegistering ? 'Create a new account' : 'Sign in to your account'}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {isRegistering && (
            <div>
              <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                First Name
              </label>
              <div className="mt-2">
                <input
                  id="first-name"
                  name="first-name"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          )}

          {isRegistering && (
            <div>
              <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                Last Name
              </label>
              <div className="mt-2">
                <input
                  id="last-name"
                  name="last-name"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          )}

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
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
  
            <div>
  <div className="flex items-center justify-between">
    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
      Password
    </label>
    {!isRegistering && (
      <div className="text-sm">
        <Link to="/forgot-password" className="font-semibold text-blue-700 hover:text-blue-800">
          Forgot password?
        </Link>
      </div>
    )}
  </div>
  <div className="mt-2">
    <input
      id="password"
      name="password"
      type="password"
      autoComplete="current-password"
      required
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
    />
  </div>
</div>
            {isRegistering && (
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium leading-6 text-gray-900">
                  Confirm Password
                </label>
                <div className="mt-2">
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            )}
  
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-customOrange px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#d6692a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#50d71e]"
              >
                {isRegistering ? 'Sign up' : 'Sign in'}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-red-600">
                {error}
              </p>
            )}
  
          </form>
  
          <p className="mt-10 text-center text-sm text-gray-500">
            {isRegistering ? 'Already have an account? ' : 'Not a member? '}
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="font-semibold leading-6 text-customBlue hover:text-[#345ca6] focus:outline-none"
            >
              {isRegistering ? 'Sign in' : 'Register'}
            </button>
          </p>
        </div>
      </div>
    );
  }