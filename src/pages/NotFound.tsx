import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export const NotFound: React.FC = () => {
  return (
    <>
      <SEO title="404 — Off Radar | Aerodyne" description="Waypoint not found." />
      <div className="not-found-container">
        <div className="not-found-code">404</div>
        <h1 className="not-found-title">Waypoint Lost</h1>
        <p>The coordinates you entered do not exist on our navigation charts.</p>
        <Link to="/" className="not-found-btn">
          Return to Flight Path
        </Link>
      </div>
    </>
  );
};
