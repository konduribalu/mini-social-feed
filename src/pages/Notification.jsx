import { useNotifications } from "../context/NotificationContext";

const Notification = () => {
    const { notifications } = useNotifications();
    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            {notifications.length === 0 ? (
                <p className="text-gray-600">No notifications available.</p>
            ) : (
                notifications.map(notification => (
                    <div key={notification.id}
                        className={`p-2 mb-2 border ${notification.read ? "bg-gray-100" : "bg-blue-100"}`}
                        onClick={() => markAsRead(notification.id)}>
                        {notification.message}
                        <span className="text-sm text-gray-500">
                            {new Date(notification.timestamp).toLocaleString()}
                        </span>
                    </div>
                ))
            )}
        </div>
    );
}  

export default Notification;