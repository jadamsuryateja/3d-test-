import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer>
      <span>WebMark Studio</span>
      <div className="footer-right">
        <span>Scroll to fly</span>
        <a
          href="https://www.staffarc.in"
          target="_blank"
          rel="noreferrer"
          className="staffarc-lockup"
        >
          <span>By StaffArc</span>
          <img src="/staffarc-logo.png" alt="StaffArc" />
        </a>
      </div>
    </footer>
  );
};
