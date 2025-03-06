import { useGetAccountQuery } from "../api/rtk-query/insertToDataBase";
import { useAppDispatch } from "../hooks/useReduxTypedHooks";
import { openModal, setAccountId } from "../redux/slices/StateAndData";
import closeIcon from "../assets/closeIcon.svg";

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
        <button className="cursor-pointer" onClick={onClose}>
          <img src={closeIcon} />
        </button>
      </div>
      {isSuccess
        ? accouts.map((account) => (
            <p
              key={account.id}
              className="p-3 mb-1 bg-green-300"
              onClick={() => dispatch(setAccountId(account.id))}
            >
              {account.account}
            </p>
          ))
        : "No account found"}
    </div>
  );
};

export default AccountList;
