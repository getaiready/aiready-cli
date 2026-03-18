import { IconBase, IconBaseProps } from './IconBase';

export function HammerIcon(props: IconBaseProps) {
  return (
    <IconBase
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18.42 13.59L7.46 2.63a1 1 0 0 0-1.42 0l-4.7 4.7a1 1 0 0 0 0 1.42L11 18.23l1.07-1.07-1.41-1.41 1.42-1.42 1.41 1.41 1.41-1.41-1.41-1.41 1.42-1.42 1.41 1.41 2-2z" />
      <path d="M13 18l6 6" />
    </IconBase>
  );
}
