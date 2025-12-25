import { Link } from 'react-router-dom';
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

export const Button = forwardRef(({
  children,
  to,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  fullWidth = false,
  startIcon,
  endIcon,
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  // Base styles with focus styles for keyboard navigation
  const baseStyles = [
    'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
    'disabled:opacity-60 disabled:cursor-not-allowed',
    fullWidth ? 'w-full' : '',
    className
  ].join(' ');
  
  // Variant styles
  const variants = {
    primary: [
      'bg-primary text-white',
      'hover:bg-primary-dark',
      'active:bg-primary-darker',
      'disabled:bg-primary/60',
      'dark:bg-blue-700 dark:hover:bg-blue-800 dark:active:bg-blue-900'
    ].join(' '),
    
    secondary: [
      'bg-secondary text-white',
      'hover:bg-secondary-dark',
      'active:bg-secondary-darker',
      'disabled:bg-secondary/60',
      'dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:active:bg-yellow-800'
    ].join(' '),
    
    outline: [
      'border border-gray-300 dark:border-gray-600',
      'text-gray-700 dark:text-gray-200',
      'hover:bg-gray-50 dark:hover:bg-gray-700',
      'active:bg-gray-100 dark:active:bg-gray-600',
      'disabled:opacity-60'
    ].join(' '),
    
    ghost: [
      'text-gray-700 dark:text-gray-200',
      'hover:bg-gray-100 dark:hover:bg-gray-800',
      'active:bg-gray-200 dark:active:bg-gray-700',
      'disabled:opacity-60'
    ].join(' '),
    
    danger: [
      'bg-red-600 text-white',
      'hover:bg-red-700',
      'active:bg-red-800',
      'focus-visible:ring-red-500',
      'disabled:bg-red-600/60'
    ].join(' ')
  };
  
  // Size styles
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };
  
  // Handle click with loading state
  const handleClick = (e) => {
    if (loading || disabled) return;
    onClick?.(e);
  };
  
  // Determine accessibility props
  const accessibilityProps = {
    'aria-disabled': disabled || loading,
    'aria-label': ariaLabel || (typeof children === 'string' ? children : undefined),
    'aria-busy': loading,
    ...props
  };
  
  // Render as button or link
  const Component = to ? Link : motion.button;
  const componentProps = to 
    ? { to, className: `${baseStyles} ${variants[variant]} ${sizes[size]}` }
    : { 
        type,
        className: `${baseStyles} ${variants[variant]} ${sizes[size]}`,
        whileTap: !disabled && !loading ? { scale: 0.98 } : {},
        disabled: disabled || loading,
        ...accessibilityProps
      };
  
  return (
    <Component
      ref={ref}
      onClick={handleClick}
      {...componentProps}
    >
      {loading && (
        <span className="mr-2" aria-hidden="true">
          <FaSpinner className="animate-spin" />
        </span>
      )}
      {!loading && startIcon && (
        <span className="mr-2" aria-hidden="true">
          {startIcon}
        </span>
      )}
      {children}
      {endIcon && (
        <span className="ml-2" aria-hidden="true">
          {endIcon}
        </span>
      )}
    </Component>
  );
});

Button.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  'aria-label': PropTypes.string,
  'aria-busy': PropTypes.bool
};
  
export default Button;
