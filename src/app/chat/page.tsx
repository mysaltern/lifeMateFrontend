'use client';
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faChevronUp, faChevronDown, faCamera, faBell, faUser, faUpload } from '@fortawesome/free-solid-svg-icons';
import './styles.css';
import { API_BASE_URL } from '../../../config/development';
import ProgressSection from '../progresssection/ProgressSection';
import { getToken } from '../../../utils/auth';
import { useRouter } from 'next/navigation';
const Chat: React.FC = () => {
    const router = useRouter();
    const [messagesFetch, setmessagesFetch] = useState([]);
    const [messages, setMessages] = useState([
        { message: "Hello", type: 'robot', questionID: null, answerID: null },
    ]);
    const [answer, setAnswer] = useState('');
    const [questionID, setQuestionID] = useState('');
    const apiCallMade = useRef(false);
    const [userToken, setUserToken] = useState<string | null>('');
    const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAnswer(event.target.value);
    };
    useEffect(() => {
        // Function to check if the user is authenticated
        const checkAuthentication = async () => {
            try {
                // Retrieve the token from localStorage
                const token = await getToken();
                setUserToken(token);
                // If the token is not present, redirect to the login page
                if (!token) {
                    router.push('/signin');
                    return;
                }

                // Send a request to your server to verify the token
                const responseToken = await fetch(`${API_BASE_URL}/check-auth`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                // Assuming the server responds with a 200 status for a valid token
                if (responseToken.status === 200) {
                    // User is authenticated, proceed with fetching questions
                    fetchQuestions(12, token);
                } else {
                    // Redirect to the login page if the token is not valid
                    router.push('/signin');
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                // Redirect to the login page on error
                router.push('/signin');
            }
        };

        // Call the checkAuthentication function when the component mounts
        checkAuthentication();
    }, []);
    const handleSubmit = async () => {


        try {
            const response = await fetch(`${API_BASE_URL}/answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    questionID: questionID,
                    userID: '1',
                    answerDescription: answer,
                }),
            });


            const data = await response.json();

            console.log('API response:', data);

            if (response.status === 200) {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { message: answer, type: 'user', questionID: null, answerID: data['response']['answerID'] }
                ]);

                setAnswer('');
                apiCallMade.current = false;
                fetchQuestions(12, userToken);
            }
            else {
                // If the response status is not 200, handle the error and add an error message to the setMessages array
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { message: (data as any).message || 'Error submitting answer. Please try again.', type: 'robot', questionID: null, answerID: data.response.answerID },
                ]);
            }
            // Clear the answer field after submission


        } catch (error) {
            console.error('Error submitting answer:', error);
        }
    };
    const fetchQuestions = async (userID: number, userToken: string | null) => {
        try {
            const response = await fetch(`${API_BASE_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`, // Include the Bearer token
                },
                body: JSON.stringify({
                    userID: userID,
                }),
            });

            const data = await response.json();
            setmessagesFetch(data);
            if (!apiCallMade.current) {
                apiCallMade.current = true;
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        message: data['response']['questionDescription'],
                        type: 'robot',
                        questionID: data['response']['questionID'],
                        answerID: null,
                    },
                ]);
                setQuestionID(data['response']['questionID']);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getToken(); // Wait for the token
                if (token && typeof token === 'string') {
                    fetchQuestions(12, token);
                } else {
                    console.error('Token is null or not a string');
                }
            } catch (error) {
                console.error('Error fetching token:', error);
            }
        };

        fetchData();
    }, [apiCallMade]);


    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {

        if (event.key === 'Enter') {
            // If Enter key is pressed, run the handleSubmit function
            handleSubmit();
        }
    };

    return (
        <div className="flex">
            <div className="w-2/12 bg-slate-800 h-screen overflow-y-auto">
                <ProgressSection />
            </div>
            <div className="w-10/12 ">
                <div className='headerMain sticky top-0 z-50'>
                    <div className='bg-slate-300 pt-2 pb-4'>
                        <div className="flex justify-between">
                            <div>
                                <input type="text" placeholder='Search Somthing...' className='w-44 h-7 rounded bg-gray-600 relative ml-5 p-3 top-1' />
                            </div>
                            <div className='mr-10'>
                                {/* <input type="button" value='Create' className='w-24 h-7 rounded bg-gray-600 relative ml-5 cursor-pointer hover:text-gray-300' /> */}
                                <FontAwesomeIcon icon={faBell} className='text-gray-400 w-12 h-7 top-1 relative cursor-pointer hover:text-blue-500' />
                                <FontAwesomeIcon icon={faUser} className='text-gray-400 w-12 h-7 top-1 relative cursor-pointer hover:text-blue-500' />

                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col min-h-screen'>

                    <div className='BodyMain bg-slate-600 flex-1 flex flex-col items-end p-10 relative'>


                        {messages.map((messageObj, index) => (
                            <div
                                key={index}
                                className={`flex ${messageObj.type === 'user' ? 'justify-end' : 'justify-start'} w-full mb-2`}
                            >
                                <div className={`bg-gray-700 text-gray-300 rounded-md p-2 max-w-xs ${messageObj.type === 'user' ? 'UserMessage' : 'RobotMessage'}`}>
                                    <p>{messageObj.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='submitText max-h-24 min-h-10 bg-slate-500 flex items-center justify-between sticky bottom-0 w-full'>
                        <input
                            id='answer'
                            type='text'
                            placeholder='Say Something.....'
                            className='bg-slate-500 w-[95%] p-5'
                            value={answer}
                            onKeyDown={handleKeyDown as any}
                            onChange={handleAnswerChange}  // Call the function when the input changes
                        />
                        <div className='flex items-center'>
                            <FontAwesomeIcon
                                icon={faUpload} onClick={handleSubmit} className='text-gray-400 w-12 h-7 pr-5 cursor-pointer hover:text-blue-500' />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Chat;
