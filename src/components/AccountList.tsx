import { useGetAccountQuery } from "../api/rtk-query/insertToDataBase";
import { useAppDispatch } from "../hooks/useReduxTypedHooks";
import { setAccountId } from "../redux/slices/StateAndData";

const AccountList = () => {
  const { data: accouts } = useGetAccountQuery("accounts");
  const dispatch = useAppDispatch();
  return (
    <div>
      {accouts &&
        accouts.map((account) => (
          <p
            key={account.id}
            className="p-3 mb-1 bg-green-300"
            onClick={() => dispatch(setAccountId(account.id))}
          >
            {account.account}
          </p>
        ))}
    </div>
  );
};

export default AccountList;
