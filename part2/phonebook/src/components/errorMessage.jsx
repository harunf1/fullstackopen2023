import React from "react";
const Notifitcation = ({ errorMessage }) => {
  if (errorMessage == null) {
    return null;
  }

  return <div className="error">{errorMessage}</div>;
};
export default Notifitcation;
