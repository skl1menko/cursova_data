import toast from 'react-hot-toast';

export const showToast = {
  success: (message) => {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#4CAF50',
        color: '#fff',
      },
    });
  },
  error: (message) => {
    toast.error(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#f44336',
        color: '#fff',
      },
    });
  },
  warning: (message) => {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#ff9800',
        color: '#fff',
      },
    });
  },
  info: (message) => {
    toast(message, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#2196F3',
        color: '#fff',
      },
    });
  },
}; 