const ErrorMessage = ({ message, title = "Error", fullScreen = false }) => {
  if (!message) return null;

  const containerClass = fullScreen
    ? "min-h-screen bg-gray-50 dark:bg-gray-900 p-6"
    : "";

  return (
    <div className={containerClass}>
      <div className={fullScreen ? "max-w-4xl mx-auto" : ""}>
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-md">
          <p className="font-medium">{title}</p>
          <p className="text-sm mt-1">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;


