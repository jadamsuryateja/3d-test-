import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer>
      <span>WebMark Studio</span>
      <div className="footer-right">
        <span>Scroll to fly</span>
        <div className="webmark-lockup">
          <span>BY WEBMARK</span>
          <img src="/WEBMARK-01.png" alt="WebMark" />
        </div>
      </div>
    </footer>
  );
};
