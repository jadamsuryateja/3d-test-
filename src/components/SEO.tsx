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
  description = 'WebMark creates bespoke, high-performance websites and distinctive brand identities for businesses that value exceptional digital craftsmanship, thoughtful details, and lasting impact.',
  canonical = 'https://webmark.co.in/',
  ogImage = 'https://webmark.co.in/WEBMARK-01.png'
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://webmark.co.in/#website',
        url: 'https://webmark.co.in/',
        name: 'WebMark',
        description: description,
        publisher: {
          '@id': 'https://webmark.co.in/#organization'
        },
        inLanguage: 'en-US'
      },
      {
        '@type': ['ProfessionalService', 'Organization'],
        '@id': 'https://webmark.co.in/#organization',
        name: 'WebMark',
        legalName: 'WebMark Digital Design Studio',
        url: 'https://webmark.co.in/',
        logo: {
          '@type': 'ImageObject',
          url: 'https://webmark.co.in/WEBMARK-01.png',
          caption: 'WebMark Digital Design Studio Logo'
        },
        image: 'https://webmark.co.in/WEBMARK-01.png',
        description: description,
        telephone: '+91-7075438591',
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'IN'
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+91-7075438591',
            contactType: 'customer service',
            url: 'https://wa.me/917075438591',
            availableLanguage: ['English', 'Hindi', 'Telugu']
          }
        ],
        sameAs: [
          'https://wa.me/917075438591'
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'WebMark Core Design Services',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Premium Custom Websites',
                description: 'Bespoke, high-performance web development with 3D interactions and mobile-first responsiveness.'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Brand Identity & Logo Design',
                description: 'Iconic, timeless logos and complete visual identity systems tailored for modern brands.'
              }
            }
          ]
        }
      }
    ]
  };

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Crawlers & Agentic Search Indexing Directives */}
      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />
      <meta
        name="googlebot"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />
      <meta
        name="bingbot"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />

      {/* Favicons & App Icons */}
      <link rel="icon" type="image/png" href="/favicon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
      <link rel="shortcut icon" href="/favicon.png" />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="WebMark" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content="WebMark Digital Design Studio" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@webmark" />
      <meta name="twitter:creator" content="@webmark" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional Semantic Keywords & Theme */}
      <meta
        name="keywords"
        content="WebMark, webmark.co.in, digital design studio, premium websites, brand identity, logo design, 3D interactive web, custom web development, bespoke websites India, high-end agency"
      />
      <meta name="theme-color" content="#060913" />

      {/* Agentic & AI System Links */}
      <link rel="alternate" type="text/plain" href="https://webmark.co.in/llms.txt" title="LLM Summary" />

      {/* Schema.org Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};
