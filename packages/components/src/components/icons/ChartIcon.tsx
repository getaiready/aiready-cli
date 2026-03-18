import { IconBase, IconBaseProps } from './IconBase';

export function ChartIcon(props: IconBaseProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.2" />
      <rect x="7" y="11" width="2" height="6" fill="currentColor" />
      <rect x="11" y="8" width="2" height="9" fill="currentColor" />
      <rect x="15" y="5" width="2" height="12" fill="currentColor" />
    </IconBase>
  );
}
