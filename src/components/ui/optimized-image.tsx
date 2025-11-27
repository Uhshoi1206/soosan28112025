import React from 'react';
import { getCDNImageUrl, getOptimizedImageUrl } from '@/utils/imageUtils';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  useCase?: 'thumbnail' | 'hero' | 'gallery' | 'detail';
  fallback?: string;
  lazy?: boolean;
}

/**
 * Optimized Image Component
 * Automatically converts image URLs to CDN while maintaining SEO benefits
 * Provides responsive loading and fallback support
 */
export function OptimizedImage({ 
  src, 
  alt, 
  className,
  useCase,
  fallback,
  lazy = true,
  ...props 
}: OptimizedImageProps) {
  const [imageError, setImageError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Get optimized URL based on use case or default transformation
  const optimizedSrc = useCase 
    ? getOptimizedImageUrl(src, useCase)
    : getCDNImageUrl(src, { quality: 85, format: 'webp' });

  const fallbackSrc = fallback || src;

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      
      <img
        {...props}
        src={imageError ? fallbackSrc : optimizedSrc}
        alt={alt}
        loading={lazy ? 'lazy' : 'eager'}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        // SEO-friendly attributes
        itemProp="image"
      />
    </div>
  );
}