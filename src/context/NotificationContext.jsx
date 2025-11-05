import { createContext, useContext, useState } from "react";
import axios from "axios";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]); // Initial empty notifications

    const fetchNotifications = async (userId) => {
        await axios.get(`http://localhost:5000/notifications?userId=${userId}`)
            .then(response => {
                setNotifications(response.data);
            })
            .catch(error => {
                console.error("Failed to fetch notifications:", error);
            });
    }

    const addNotification = async (notification) => {
        await axios.post(`http://localhost:5000/notifications`, notification)
            .then(response => {
                setNotifications(prevNotifications => [...prevNotifications, response.data]);
            })
            .catch(error => {
                console.error("Failed to add notification:", error);
            });
    }

    const markAsRead = async (notificationId) => {
        await axios.patch(`http://localhost:5000/notifications/${notificationId}`, { read: true })
            .then(() => {
                setNotifications(prevNotifications =>
                    prevNotifications.map(notification =>
                        notification.id === notificationId ? { ...notification, read: true } : notification
                    )
                );
            })
            .catch(error => {
                console.error("Failed to mark notification as read:", error);
            });
    }

    return (
        <NotificationContext.Provider value={{ notifications, fetchNotifications, addNotification, markAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);