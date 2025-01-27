import filterIcon from "../../assets/new-filter.svg";
import TransactionsTabel from "../TransactionsTabel";

const Transactions = () => {
  return (
    <section>
      <div className="flex mb-7">
        <div className="pl-4 pr-8  py-2  bg-[#edf4f7] rounded-xl triangleTimeFilter text-sm text-gray font-bold flex items-center">
          <span>All time</span>
        </div>
        <div className="">
          <input
            type="text"
            placeholder="Поиск по счетам, клиентам, комментариям"
            className="w-[519px]  py-2 rounded-xl bg-[#edf4f7] ml-2 mr-9 outline-green-300 pl-4 search"
          />
        </div>
        <div className=" pl-4 pr-8 py-2 flex bg-[#edf4f7] rounded-xl flex items-center">
          <img src={filterIcon} />
          <span className="triangleFilterBy px-2 border-r-1 border-gray-400 text-sm text-gray-500 font-bold ">
            Filter
          </span>
        </div>
      </div>
      <TransactionsTabel />
    </section>
  );
};

export default Transactions;
