export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return new Error(data.message || 'Bad request');
      case 401:
        return new Error(data.message || 'Unauthorized');
      case 403:
        return new Error(data.message || 'Forbidden');
      case 404:
        return new Error(data.message || 'Not found');
      case 422:
        return new Error(data.message || 'Validation error');
      case 500:
        return new Error(data.message || 'Internal server error');
      default:
        return new Error(data.message || 'Something went wrong');
    }
  } else if (error.request) {
    // Network error
    return new Error('Network error. Please check your connection.');
  } else {
    // Other error
    return new Error(error.message || 'Something went wrong');
  }
};

export const showErrorToast = (error) => {
  const message = error.message || 'Something went wrong';
  // You can use react-hot-toast or any other toast library
  console.error('Error:', message);
  return message;
};
