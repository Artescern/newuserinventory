import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { doSignOut } from '../auth';

export default function SideNav({ userEmail }) {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/users/email/${userEmail}`);
                const userData = response.data;
                setUserInfo(userData);
                localStorage.setItem('userInfo', JSON.stringify(userData)); 
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (userEmail) {
            fetchUserData();
        }
    }, [userEmail]);

    useEffect(() => {
        if (userInfo && userInfo.profilePicture) {
            setProfilePicture(userInfo.profilePicture);
        }
    }, [userInfo]);

    const handleLogout = async () => {
        try {
            await doSignOut();
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className='flex'>
            <div className={`bg-white h-screen shadow-xl ${isSidebarOpen ? 'w-30 md:w-60 lg:w-60' : 'w-18'} overflow-x-hidden transition-width duration-300 ease-in-out flex flex-col justify-between`}>
                <div className="space-y-6 md:space-y-10 mt-10">
                    <div className="flex items-center justify-between px-3">
                        <button onClick={toggleSidebar} className="focus:outline-none">
                            <svg
                                className="w-9 h-6 fill-current text-gray-700"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 9a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM4 14a1 1 0 100 2h12a1 1 0 100-2H4z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </button>
                        {isSidebarOpen && (
                            <img
                                className="h-10 w-auto transition-all duration-300 mx-auto"
                                src="https://codedifferently.com/wp-content/uploads/2020/06/Code-Differently-logo-2020-2.png"
                                alt="Your Company"
                            />
                        )}
                    </div>
                    <div id="menu" className="flex flex-col space-y-2">
                        <Link
                            to="/inventory"
                            className="text-sm font-medium text-black py-2 px-2 hover:bg-customBlue hover:text-white rounded-md transition duration-150 ease-in-out flex items-center"
                        >
                            <svg
                                className="w-10 h-6 fill-current inline-block"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M4 2a1 1 0 00-1 1v14a1 1 0 001 1h12a1 1 0 001-1V3a1 1 0 00-1-1H4zm0 2h12v12H4V4zm3 1v2h6V5H7zm0 4v2h6V9H7zm0 4v2h6v-2H7z"
                                />
                            </svg>
                            {isSidebarOpen && <span className="">Inventory</span>}
                        </Link>
                        <Link
                            to="/dashboard"
                            className="text-sm font-medium text-black py-2 px-2 hover:bg-customBlue hover:text-white rounded-md transition duration-150 ease-in-out flex items-center">
                            <svg
                                className="w-10 h-6 fill-current inline-block"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                ></path>
                            </svg>
                            {isSidebarOpen && <span className="">Dashboard</span>}
                        </Link>
                        <Link
                            to="/profile"
                            className="text-sm font-medium text-black py-2 px-2 hover:bg-customBlue hover:text-white rounded-md transition duration-150 ease-in-out flex items-center">
                            <svg
                                className="w-10 h-6 fill-current inline-block"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path                                    fillRule="evenodd"
                                    d="M10 12a5 5 0 100-10 5 5 0 000 10zm-7 8a7 7 0 1114 0H3z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {isSidebarOpen && <span className="">Profile</span>}
                        </Link>
                    </div>
                </div>
                {isSidebarOpen && (
                    <div className="space-y-6 md:space-y-10 mb-10">
                        <div id="profile" className="space-y-3">
                            {/* Display profile picture */}
                            {profilePicture && (
                                <img
                                    src={`data:${userInfo.profilePictureType};base64,${profilePicture}`}
                                    alt="Avatar user"
                                    className="w-21 h-24 md rounded-full mx-auto"
                                />
                            )}
                            <div>
                                <h2 className="font-medium text-xs xl:text-sm text-center text-teal-500">
                                    {userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : "Loading..."}
                                </h2>
                                <p className="xl:text-sm text-xs text-gray-500 text-center">
                                    {userInfo ? userInfo.role : "Loading..."}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={handleLogout}
                                className="flex w-4/5 mx-auto justify-center rounded-md bg-[#e67936] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#d6692a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#50d71e]"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

