'use client';
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faChevronUp, faChevronDown, faCamera, faBell, faUser, faUpload } from '@fortawesome/free-solid-svg-icons';
import './styles.css';
import { API_BASE_URL } from '../../config/development';
import ProgressSection from './progresssection/ProgressSection';
import ChatSection from './chat/page';
import NotificationSection from './notification/page';
import { getToken } from '../../utils/auth';
import { useRouter } from 'next/navigation';
import { error } from 'console';
const Chat: React.FC = () => {
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
    const [showChat, setShowChat] = useState(true);

    const toggleChat = () => {
      setShowChat(!showChat);
    };
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
        localStorage.removeItem('chatlogLocal');
        
        router.push('/signin');
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
                            'Authorization': `Bearer ${userToken}`, // Assuming you have userToken available
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
                const token = await getToken();
                setUserToken(token);
                console.log(33333);
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
                    'Authorization': `Bearer ${token}`,
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
                fetchQuestions(12, userToken);
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

    useEffect(() => {
        const fetchData = async () => {
          try {
            const token = await getToken(); // Wait for the token
            if (token && typeof token === 'string') {
            //  why ???
            //   fetchQuestions(12, token);
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
            {userToken && <ProgressSection token={userToken} />}
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
                                <FontAwesomeIcon onClick={toggleChat} icon={faBell} className='text-gray-400 w-12 h-7 top-1 relative cursor-pointer hover:text-blue-500' />
                                <FontAwesomeIcon onClick={logout} icon={faUser} className='text-gray-400 w-12 h-7 top-1 relative cursor-pointer hover:text-blue-500' />

                            </div>
                        </div>
                    </div>
                </div>
                {userToken && (showChat ? <ChatSection token={userToken} /> : <NotificationSection token={userToken} isVisible={!showChat} />)}
            </div>
        </div>
    );
};

export default Chat;
