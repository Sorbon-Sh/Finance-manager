import { useGetAccountQuery } from "../api/rtk-query/insertToDataBase";
import { useAppDispatch } from "../hooks/useReduxTypedHooks";
import { setAccountId } from "../redux/slices/StateAndData";

const AccountList = () => {
  const { data: accouts, isSuccess } = useGetAccountQuery("accounts");
  const dispatch = useAppDispatch();
  return (
    <div>
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
