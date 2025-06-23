import React from 'react';
import PropTypes from 'prop-types';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  ariaLabel,
  ...props
}) => {
  const className = `${variant}-button`;
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      tabIndex={0}
      role="button"
      {...props}
    >
      {loading ? (
        <span className="loading-spinner" aria-hidden="true" />
      ) : null}
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  ariaLabel: PropTypes.string,
};

export default Button; 