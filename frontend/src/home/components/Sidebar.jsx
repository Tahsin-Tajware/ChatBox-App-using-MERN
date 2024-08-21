import React, { useEffect, useRef, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { IoArrowBackSharp } from 'react-icons/io5';
import { BiLogOut } from 'react-icons/bi';
import userConversation from '../../Zustan/userConversation';
import { useSocketContext } from '../../context/SocketContext';

const Sidebar = ({ onSelectUser }) => {
    const navigate = useNavigate();
    const { authUser, setAuthUser } = useAuth();
    const { socket, onlineUser } = useSocketContext();
    const [searchInput, setSearchInput] = useState('');
    const [searchUser, setSearchUser] = useState([]);
    const [chatUser, setChatUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const { message, selectedConversation, setSelectedConversation } = userConversation();
    const [newMessageUsers, setNewMessageUsers] = useState('');
    const [showLogoutDropdown, setShowLogoutDropdown] = useState(false);

    const dropdownRef = useRef(null);

    const talkedWith = chatUser.map((user) => user._id);
    const isOnline = talkedWith.map(userId => onlineUser.includes(userId));
    console.log(isOnline);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowLogoutDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    useEffect(() => {
        const chatUserHandler = async () => {
            setLoading(true);
            try {
                const chatters = await axios.get(`/api/user/currentchatters`);
                const data = chatters.data;
                if (data.success === false) {
                    setLoading(false);
                    console.log(data.message);
                }
                setLoading(false);
                setChatUser(data);
            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        };
        chatUserHandler();
    }, []);

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const search = await axios.get(`/api/user/search?search=${searchInput}`);
            const data = search.data;
            if (data.success === false) {
                setLoading(false);
                console.log(data.message);
            }
            setLoading(false);
            if (data.length === 0) {
                toast.info("User Not Found");
            } else {
                setSearchUser(data);
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const handleUserClick = (user) => {
        onSelectUser(user);
        setSelectedUserId(user._id);
        setSelectedConversation(user);
    };

    const handleSearchBack = () => {
        setSearchUser([]);
        setSearchInput('');
    };

    useEffect(() => {
        socket?.on('newMessage', (newMessage) => {
            setNewMessageUsers(newMessage);
        });
        return () => socket?.off("newMessage");
    }, [socket, message]);

    const handleLogOut = async () => {
        setLoading(true);
        try {
            const logout = await axios.post('/api/auth/logout');
            const data = logout.data;
            if (data?.success === false) {
                setLoading(false);
                console.log(data?.message);
            }
            toast.info(data?.message);
            localStorage.removeItem('chatapp');
            setAuthUser(null);
            setLoading(false);
            navigate('/login');
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    return (
        <div className='h-full w-auto px-1'>
            <div className='flex justify-between gap-2 relative'>
                <form onSubmit={handleSearchSubmit} className='w-auto flex items-center justify-between bg-white rounded-full'>
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        type='text'
                        className='px-4 w-auto bg-transparent outline-none rounded-full'
                        placeholder='search user'
                    />
                    <button className='btn btn-circle bg-sky-700 hover:bg-gray-950'>
                        <FaSearch />
                    </button>
                </form>

                <div className="relative" ref={dropdownRef}>
                    <img
                        onClick={() => setShowLogoutDropdown(!showLogoutDropdown)}
                        src={authUser?.profilepic}
                        className='self-center h-12 w-12 hover:scale-110 cursor-pointer rounded-full'
                        alt='Profile'
                    />
                    {showLogoutDropdown && (
                        <div className="absolute right-0 top-14 bg-white shadow-md rounded-lg p-2">
                            <div className="flex flex-col items-center">
                                <p className="text-lg font-semibold">{authUser?.username}</p>
                                <button
                                    onClick={handleLogOut}
                                    className='mt-2 hover:bg-red-600 p-2 cursor-pointer hover:text-white rounded-lg flex items-center gap-2'>
                                    <BiLogOut size={25} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className='divider px-3'></div>
            {searchUser?.length > 0 ? (
                <>
                    <div className="min-h-[70%] max-h-[80%] overflow-y-auto scrollbar">
                        <div className='w-auto'>
                            {searchUser.map((user, index) => (
                                <div key={user._id}>
                                    <div
                                        onClick={() => handleUserClick(user)}
                                        className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer ${selectedUserId === user?._id ? 'bg-sky-500' : ''}`}>
                                        <div className={`avatar ${isOnline[index] ? 'online' : ''}`}>
                                            <div className="w-12 rounded-full">
                                                <img src={user.profilepic} alt='user.img' />
                                            </div>
                                        </div>
                                        <div className='flex flex-col flex-1'>
                                            <p className='font-bold text-white'>{user.username}</p>
                                        </div>
                                    </div>
                                    <div className='divider divide-solid px-3 h-[1px]'></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='mt-auto px-1 py-1 flex'>
                        <button onClick={handleSearchBack} className='bg-white rounded-full px-2 py-1 self-center'>
                            <IoArrowBackSharp size={25} />
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="min-h-[70%] max-h-[80%] overflow-y-auto scrollbar">
                        <div className='w-auto'>
                            {chatUser.length === 0 ? (
                                <div className='font-bold items-center flex flex-col text-xl text-white-500'>
                                    <h1>Why are you Alone!!</h1>
                                    <h1>Search username to chat</h1>
                                </div>
                            ) : (
                                chatUser.map((user, index) => (
                                    <div key={user._id}>
                                        <div
                                            onClick={() => handleUserClick(user)}
                                            className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer ${selectedUserId === user?._id ? 'bg-sky-500' : ''}`}>
                                            <div className={`avatar ${isOnline[index] ? 'online' : ''}`}>
                                                <div className="w-12 rounded-full">
                                                    <img src={user.profilepic} alt='user.img' />
                                                </div>
                                            </div>
                                            <div className='flex flex-col flex-1'>
                                                <p className='font-bold text-white'>{user.username}</p>
                                            </div>
                                            <div>
                                                {selectedConversation === null && 
                                                newMessageUsers.reciverId === authUser._id  
                                                && newMessageUsers.senderId === user._id ? 
                                                <div className="rounded-full bg-green-700 text-sm text-white px-[4px]">+1</div>
                                                : <></>}
                                            </div>
                                        </div>
                                        <div className='divider divide-solid px-3 h-[1px]'></div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Sidebar;
