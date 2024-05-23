export const doHandleError = (error: any): string => {
  console.log(error);
  if (error.response) {
    // Server responded with a status other than 200 range
    switch (error.response.status) {
    case 400:
      return "Bad Request. Please check your input and try again.";
    case 401:
      return "Unauthorized. Please log in.";
    case 403:
      return "Forbidden. You do not have permission to access this resource.";
    case 404:
      return "Whoops. Seems like what you are looking for does not exist";
    case 500:
      return "Internal Server Error. Please try again later.";
    default:
      return (
        error.response.data.message || "An error occurred on the server."
      );
    }
  } else if (error.request) {
    // Request was made but no response was received
    return "Network error. Please check your internet connection.";
  } else {
    // Something else happened while setting up the request
    return error.message || "An unknown error occurred.";
  }
};
