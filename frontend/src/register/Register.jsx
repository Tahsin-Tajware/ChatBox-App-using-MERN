import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { setAuthUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [inputData, setInputData] = useState({});

    const handelInput = (e) => {
        setInputData({
            ...inputData, [e.target.id]: e.target.value
        });
    };
    
    console.log(inputData);

    const selectGender = (selectGender) => {
        setInputData((prev) => ({
            ...prev, gender: selectGender === inputData.gender ? '' : selectGender
        }));
    };

    const handelSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (inputData.password !== inputData.confpassword.toLowerCase()) {
            setLoading(false);
            return toast.error("Password doesn't match");
        }
        try {
            const register = await axios.post(`/api/auth/register`, inputData);
            const data = register.data;
            if (data.success === false) {
                setLoading(false);
                toast.error(data.message);
                console.log(data.message);
            }
            toast.success(data?.message);
            localStorage.setItem('chatapp', JSON.stringify(data));
            setAuthUser(data);
            setLoading(false);
            navigate('/login');
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
                    Register <span className='text-gray-950'></span>
                </h1>
                <form onSubmit={handelSubmit} className='flex flex-col text-black'>
                    <div className='mb-4'>
                        <label className='label'>
                            <span className='font-bold text-gray-700 text-lg label-text'>Full Name:</span>
                        </label>
                        <input
                            id='fullname'
                            type='text'
                            onChange={handelInput}
                            placeholder='Enter Full Name'
                            required
                            className='w-full input input-bordered h-10 bg-white' />
                    </div>
                    <div className='mb-4'>
                        <label className='label'>
                            <span className='font-bold text-gray-700 text-lg label-text'>Username:</span>
                        </label>
                        <input
                            id='username'
                            type='text'
                            onChange={handelInput}
                            placeholder='Enter Username'
                            required
                            className='w-full input input-bordered h-10 bg-white' />
                    </div>
                    <div className='mb-4'>
                        <label className='label'>
                            <span className='font-bold text-gray-700 text-lg label-text'>Email:</span>
                        </label>
                        <input
                            id='email'
                            type='email'
                            onChange={handelInput}
                            placeholder='Enter Email'
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
                            placeholder='Enter Password'
                            required
                            className='w-full input input-bordered h-10 bg-white' />
                    </div>
                    <div className='mb-4'>
                        <label className='label'>
                            <span className='font-bold text-gray-700 text-lg label-text'>Confirm Password:</span>
                        </label>
                        <input
                            id='confpassword'
                            type='password'
                            onChange={handelInput}
                            placeholder='Confirm Password'
                            required
                            className='w-full input input-bordered h-10 bg-white' />
                    </div>
                    <div className='mb-4 flex gap-2'>
                        <label className='cursor-pointer label flex gap-2'>
                            <span className='label-text font-semibold text-gray-700'>Male</span>
                            <input
                                onChange={() => selectGender('male')}
                                checked={inputData.gender === 'male'}
                                type='checkbox'
                                className='checkbox checkbox-info' />
                        </label>
                        <label className='cursor-pointer label flex gap-2'>
                            <span className='label-text font-semibold text-gray-700'>Female</span>
                            <input
                                onChange={() => selectGender('female')}
                                checked={inputData.gender === 'female'}
                                type='checkbox'
                                className='checkbox checkbox-info' />
                        </label>
                    </div>
                    <button
                        type='submit'
                        className='self-center w-full py-2 bg-green-600 text-lg hover:bg-green-500 text-white rounded-lg'>
                        {loading ? "Loading..." : "Register"}
                    </button>
                </form>
                <div className='pt-4'>
                    <p className='text-sm font-semibold text-gray-600 text-center'>
                        Already have an account? <Link to={'/login'}>
                            <span className='text-blue-600 font-bold underline cursor-pointer hover:text-red-800'>
                                Login Now!!
                            </span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
