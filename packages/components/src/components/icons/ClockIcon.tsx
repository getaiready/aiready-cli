import { IconBase, IconBaseProps } from './IconBase';

export function ClockIcon(props: IconBaseProps) {
  return (
    <IconBase
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </IconBase>
  );
}
