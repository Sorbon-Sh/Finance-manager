import { ReactNode } from "react";
import { useAppSelector } from "../../hooks/useReduxTypedHooks";

interface IProps {
  children: ReactNode;
  modalID: string;
  className: string;
  handleClick?: () => void;
}

const SwitchModal = ({ children, modalID, className, handleClick }: IProps) => {
  const isOpen = useAppSelector((state) => state.stateAndData);

  return (
    <div
      className={`grid place-content-center h-screen bg-black/40 fixed top-0 left-0 w-full ${
        !isOpen[modalID] && "hidden"
      }`}
      onClick={handleClick}
    >
      <div className={className} onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default SwitchModal;
