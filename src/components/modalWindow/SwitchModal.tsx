import { ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useReduxTypedHooks";
import { openModal } from "../../redux/slices/modalStateSlice";

interface IProps {
  children: ReactNode;
  modalID: string;
  className: string;
}

const SwitchModal = ({ children, modalID, className }: IProps) => {
  const isOpen = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  return (
    <div
      className={`grid place-content-center h-screen bg-black/40 fixed top-0 left-0 w-full ${
        !isOpen[modalID] && "hidden"
      }`}
      onClick={() => dispatch(openModal(["income", false]))}
    >
      <div className={className} onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default SwitchModal;
