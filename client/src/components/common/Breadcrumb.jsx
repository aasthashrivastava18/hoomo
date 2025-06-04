import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaChevronRight, FaAngleRight } from 'react-icons/fa';

const Breadcrumb = ({ 
  items = [], 
  className = '',
  separator = 'chevron', // 'chevron', 'angle', 'slash'
  showHome = true,
  homeLabel = 'Home',
  homePath = '/'
}) => {
  const location = useLocation();

  // Auto-generate breadcrumbs from URL if no items provided
  const generateBreadcrumbs = () => {
    if (items.length > 0) return items;

    const pathnames = location.pathname.split('/').filter(x => x);
    return pathnames.map((pathname, index) => {
      const path = `/${pathnames.slice(0, index + 1).join('/')}`;
      const label = pathname.charAt(0).toUpperCase() + pathname.slice(1).replace(/-/g, ' ');
      return { label, path };
    });
  };

  const breadcrumbItems = showHome 
    ? [{ label: homeLabel, path: homePath, icon: FaHome }, ...generateBreadcrumbs()]
    : generateBreadcrumbs();

  const getSeparatorIcon = () => {
    switch (separator) {
      case 'angle':
        return FaAngleRight;
      case 'slash':
        return () => <span className="text-gray-400">/</span>;
      default:
        return FaChevronRight;
    }
  };

  const SeparatorIcon = getSeparatorIcon();

  if (breadcrumbItems.length <= 1) return null;

  return (
    <nav 
      className={`flex items-center space-x-1 text-sm ${className}`} 
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const IconComponent = item.icon;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-2">
                  {separator === 'slash' ? (
                    <span className="text-gray-400">/</span>
                  ) : (
                    <SeparatorIcon className="w-3 h-3 text-gray-400" />
                  )}
                </span>
              )}
              
              {isLast ? (
                <span className="flex items-center text-gray-900 font-medium">
                  {IconComponent && <IconComponent className="w-4 h-4 mr-1.5" />}
                  <span className="truncate max-w-xs">{item.label}</span>
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  {IconComponent && <IconComponent className="w-4 h-4 mr-1.5" />}
                  <span className="truncate max-w-xs hover:underline">{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// Breadcrumb with background
export const BreadcrumbCard = ({ children, ...props }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3 mb-6">
    <Breadcrumb {...props} />
    {children}
  </div>
);

// Breadcrumb with custom styling
export const BreadcrumbHeader = ({ title, subtitle, ...props }) => (
  <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
    <Breadcrumb className="mb-2" {...props} />
    {title && <h1 className="text-2xl font-bold text-gray-900">{title}</h1>}
    {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
  </div>
);

export default Breadcrumb;
