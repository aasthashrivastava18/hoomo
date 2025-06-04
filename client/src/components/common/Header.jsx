import React from 'react';

const Header = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
  className = '',
  titleClassName = '',
  subtitleClassName = '',
  backgroundImage,
  overlay = true,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-20'
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  const headerStyle = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    : {};

  return (
    <div
      className={`relative ${backgroundImage ? 'text-white' : 'bg-gray-50'} ${sizeClass} ${className}`}
      style={headerStyle}
    >
      {/* Overlay for background image */}
      {backgroundImage && overlay && (
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      )}

      <div className="relative container mx-auto px-4">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <svg
                      className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                    </svg>
                  )}
                  {crumb.href ? (
                    <a
                      href={crumb.href}
                      className={`${
                        backgroundImage ? 'text-gray-200 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                      } transition-colors`}
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span
                      className={`${
                        backgroundImage ? 'text-white' : 'text-gray-900'
                      } font-medium`}
                    >
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            {/* Title */}
            {title && (
              <h1
                className={`text-3xl md:text-4xl lg:text-5xl font-bold ${
                  backgroundImage ? 'text-white' : 'text-gray-900'
                } ${titleClassName}`}
              >
                {title}
              </h1>
            )}

            {/* Subtitle */}
            {subtitle && (
              <p
                className={`mt-2 text-lg ${
                  backgroundImage ? 'text-gray-200' : 'text-gray-600'
                } ${subtitleClassName}`}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Actions */}
          {actions && (
            <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
