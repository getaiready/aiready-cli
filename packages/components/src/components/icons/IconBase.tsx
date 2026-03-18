/**
 * Props for the IconBase component.
 */
export interface IconBaseProps extends React.SVGProps<SVGSVGElement> {
  /** Additional CSS classes for styling. Defaults to w-6 h-6. */
  className?: string;
  /** The child elements (paths, circles, etc.) of the SVG. */
  children?: React.ReactNode;
  /** Viewbox of the icon. Defaults to "0 0 24 24". */
  viewBox?: string;
}

/**
 * A shared base component for all icons to reduce code duplication
 * and improve AI signal clarity.
 *
 * @param props - Icon properties and SVG attributes.
 * @returns A standardized SVG icon element.
 */
export const IconBase = ({
  className = 'w-6 h-6',
  children,
  viewBox = '0 0 24 24',
  ...props
}: IconBaseProps) => {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      className={className}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
};
