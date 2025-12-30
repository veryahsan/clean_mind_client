const SuccessMessage = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="mb-6 bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-md flex items-center justify-between">
      <p className="font-medium">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-4 text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SuccessMessage;

