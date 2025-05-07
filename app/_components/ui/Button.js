const variantStyles = {
  default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
};

const sizeStyles = {
  default: "px-4 py-2",
  icon: "p-2",
};

export default function Button({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded transition-colors focus:outline-none focus:ring ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
