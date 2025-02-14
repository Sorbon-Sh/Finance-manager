import Button from "../buttons/Button";
import arrowTransfer from "../../assets/arrow-transfer-header.svg";
import stroke from "../../assets/stroke.svg";
import union from "../../assets/union.svg";
import history from "../../assets/history.svg";
import logo from "../../assets/logo.svg";
import ModalPopover from "../modalWindow/ModalPopover";
import IncomeModal from "../modalWindow/IncomeModal";
import { createPortal } from "react-dom";
import { useAppDispatch } from "../../hooks/useReduxTypedHooks";
import { openModal } from "../../redux/slices/StateAndData";
import { ICompnay } from "../../types/types";
import EditCompany from "../modalWindow/EditCompany";
interface IProps {
  companyData: ICompnay[];
}
const AppHeader = ({ companyData }: IProps) => {
  const dispatch = useAppDispatch();
  const companyName = companyData && companyData.map((company) => company.name);
  console.log(companyData);

  return (
    <header className="flex justify-between text-white  py-5 items-center">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-slate-400 mr-2">
          <img src={logo} />
        </div>
        <div className="font-medium">
          <div className="ml-3">Fin manager</div>
          <details className="text-gray-400  cursor-pointer companyDetails hover:bg-gray-500/30 px-3  rounded-lg">
            <summary className="list-none outline-none flex justify-between items-center">
              {companyName}
            </summary>
            {/* Этот absolute должен быть left-0 по контейнету который нужно
            задать relative */}
            <div className="absolute w-72 mt-2 bg-white rounded-xl left-10">
              <div className="py-2">
                <Button className="py-3 text-start block px-3 mx-auto rounded-md hover:bg-gray-200 w-[95%]">
                  {companyName}
                </Button>
                <hr className="my-2 bg-gray-200" />
                <Button
                  submitHandler={() =>
                    dispatch(openModal(["editCompany", true]))
                  }
                  className="py-3 w-[95%] block mx-auto px-3 rounded-md text-green-400 text-start hover:bg-gray-200"
                >
                  Edit
                </Button>
              </div>
            </div>
          </details>
        </div>
      </div>
      <div className="flex gap-x-6">
        <Button
          className="headerButton bg-green-300/20 text-green-300"
          submitHandler={() => dispatch(openModal(["income", true]))}
        >
          <span>
            <img src={union} />
          </span>
          <span>Income</span>
        </Button>

        <Button
          className="headerButton bg-red-300/20 text-red-400 "
          submitHandler={() => dispatch(openModal(["expense", true]))}
        >
          <span>
            <img src={stroke} />
          </span>
          <span>Expense</span>
        </Button>
        <Button className="headerButton  bg-gray-600/55 ">
          <span>
            <img src={arrowTransfer} />
          </span>
          <span>Transfer</span>
        </Button>
      </div>
      <div>
        <Button popoverId="history" className="block">
          <img
            src={history}
            className="size-10 bg-gray-300 rounded-full left-0 "
          />
        </Button>

        <ModalPopover
          id="history"
          className="mr-6 mt-6 w-[340px] px-5 mx-auto "
        >
          <div className="">Modal</div>
        </ModalPopover>
      </div>
      {createPortal(<IncomeModal />, document.body)}
      {createPortal(<EditCompany />, document.body)}
    </header>
  );
};

export default AppHeader;
