import { ReactNode } from "react";

interface IButtonProps {
  children: ReactNode;
  className?: string;
}

const Button = ({ children, className }: IButtonProps) => {
  return <button className={className}>{children}</button>;
};

export default Button;
