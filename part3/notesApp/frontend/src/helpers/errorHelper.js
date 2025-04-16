export const handleError = (setErrorMessage, error) => {
  setErrorMessage(`Error: ${error}`);
  setTimeout(() => {
    setErrorMessage(null);
  }, 5000);
};
