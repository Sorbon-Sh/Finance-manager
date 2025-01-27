import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
  id: string;
  className?: string;
}

const ModalPopover = ({ children, id, className }: IProps) => {
  return (
    <div popover="auto" id={id} className={className}>
      {children}
    </div>
  );
};

export default ModalPopover;
