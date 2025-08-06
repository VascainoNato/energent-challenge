import { toast } from 'react-toastify';
import type { ToastOptions } from 'react-toastify';

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const toastUtils = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, { ...defaultOptions, ...options });
  },

  error: (message: string, options?: ToastOptions) => {
    toast.error(message, { ...defaultOptions, autoClose: 5000, ...options });
  },

  warning: (message: string, options?: ToastOptions) => {
    toast.warning(message, { ...defaultOptions, ...options });
  },

  info: (message: string, options?: ToastOptions) => {
    toast.info(message, { ...defaultOptions, ...options });
  },

  // Standardized toast messages for common actions
  upload: {
    success: (fileName?: string) => {
      const message = fileName 
        ? `File ${fileName} uploaded successfully!` 
        : 'File uploaded successfully!';
      toast.success(message, { ...defaultOptions, autoClose: 4000 });
    },
    
    error: (fileName?: string, error?: string) => {
      const message = fileName 
        ? `Error uploading ${fileName}${error ? `: ${error}` : ''}` 
        : 'Error uploading file';
      toast.error(message, { ...defaultOptions, autoClose: 5000 });
    },

    dataCleared: () => {
      toast.info('Upload data cleared.', { ...defaultOptions });
    }
  },

  filter: {
    added: (filterName: string) => {
      toast.success(`Filter ${filterName} added!`, { ...defaultOptions });
    },
    
    removed: (filterName: string) => {
      toast.info(`Filter ${filterName} removed.`, { ...defaultOptions });
    },

    allRemoved: () => {
      toast.info('All filters have been removed.', { ...defaultOptions });
    },
    
    maxReached: () => {
      toast.warning('Maximum number of filters reached (2)', { ...defaultOptions });
    }
  },

  zoom: {
    increased: (level: string) => {
      toast.info(`Zoom increased to ${level}`, { ...defaultOptions, autoClose: 2000 });
    },
    
    decreased: (level: string) => {
      toast.info(`Zoom decreased to ${level}`, { ...defaultOptions, autoClose: 2000 });
    },
    
    maxReached: () => {
      toast.warning('Maximum zoom reached', { ...defaultOptions, autoClose: 2000 });
    },
    
    minReached: () => {
      toast.warning('Minimum zoom reached', { ...defaultOptions, autoClose: 2000 });
    }
  },

  well: {
    selected: (wellName: string) => {
      toast.success(`Well ${wellName} selected`, { ...defaultOptions });
    },
    
    notFound: () => {
      toast.error('Well not found', { ...defaultOptions });
    },
    
    uploadRequired: () => {
      toast.warning('Please upload data first to select a well', { ...defaultOptions });
    }
  },

  chat: {
    messageSent: () => {
      toast.success('Message sent successfully!', { ...defaultOptions, autoClose: 2000 });
    },

    messageError: () => {
      toast.error('Error sending message', { ...defaultOptions });
    },

    fileUploaded: (fileName: string) => {
      toast.success(`File ${fileName} uploaded for analysis!`, { ...defaultOptions });
    },

    fileError: () => {
      toast.error('Error uploading file for analysis', { ...defaultOptions });
    },

    historyCleared: () => {
      toast.info('Chat history cleared.', { ...defaultOptions });
    }
  }
}; 