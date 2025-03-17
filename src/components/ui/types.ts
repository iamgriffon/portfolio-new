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
  withoutBar?: boolean;
}


interface MenuItemProps {
  title: string;
  description?: string;
  icon: ReactNode;
  onClick?: () => void;
  index?: number;
  interactive?: boolean;
  withArrow?: boolean;
  href?: string;
}


export type { ProgressBarProps, SectionTitleProps, MenuItemProps };
