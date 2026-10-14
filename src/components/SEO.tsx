import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'WebMark — Digital Design Studio | Crafted to Stand Out',
  description = 'We create premium websites and distinctive brand identities for businesses that value exceptional design, thoughtful details, and a lasting digital presence.',
  canonical = 'https://webmark.studio/',
  ogImage = '/favicon.png'
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <link rel="icon" type="image/png" href="/favicon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
      <link rel="shortcut icon" href="/favicon.png" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional Meta */}
      <meta name="keywords" content="WebMark, digital design studio, crafted to stand out, premium websites, brand identity, logo design, UI UX" />
      <meta name="theme-color" content="#F5B888" />
    </Helmet>
  );
};
