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
const Notification: React.FC<{ token: string | null, isVisible: boolean }> = (props) => {
    const router = useRouter();

    const [notifications, setNotifications] = useState<any[]>([]); // State to hold notifications
    useEffect(() => {
        // Fetch notifications when component mounts
        fetchNotifications(props.token);
    }, [props.token]);



    const fetchNotifications = async (userToken: string | null) => {
        try {
            const response = await fetch(`${API_BASE_URL}/notifications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${props.token}`, // Include the Bearer token
                },
                body: JSON.stringify({
                    // userID: userID,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setNotifications(data.response); // Set notifications in state
            } else {
                console.error('Error fetching notifications:', data.message);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const [hiddenNotifications, setHiddenNotifications] = useState<number[]>([]); // State to hold IDs of hidden notifications
    const toggleNotification = (id: number) => {
        setHiddenNotifications(prevHiddenNotifications => {
            // If the clicked notification is already hidden, remove its ID from the array
            if (prevHiddenNotifications.includes(id)) {
                return prevHiddenNotifications.filter(notificationId => notificationId !== id);
            } else {
                // Otherwise, add its ID to the array
                return [...prevHiddenNotifications, id];
            }
        });
    };
    return (
        <div className={`notification-section ${props.isVisible ? 'show' : 'hide'}`}>
            <div className="flex">

                <div className="w-full ">

                    <div className='flex flex-col min-h-screen bg-slate-400'>

                        <div className='BodyMain bg-slate-500 flex-1 flex flex-col items-end p-10 relative'>
                        {notifications.map(notification => (
                                // Check if the notification ID is not in the hiddenNotifications array
                                !hiddenNotifications.includes(notification.id) &&
                                <div key={notification.id} className={`flex justify-start w-full mb-2`} onClick={() => toggleNotification(notification.id)}>
                                    <div className={`bg-slate-800 whitespace-pre-line text-gray-300 rounded-md p-2 max-w-fit UserMessage`}>
                                        <span>{notification.description}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notification;
