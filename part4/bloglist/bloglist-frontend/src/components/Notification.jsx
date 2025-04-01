const Notification = ({ errorMessage, successMessage }) => {
  if (!errorMessage && !successMessage) {
    return null;
  }
  return (
    <div className={errorMessage ? "error" : "success"}>
      {errorMessage || successMessage}
    </div>
  );
};

export default Notification;
