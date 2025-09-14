import React from 'react';
import { createRoot } from 'react-dom/client';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
}

const NotificationComponent: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isExiting, setIsExiting] = React.useState(false);
  const [isClosed, setIsClosed] = React.useState(false);

  React.useEffect(() => {
    // Trigger enter animation
    setTimeout(() => setIsVisible(true), 10);
  }, []);
  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getStyles = () => {
    const baseStyles = "flex items-center p-4 mb-4 text-sm rounded-lg shadow-lg border-l-4 backdrop-blur-sm transform transition-all duration-300 ease-out";
    const animationClass = isVisible ? "notification-enter" : "";
    const exitClass = isExiting ? "notification-exit" : "";

    switch (type) {
      case 'success':
        return `${baseStyles} ${animationClass} ${exitClass} text-green-800 border-green-500 bg-green-50/90 dark:bg-green-800/20 dark:text-green-400`;
      case 'error':
        return `${baseStyles} ${animationClass} ${exitClass} text-red-800 border-red-500 bg-red-50/90 dark:bg-red-800/20 dark:text-red-400`;
      case 'warning':
        return `${baseStyles} ${animationClass} ${exitClass} text-yellow-800 border-yellow-500 bg-yellow-50/90 dark:bg-yellow-800/20 dark:text-yellow-400`;
      case 'info':
        return `${baseStyles} ${animationClass} ${exitClass} text-blue-800 border-blue-500 bg-blue-50/90 dark:bg-blue-800/20 dark:text-blue-400`;
      default:
        return `${baseStyles} ${animationClass} ${exitClass}`;
    }
  };

  const handleClose = () => {
    if (isClosed) return; // Prevent multiple calls
    setIsClosed(true);
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for exit animation
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={getStyles()}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 text-sm font-medium flex-1 notification-message">
          {message}
        </div>
        <button
          type="button"
          className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:hover:bg-gray-700 transition-colors"
          onClick={handleClose}
        >
          <span className="sr-only">Cerrar</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export const Notification = (message: string, type: "success" | "error" | "warning" | "info" = "info") => {
  // Create container if it doesn't exist
  let container = document.getElementById('notification-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notification-container';
    container.className = 'fixed top-4 right-4 z-50 w-full max-w-sm space-y-2';
    document.body.appendChild(container);
  }

  // Create notification element
  const notificationElement = document.createElement('div');
  container.appendChild(notificationElement);

  const root = createRoot(notificationElement);
  let isCleanedUp = false;

  const handleClose = () => {
    if (isCleanedUp) return; // Prevent multiple cleanup calls
    isCleanedUp = true;

    try {
      root.unmount();
    } catch (error) {
      console.warn('Error unmounting notification:', error);
    }

    try {
      if (container && container.contains(notificationElement)) {
        container.removeChild(notificationElement);
      }
    } catch (error) {
      console.warn('Error removing notification element:', error);
    }

    try {
      // Remove container if empty
      const currentContainer = document.getElementById('notification-container');
      if (currentContainer && currentContainer.children.length === 0) {
        document.body.removeChild(currentContainer);
      }
    } catch (error) {
      console.warn('Error removing notification container:', error);
    }
  };

  root.render(
    <NotificationComponent
      message={message}
      type={type}
      onClose={handleClose}
    />
  );
};
