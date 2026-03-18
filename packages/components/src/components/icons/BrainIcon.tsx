import { IconBase, IconBaseProps } from './IconBase';

export function BrainIcon(props: IconBaseProps) {
  return (
    <IconBase
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.74-3.41A2.5 2.5 0 0 1 2 14c0-1.5 1-2 1-2s-1-.5-1-2a2.5 2.5 0 0 1 2.3-2.48A2.5 2.5 0 0 1 7 5.5a2.5 2.5 0 0 1 2.5-3.5z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.74-3.41A2.5 2.5 0 0 0 22 14c0-1.5-1-2-1-2s1-.5 1-2a2.5 2.5 0 0 0-2.3-2.48A2.5 2.5 0 0 0 17 5.5a2.5 2.5 0 0 0-2.5-3.5z" />
    </IconBase>
  );
}
