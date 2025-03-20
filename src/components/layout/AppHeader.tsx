import Button from "../buttons/Button";
import arrowTransfer from "../../assets/arrow-transfer-header.svg";
import stroke from "../../assets/stroke.svg";
import union from "../../assets/union.svg";
import logo from "../../assets/logo.svg";
import IncomeModal from "../modalWindow/IncomeModal";
import { createPortal } from "react-dom";
import { useAppDispatch } from "../../hooks/useReduxTypedHooks";
import { openModal } from "../../redux/slices/StateAndData";
import { ICompnay } from "../../types/types";
import EditCompany from "../modalWindow/EditCompany";
import { useGetCompanyDataQuery } from "../../api/rtk-query/insertTranData";
import ExpenseModal from "../modalWindow/ExpenseModal";
import TransferModal from "../modalWindow/TransferModal";
const AppHeader = () => {
  const { data: company } = useGetCompanyDataQuery("company");
  const dispatch = useAppDispatch();
  const companyName = company
    ? company.map((company: ICompnay) => company.name)
    : null;

  return (
    <header className="flex text-white  py-5 items-center">
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
                <Button className="py-3  text-start block px-3 mx-auto rounded-md hover:bg-gray-200 w-[95%]">
                  {companyName}
                </Button>
                <hr className="my-2 bg-gray-200" />
                <Button
                  submitHandler={() =>
                    dispatch(openModal(["editCompany", true]))
                  }
                  className="py-3 w-[95%] cursor-pointer block mx-auto px-3 rounded-md text-green-400 text-start hover:bg-gray-200"
                >
                  Edit
                </Button>
              </div>
            </div>
          </details>
        </div>
      </div>
      <div className="flex mx-auto gap-x-6">
        <Button
          className="headerButton cursor-pointer bg-green-300/20 text-green-300"
          submitHandler={() => dispatch(openModal(["income", true]))}
        >
          <span>
            <img src={union} />
          </span>
          <span>Income</span>
        </Button>

        <Button
          className="headerButton cursor-pointer bg-red-300/20 text-red-400 "
          submitHandler={() => dispatch(openModal(["expense", true]))}
        >
          <span>
            <img src={stroke} />
          </span>
          <span>Expense</span>
        </Button>
        <Button
          submitHandler={() => dispatch(openModal(["transfer", true]))}
          className="headerButton cursor-pointer bg-gray-600/55 "
        >
          <span>
            <img src={arrowTransfer} />
          </span>
          <span>Transfer</span>
        </Button>
      </div>

      {createPortal(<IncomeModal />, document.body)}
      {createPortal(<ExpenseModal />, document.body)}
      {createPortal(<TransferModal />, document.body)}
      {createPortal(<EditCompany />, document.body)}
    </header>
  );
};

export default AppHeader;
