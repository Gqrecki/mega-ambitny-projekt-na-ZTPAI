import React from 'react';
import './Loading.css';

const Loading = ({ size = 'medium', fullPage = false, message = 'Loading...' }) => {
  const sizeClass = `spinner-${size}`;
  
  if (fullPage) {
    return (
      <div className="loading-fullpage">
        <div className={`spinner ${sizeClass}`}></div>
        {message && <p className="loading-message">{message}</p>}
      </div>
    );
  }

  return (
    <div className="loading-container">
      <div className={`spinner ${sizeClass}`}></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default Loading;
