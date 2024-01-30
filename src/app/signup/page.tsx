'use client';
import React, { useState } from 'react';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LayoutLogin from '../latout_login/page';
import LayoutLoginFooter from '../latout_login_footer/page';
import { API_BASE_URL } from '../../../config/development';

const SignUpPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [isAlertVisible, setAlertVisible] = useState(false);
    const handleSignUp = async () => {
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
            const response = await fetch(`${API_BASE_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: email, // Assuming email is used as the username
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (response.status === 200) {
                setAlertMessage('Signup successful!');
                setAlertVisible(true);
                // Successfully signed up, handle the response as needed
                console.log('Signup successful:', data);

                // Optionally, you can redirect the user to a different page or show a success message
            } else {
                // Handle error response
                console.error('Signup failed:', data);

                // Display error messages to the user if needed
            }
        } catch (error) {
            console.error('Error during signup:', error);
        }

        // If validation passes, you can proceed with the signup logic
        // ...

        // Reset error messages
        setEmailError('');
        setPasswordError('');
    };

    return (
        <div className="container mx-auto">
            <LayoutLogin />

            <div id="signup" className="text-center">
                <div className="text-4xl font-bold text-slate-50 text-center mt-10 mr-40">
                    Sign Up
                </div>

                <div className="flex items-center justify-center">
                    <div className="relative mt-5 rounded-lg p-1 bg-slate-600 w-72">
                        <input
                            className="pl-4 bg-transparent text-white placeholder-white rounded-lg p-1 w-full"
                            type="text"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-1 flex items-center">
                            <FontAwesomeIcon
                                icon={faEnvelope}
                                className="text-gray-400 w-5 mx-auto mr-3"
                            />
                        </div>
                    </div>
                </div>
                <p className="text-red-500">{emailError}</p>
                <br />
                <div className="flex items-center justify-center">
                    <div className="relative rounded-lg p-1 bg-slate-600 w-72">
                        <input
                            className="pl-4 bg-transparent text-white placeholder-white rounded-lg p-1 w-full"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-1 flex items-center">
                            <FontAwesomeIcon
                                icon={faLock}
                                className="text-gray-400 w-5 mx-auto mr-3"
                            />
                        </div>
                    </div>
                </div>
                <p className="text-red-500">{passwordError}</p>
                <div className="flex items-center justify-center">
                    <div className="relative mt-6 rounded-lg bg-slate-600 p-1 w-72 cursor-pointer">
                        <button
                            onClick={handleSignUp}
                            className="h-8 px-6 text-indigo-100 transition-colors duration-150 rounded-lg focus:shadow-outline"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                        {/* ... rest of your component */}

                        {/* Alert div */}
                        {isAlertVisible && (
                            <div className="mt-4 bg-green-700 w-72 text-white p-2 rounded">
                                {alertMessage}
                            </div>
                        )}
                    </div>

            </div>
            <LayoutLoginFooter />
        </div>
    );
};

export default SignUpPage;
