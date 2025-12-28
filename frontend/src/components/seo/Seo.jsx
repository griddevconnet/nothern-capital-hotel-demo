import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

import OgImage from '../../assets/images/hero.png';
import LogoImage from '../../assets/images/logo.png';

const Seo = ({ 
  title = 'Northern Capital Hotel | Luxury Accommodations', 
  description = 'Experience luxury and comfort at Northern Capital Hotel. Book your stay with us for an unforgettable experience.',
  keywords = 'hotel, luxury, accommodation, booking, northern capital, vacation, travel',
  image,
  type = 'website',
  noIndex = false,
  children 
}) => {
  const { pathname } = useLocation();
  const siteUrl = import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://northerncapitalhotel.com');
  const canonicalUrl = `${siteUrl}${pathname}`;
  const metaImage = image || OgImage;
  
  return (
    <Helmet>
      {/* Standard metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={new URL(metaImage, siteUrl).toString()} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={new URL(metaImage, siteUrl).toString()} />
      
      {/* Additional structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Hotel',
          name: 'Northern Capital Hotel',
          description: description,
          url: siteUrl,
          logo: new URL(LogoImage, siteUrl).toString(),
          address: {
            '@type': 'PostalAddress',
            streetAddress: '123 Luxury Avenue',
            addressLocality: 'City Center',
            postalCode: '10001',
            addressCountry: 'US'
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: '40.7128',
            longitude: '-74.0060'
          },
          telephone: '+1-555-123-4567',
          priceRange: '$$$',
          sameAs: [
            'https://www.facebook.com/northerncapitalhotel',
            'https://www.instagram.com/northerncapitalhotel',
            'https://www.twitter.com/northerncapitalhotel'
          ]
        })}
      </script>
      
      {children}
    </Helmet>
  );
};

export default Seo;
