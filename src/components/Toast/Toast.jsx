const Toast = ({ message, isVisible }) => {
    if (!isVisible) return null;
    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
            <div className="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
                <span>{message}</span>
            </div>
        </div>
    );
};

export default Toast;