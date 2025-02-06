import { ReactNode } from "react";

interface IButtonProps {
  children: ReactNode;
  className?: string;
  popoverId?: string;
  submitHandler?: () => void;
}

const Button = ({
  children,
  className,
  popoverId,
  submitHandler,
}: IButtonProps) => {
  return (
    <button
      popoverTarget={popoverId}
      className={className}
      onClick={submitHandler}
    >
      {children}
    </button>
  );
};

export default Button;
