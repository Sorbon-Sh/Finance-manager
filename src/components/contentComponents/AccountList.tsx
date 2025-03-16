import { useGetAccountQuery } from "../../api/rtk-query/insertTranData";
import { useAppDispatch } from "../../hooks/useReduxTypedHooks";
import { openModal, setAccountId } from "../../redux/slices/StateAndData";
import closeIcon from "../../assets/closeIcon.svg";
import editIconList from "../../assets/edit-icon-list.svg";
import burgerIcon from "../../assets/burger-icon.svg";
import Button from "../buttons/Button";

const AccountList = () => {
  const { data: accouts, isSuccess } = useGetAccountQuery("accounts");

  const dispatch = useAppDispatch();
  const onClose = () => {
    dispatch(openModal(["editAccount", false]));
    dispatch(setAccountId(""));
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-4 ">
        <h2 className="text-3xl font-bold">Выбрать аккаунт</h2>
        <Button className="cursor-pointer" submitHandler={onClose}>
          <img src={closeIcon} />
        </Button>
      </div>
      {isSuccess
        ? accouts.map((account) => (
            <p
              key={account.id}
              className="py-4  px-2 cursor-pointer flex justify-between border-0 hover:rounded-xl border-b-1  border-b-gray-400 hover:bg-[#edf4f7]"
              onClick={() => dispatch(setAccountId(account.id))}
            >
              <img src={burgerIcon} />
              <span className="ml-2 ">{account.account}</span>
              <img src={editIconList} className="ml-auto" />
            </p>
          ))
        : "No account found"}
    </div>
  );
};

export default AccountList;
