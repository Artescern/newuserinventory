import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; 
import SideNav from '../components/SideNav';

const ProfileInformation = () => {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL; 
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profileImage: ''
  });
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage' && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          profileImage: files[0],
        }));
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(files[0]);
      console.log(files[0]);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        setError(''); 
        const formDataToSend = new FormData();
        formDataToSend.append('firstName', formData.firstName);
        formDataToSend.append('lastName', formData.lastName);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('profilePicture', formData.profileImage);
        for (let [key, value] of formDataToSend.entries()) {
          console.log(`${key}: ${value}`);
      }
        const response = await axios.put(`${apiUrl}/users/8`, formDataToSend);

        const uploadedImageUrl = response.data.imageUrl;

        setPreviewImage(uploadedImageUrl);

        console.log('Profile updated successfully');
    } catch (error) {
        setError('Failed to update profile. Please try again.');
        console.error('Error updating profile:', error);
    }
};


  const handlePasswordReset = async () => {
    try {
      setError(''); 
      navigate()
    } catch (error) {
      setError('Failed to request password reset. Please try again.');
      console.error('Error requesting password reset:', error);
    }
  };

  return (
    
    <div className="flex">
    <SideNav previewImage={previewImage} />
      <div className="flex-1 min-h-full flex flex-col items-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-lg">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Edit your Profile
          </h2>
        </div>
  
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg flex flex-col items-center">
          <div className="flex flex-col items-center">
            <img
              className="rounded-full w-48 h-48 mb-4"
              src={previewImage || "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png"}
              alt="Profile avatar"
            />
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload file</label>
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              aria-describedby="file_input_help"
              id="file_input"
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleChange}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
          </div>
          <form className="flex-1 mt-6 w-full" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:ring focus:ring-opacity-50 placeholder-gray-400 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="lastName" className="block text-sm font-medium leading-6 text-gray-900">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:ring focus:ring-opacity-50 placeholder-gray-400 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:ring focus:ring-opacity-50 placeholder-gray-400 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="mb-6">
            <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="flex w-full justify-center rounded-md bg-customOrange px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#d6692a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus-visible:ring-opacity-75"
            >
                Request Password Reset
            </button>
            </div>
            <div>
            <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-customOrange hover:bg-[#d6692a] px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus-visible:ring-opacity-75"
            >
                Save
            </button>
            </div>
              {error && (
                <p className="mt-2 text-sm text-red-600">
                  {error}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  };
  
  export default ProfileInformation;
  
