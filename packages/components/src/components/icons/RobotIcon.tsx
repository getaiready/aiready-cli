import { IconBase, IconBaseProps } from './IconBase';

export function RobotIcon(props: IconBaseProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="7" width="18" height="11" rx="2" strokeWidth="1.2" />
      <rect x="7" y="10" width="2" height="2" fill="currentColor" />
      <rect x="15" y="10" width="2" height="2" fill="currentColor" />
      <path d="M9 3v2M15 3v2" strokeWidth="1.2" strokeLinecap="round" />
    </IconBase>
  );
}
