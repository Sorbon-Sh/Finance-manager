import { ReactNode } from "react";

interface IButtonProps {
  children: ReactNode;
  className?: string;
  submitHandler?: () => void;
}

const Button = ({ children, className, submitHandler }: IButtonProps) => {
  return (
    <button className={className} onClick={submitHandler}>
      {children}
    </button>
  );
};

export default Button;
