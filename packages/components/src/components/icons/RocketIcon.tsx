import { IconBase, IconBaseProps } from './IconBase';

export function RocketIcon(props: IconBaseProps) {
  return (
    <IconBase {...props}>
      <path
        d="M12 2c1.5 0 3 1 3 1s1.2 1.8 1.2 4.2c0 2.4-1.2 5-3.6 7.4-2.4 2.4-5 3.6-7.4 3.6C3.8 18.2 2 17 2 17S3 15.5 3 14c0-2.1 1.5-3.6 1.5-3.6S7.5 9 9 9c2.4 0 3-7 3-7z"
        strokeWidth="0"
        fill="currentColor"
      />
      <path
        d="M14 10c.8.8 2 2 3 3"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
}
