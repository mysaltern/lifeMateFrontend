'use client';
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faChevronUp, faChevronDown, faCamera, faBell, faUser, faUpload } from '@fortawesome/free-solid-svg-icons';
import './styles.css';
import { API_BASE_URL } from '../../../config/development';
import ProgressSection from '../progresssection/ProgressSection';

const Chat: React.FC = () => {

    const [messagesFetch, setmessagesFetch] = useState([]);
    const [messages, setMessages] = useState([
        { message: "Hello", type: 'robot', questionID: null,answerID:null },
    ]);
    const [answer, setAnswer] = useState('');
    const [questionID, setQuestionID] = useState('');
    const apiCallMade = useRef(false);


    const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAnswer(event.target.value);
    };

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

            // Clear the answer field after submission
            setMessages(prevMessages => [
                ...prevMessages,
                { message:answer, type: 'user', questionID:null,answerID: data['response']['answerID'] }
            ]);

            setAnswer('');
            apiCallMade.current = false;
            fetchQuestions(12);
           
        } catch (error) {
            console.error('Error submitting answer:', error);
        }
    };
    const fetchQuestions = async (userID:number) => {
        try {
          const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
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
        fetchQuestions(12); // Replace 12 with the actual userID
      }, [apiCallMade]);

  


    return (
        <div className="flex">
            <div className="w-1/5 bg-slate-800 h-screen overflow-y-auto">
                <ProgressSection/>
            </div>
            <div className="w-4/5 ">
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
                    className='bg-slate-500 w-11/12 p-5' 
                    value={answer}
                    onChange={handleAnswerChange}  // Call the function when the input changes
                />
                        <div className='flex items-center'>
                            <FontAwesomeIcon    
                                 icon={faUpload}  onClick={handleSubmit}  className='text-gray-400 w-12 h-7 pr-5 cursor-pointer hover:text-blue-500' />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Chat;
