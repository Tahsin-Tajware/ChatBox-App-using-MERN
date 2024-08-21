import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { setAuthUser } = useAuth();

    const [userInput, setUserInput] = useState({});
    const [loading, setLoading] = useState(false);

    const handelInput = (e) => {
        setUserInput({
            ...userInput, [e.target.id]: e.target.value
        });
    };
    console.log(userInput);

    const handelSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const login = await axios.post(`/api/auth/login`, userInput);
            const data = login.data;
            if (data.success === false) {
                setLoading(false);
                console.log(data.message);
            }
            toast.success(data.message);
            localStorage.setItem('chatapp', JSON.stringify(data));
            setAuthUser(data);
            setLoading(false);
            navigate('/');
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center w-full h-screen'>
            <div className='w-96 p-4 rounded-lg shadow-lg bg-white'>
                <h1 className='text-2xl font-bold text-center text-gray-700 mb-4'>
                    Login <span className='text-gray-950'></span>
                </h1>
                <form onSubmit={handelSubmit} className='flex flex-col text-black'>
                    <div className='mb-4'>
                        <label className='label'>
                            <span className='font-bold text-gray-700 text-lg label-text'>Email:</span>
                        </label>
                        <input
                            id='email'
                            type='email'
                            onChange={handelInput}
                            placeholder='Enter your email'
                            required
                            className='w-full input input-bordered h-10 bg-white' />
                    </div>
                    <div className='mb-4'>
                        <label className='label'>
                            <span className='font-bold text-gray-700 text-lg label-text'>Password:</span>
                        </label>
                        <input
                            id='password'
                            type='password'
                            onChange={handelInput}
                            placeholder='Enter your password'
                            required
                            className='w-full input input-bordered h-10 bg-white' />
                    </div>
                    <button
                        type='submit'
                        className='self-center w-full py-2 bg-green-600 text-lg hover:bg-green-500 text-white rounded-lg'>
                        {loading ? "Loading..." : "Login"}
                    </button>
                </form>
                <div className='pt-4'>
                    <p className='text-sm font-semibold text-gray-600 text-center'>
                        Don't have an account? <Link to={'/register'}>
                            <span className='text-red-600 font-bold underline cursor-pointer hover:text-red-800'>
                                Register Now!!
                            </span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
