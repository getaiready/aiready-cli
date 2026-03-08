'use client';

import React from 'react';
import * as Icons from '@/components/Icons';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  className?: string;
}

export function Icon({ name, className, ...props }: IconProps) {
  // Try to find the icon in our custom Icons collection (which includes @aiready/components)
  const TargetIcon =
    (Icons as any)[name] || (Icons as any)[`${name}Icon`] || Icons.ChartIcon;

  return <TargetIcon className={className} {...props} />;
}
