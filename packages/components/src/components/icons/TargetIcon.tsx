import { IconBase, IconBaseProps } from './IconBase';

export function TargetIcon(props: IconBaseProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="10" strokeWidth="1.2" />
      <circle cx="12" cy="12" r="5" fill="currentColor" />
      <path
        d="M22 12h-3M5 12H2M12 2v3M12 19v3"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </IconBase>
  );
}
