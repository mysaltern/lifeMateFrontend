'use client';
import React from 'react';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from 'next/link';
import LayoutLogin from '../latout_login/page';
import LayoutLoginFooter from '../latout_login_footer/page';
import { useState } from 'react';
import { API_BASE_URL } from '../../../config/development';
import { useRouter } from 'next/navigation'
const SignInPage: React.FC = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [isAlertVisible, setAlertVisible] = useState(false);
    const router = useRouter();
    const handleSignIn = async () => {
      
        // Validate email
        if (!email) {
            setEmailError('Email is required');
            return;
        }

        // Basic email validation, you might want to use a library for more comprehensive validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError('Invalid email format');
            return;
        }

        // Validate password
        if (!password) {
            setPasswordError('Password is required');
            return;
        }

        // Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            setPasswordError('Invalid password format');
            return;
        }




        try {
            const response = await fetch(`${API_BASE_URL}/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: email, // Assuming email is used as the username
                    password,
                }),
            });

            const data = await response.json();

            if (response.status === 200) {
                localStorage.setItem('token', data.token);
                // Successfully signed up, handle the response as needed
                router.push('/');
                // Optionally, you can redirect the user to a different page or show a success message
            } else {
                setAlertMessage(data.error);
                setAlertVisible(true);
                // Handle error response
                console.error('Signup failed:', data);

                // Display error messages to the user if needed
            }
        } catch (error) {
            console.error('Error during signup:', error);
        }
    }

    return (
        <div className="container mx-auto bg-slate-800">

            <LayoutLogin />

            <div id='signup' className="text-center">
                <div className='text-4xl font-bold text-slate-50 text-center  mt-10 mr-40'>
                    Sign In
                </div>
                <p className="text-red-500">{emailError}</p>
                <div className='flex items-center justify-center'>
                    <div className='relative mt-5 rounded-lg p-1 bg-slate-600  w-72' >
                        <input className='pl-4 bg-transparent text-white placeholder-white rounded-lg p-1 w-full'
                            type='text'
                            placeholder='Enter your email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className='absolute inset-y-0 right-1 flex items-center'>
                            <FontAwesomeIcon icon={faEnvelope} className='text-gray-400 mr-3 w-5 mx-auto' />
                        </div>
                    </div>
                </div>
                <br />
                <p className="text-red-500">{passwordError}</p>
                <div className='flex items-center justify-center'>
                    <div className='relative rounded-lg p-1 bg-slate-600  w-72' >
                        <input className='pl-4 bg-transparent text-white placeholder-white rounded-lg p-1 w-full'
                            type='password'
                            placeholder='Enter your password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className='flex items-center justify-center'  >
                    <div className='relative mt-6 rounded-lg bg-slate-600 p-1 w-72 cursor-pointer'  >
                        {/* <Link className='ml-1' href="/chat"> */}
                        <button onClick={handleSignIn} className='h-8 px-6 text-indigo-100 transition-colors duration-150 rounded-lg focus:shadow-outline'>


                            Signin

                        </button>
                        {/* </Link> */}
                    </div>
                </div>

            </div>
            <div className="flex items-center justify-center">

                {/* Alert div */}
                {isAlertVisible && (
                    <div className="mt-4 bg-red-400 w-72 text-white p-2 text-center rounded">
                        {alertMessage}
                    </div>
                )}
            </div>
            <div className='flex items-center justify-center mt-4'>

                <Link className='ml-1' href="/forgot">forgot you password? </Link>
            </div>
            <LayoutLoginFooter />


        </div>
    );
};

export default SignInPage;
