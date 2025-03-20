import { useAppDispatch } from "../hooks/useReduxTypedHooks";
import { openModal } from "../redux/slices/StateAndData";
import Button from "./buttons/Button";

interface IProps {
  header: string;
  btnText: string;
  modal: [string, boolean];
}

export const NoTransactions = ({ header, btnText, modal }: IProps) => {
  const dispatch = useAppDispatch();

  return (
    <div className="pointer-events-auto">
      <h2 className=" text-2xl mb-4">{header}</h2>
      <Button
        submitHandler={() => dispatch(openModal(modal))}
        className="bg-green-500 py-3 px-7 font-medium rounded-2xl text-white cursor-pointer"
      >
        {btnText}
      </Button>
    </div>
  );
};
