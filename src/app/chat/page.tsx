'use client';
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faChevronUp, faChevronDown, faCamera, faBell, faUser, faUpload } from '@fortawesome/free-solid-svg-icons';
import './styles.css';
import { API_BASE_URL } from '../../../config/development';
import ProgressSection from '../progresssection/ProgressSection';
import { getToken } from '../../../utils/auth';
import { useRouter } from 'next/navigation';
import { error } from 'console';
const ChatSection: React.FC<{ token: string | null }> = (props) => {
    const router = useRouter();
    const [messagesFetch, setmessagesFetch] = useState([]);
    const [messages, setMessages] = useState([
        { message: "Hello", type: 'robot', questionID: null, answerID: null },
    ]);
    const [answer, setAnswer] = useState('');
    const [questionID, setQuestionID] = useState('');
    const apiCallMade = useRef(false);
    const apiCallMadeAuth = useRef(false);
    const [userToken, setUserToken] = useState<string | null>('');
    const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAnswer(event.target.value);
    };

    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    useEffect(() => {
        const sendLocationToBackend = async () => {
            try {
                // Make sure userLocation is not null before sending
                if (userLocation) {
                    // Send the user's location to the backend
                    const response = await fetch(`${API_BASE_URL}/send_location`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${props.token}`, // Assuming you have userToken available
                        },
                        body: JSON.stringify(userLocation),
                    });
    
                    if (response.ok) {
                        console.log('User location sent successfully:', userLocation);
                    } else {
                        console.error('Error sending user location:', response.statusText);
                    }
                }
            } catch (error) {
                console.error('Error sending user location:', error);
            }
        };
    
        // Call the function to send location when userLocation changes
        sendLocationToBackend();
    }, [userLocation]);

    useEffect(() => {
        const fetchUserLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        // Retrieve latitude and longitude from position object
                        const { latitude, longitude } = position.coords;
                        setUserLocation({ latitude, longitude });
                    },
                    (error) => {
                        console.error('Error getting user location:', error);
                        // Handle errors if permission denied or other issues occur
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
                // Handle case where Geolocation API is not supported
            }
        };

        // Call fetchUserLocation when the component mounts
        fetchUserLocation();
        // Function to check if the user is authenticated
        const checkAuthentication = async () => {
            try {
                // Retrieve the token from localStorage
    
      
                // Send a request to your server to verify the token
                const responseToken = await fetch(`${API_BASE_URL}/check-auth`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${props.token}`,
                    },
                });

                // Assuming the server responds with a 200 status for a valid token
                if (responseToken.status === 200) {
                    // User is authenticated, proceed with fetching questions
                    fetchQuestions(12, props.token);
                } else {
                    // Redirect to the login page if the token is not valid
                    router.push('/signin');
                }


            // Fetch user location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        // Retrieve latitude and longitude from position object
                        const { latitude, longitude } = position.coords;
                        setUserLocation({ latitude, longitude });
                        
                    },
                    (error) => {
                        console.error('Error getting user location:', error);
                        // Handle errors if permission denied or other issues occur
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
                // Handle case where Geolocation API is not supported
            }



            } catch (error) {
                console.error('Error checking authentication:', error);
                // Redirect to the login page on error
                router.push('/signin');
            }
        };

        if (!apiCallMadeAuth.current) {
            checkAuthentication();
            apiCallMadeAuth.current = true; // Update the ref to indicate that the effect has been run
        }
        // Call the checkAuthentication function when the component mounts
        // checkAuthentication();
    }, []);

    useEffect(() => {
        // Handle sending location to backend or using it within your application
        if (userLocation) {
            console.log('User location:', userLocation);
            // Here you can send the location data to your backend or use it within your application
        }
    }, [userLocation]);

    const handleSubmit = async () => {


        try {
               const token = await getToken();
                setUserToken(token);
            const response = await fetch(`${API_BASE_URL}/answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${props.token}`,
                },
                body: JSON.stringify({
                    questionID: questionID,
                    answerDescription: answer,
                }),
            });


            const data = await response.json();


            if (response.status === 200) {
                setMessages(prevMessages => [
                    ...prevMessages,
                    { message: answer, type: 'user', questionID: null, answerID: data['response']['answerID'] }
                ]);

                setAnswer('');
                apiCallMade.current = false;
                fetchQuestions(12, props.token);
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: 'smooth' // Optional: Scroll behavior, you can use 'auto' or 'smooth'
                });
           
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
    const fetchQuestions = async (userID: number, userToken: string|null) => {
        console.log(11);
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
                if(data['response'])
                {
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

                    window.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: 'smooth' // Optional: Scroll behavior, you can use 'auto' or 'smooth'
                    });
                }
            
            
                
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //       try {
    //         const token = await getToken(); // Wait for the token
    //         if (token && typeof token === 'string') {
    //         //  why ???
    //         //   fetchQuestions(12, token);
    //         } else {
                
    //           console.error('Token is null or not a string');
    //         }
    //       } catch (error) {
    //         console.error('Error fetching token:', error);
    //       }
    //     };
    
    //     fetchData();
    //   }, [apiCallMade]);


    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {

        if (event.key === 'Enter') {
            // If Enter key is pressed, run the handleSubmit function
            handleSubmit();
        }
    };

    return (
        <div className="flex">
           
            <div className="w-full ">
              
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

export default ChatSection;
