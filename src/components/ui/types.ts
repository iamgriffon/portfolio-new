import { ReactNode } from "react";

interface ProgressBarProps {
  duration?: number;
  complete?: boolean;
  width?: string;
  height?: string;
  bgColor?: string;
  fillColor?: string;
}

interface SectionTitleProps {
  title: ReactNode;
  animate?: boolean;
  className?: string;
}


export type { ProgressBarProps, SectionTitleProps };
