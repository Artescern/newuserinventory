import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideNav from '../components/SideNav';

const ProfileInformation = () => {
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL; 

  const [id, setId] = useState("") 
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState("");

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    console.log(storedUserInfo)
    setId(storedUserInfo.id)
    setFirstName(storedUserInfo.firstName)
    setLastName(storedUserInfo.lastName)
    setEmail(storedUserInfo.email)
    setProfilePic(storedUserInfo.firstName)

}, []);

const handleFirstNameChange = (e) => {
  setFirstName(e.target.value);
};

const handleLastNameChange = (e) => {
  setLastName(e.target.value);
};

const handleProfilePicChange = (e) => {
  const file = e.target.files[0];
  setProfilePic(file);

  const reader = new FileReader();
  reader.onloadend = () => {
    setProfilePicPreview(reader.result);
  };
  reader.readAsDataURL(file);
};

const postTextData = async () => {
  const updatedProfile = {
    firstName,
    lastName,
    email
  };

  try {

    const response = await fetch(`${apiUrl}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProfile),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    if (profilePic) {
      const formData = new FormData();
      formData.append('file', profilePic);
      console.log("posting profile pic")

      const imageResponse = await fetch(`${apiUrl}/users/${id}/profile-picture`, {
        method: 'POST',
        body: formData,
      });

      if (!imageResponse.ok) {
        throw new Error('Image upload failed');
      }
    }

    const result = await response.json();
    console.log('Profile updated successfully:', result);
  } catch (error) {
    console.error('Error updating profile:', error);
  }
};




  return (
    <div className="flex">
      <SideNav />
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
              src={profilePicPreview || "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png"}
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
              onChange={handleProfilePicChange}

            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">SVG, PNG, JPG or GIF (MAX. 800x400px).</p>
          </div>
          <form className="flex-1 mt-6 w-full">
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-sm font-medium leading-6 text-gray-900">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="block w-full rounded-md border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:ring focus:ring-opacity-50 placeholder-gray-400 sm:text-sm sm:leading-6"
                value={firstName}
                onChange={handleFirstNameChange}
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
                className="block w-full rounded-md border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 focus:ring focus:ring-opacity-50 placeholder-gray-400 sm:text-sm sm:leading-6"
                value={lastName}
                onChange={handleLastNameChange}
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
                
                className="flex w-full justify-center rounded-md bg-customOrange hover:bg-[#d6692a] px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus-visible:ring-opacity-75"
                onClick={postTextData}
              >
                Save
              </button>
            </div>
            <p className="mt-2 text-sm text-red-600">
              {/* Error message placeholder */}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileInformation;
