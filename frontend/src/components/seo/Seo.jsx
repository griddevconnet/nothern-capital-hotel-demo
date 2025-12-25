import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const Seo = ({ 
  title = 'Northern Capital Hotel | Luxury Accommodations', 
  description = 'Experience luxury and comfort at Northern Capital Hotel. Book your stay with us for an unforgettable experience.',
  keywords = 'hotel, luxury, accommodation, booking, northern capital, vacation, travel',
  image = '/images/og-image.jpg',
  type = 'website',
  noIndex = false,
  children 
}) => {
  const { pathname } = useLocation();
  const siteUrl = process.env.REACT_APP_SITE_URL || 'https://northerncapitalhotel.com';
  const canonicalUrl = `${siteUrl}${pathname}`;
  
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
      <meta property="og:image" content={new URL(image, siteUrl).toString()} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={new URL(image, siteUrl).toString()} />
      
      {/* Additional structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Hotel',
          name: 'Northern Capital Hotel',
          description: description,
          url: siteUrl,
          logo: new URL('/logo.png', siteUrl).toString(),
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
