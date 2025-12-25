import { useState } from 'react';

const Image = ({ src, alt, className, fallbackSrc = 'https://via.placeholder.com/400x300?text=Image+Not+Available', ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);
  
  const handleError = () => {
    setImgSrc(fallbackSrc);
  };

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default Image;
