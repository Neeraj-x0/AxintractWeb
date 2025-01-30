
import React from 'react';
import { cva } from 'class-variance-authority';
import Image from 'next/image';

// Avatar Component
const avatarVariants = cva(
  "relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gray-100",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-xs",
        sm: "h-8 w-8 text-sm",
        md: "h-10 w-10 text-base",
        lg: "h-12 w-12 text-lg",
        xl: "h-16 w-16 text-xl",
      },
      status: {
        online: "ring-2 ring-green-500",
        away: "ring-2 ring-yellow-500",
        offline: "ring-2 ring-gray-300",
        busy: "ring-2 ring-red-500",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'away' | 'offline' | 'busy';
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(({
  className = "",
  size,
  status,
  src,
  alt,
  fallback,
  ...props
}, ref) => {
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      className={avatarVariants({ size, status, className })}
      ref={ref}
      {...props}
    >
      {!imageError && src ? (
        <Image
            src={src}
            alt={alt || "Avatar"}
            width={500}
            height={500}
            layout="responsive"
            objectFit="cover"
            onError={handleImageError}
            />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-600">
          {fallback || (
            <span className="font-medium">
              {alt ? alt.charAt(0).toUpperCase() : "U"}
            </span>
          )}
        </div>
      )}
      {status && (
        <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white
          ${status === 'online' ? 'bg-green-500' : 
            status === 'away' ? 'bg-yellow-500' : 
            status === 'busy' ? 'bg-red-500' : 
            'bg-gray-300'}`}
        />
      )}
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;