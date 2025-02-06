import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
  id?: string;
  className?: string;
  isOpen: boolean;
}

const DialogModal = ({ children, id, isOpen, className }: IProps) => {
  return (
    <dialog open={isOpen} className={className}>
      {children}
    </dialog>
  );
};

export default DialogModal;
