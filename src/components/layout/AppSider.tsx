import editAccount from "../../assets/edit-account.svg";
import plus from "../../assets/plus-gray.svg";
import Button from "../buttons/Button";

const AppSider: React.FC = () => {
  return (
    <aside className=" col-start-1 col-end-4 bg-[#edf4f7] rounded-tl-3xl">
      <article className="w-64 mx-auto">
        <div className="flex justify-between flex-col mt-[22px] ">
          <span className="mb-1 text-sm text-gray-500">Всего на счетах </span>
          <span className="text-3xl font-bold">
            TJS 100.<span className="text-lg">50</span>
          </span>
        </div>
        <hr className="border-gray-400  mt-5" />
        <div>
          <ul className="[&>*]:flex [&>*]:justify-between mt-[18px] ">
            <li className="mb-6 font-bold text-sm">
              <div>Мои счета</div>
              <div>
                <img src={editAccount} className="cursor-pointer" />
              </div>
            </li>

            <div className="flex-col [&>li]:flex [&>li]:cursor-pointer [&>li]:justify-between [&]:gap-y-5 text-sm text-gray-500">
              <li>
                <span>Bank account</span> <span>TJS 100.50</span>
              </li>
              <li>
                <span>Cash</span> <span>TJS 0.0</span>
              </li>
              <li>
                <span>Crypto</span> <span>TJS 0.0</span>
              </li>
            </div>
          </ul>
          <Button className="text-sm text-gray-500 border-dotted border-1 rounded-sm   py-3 w-full flex items-center justify-center mt-5 ">
            <img src={plus} className="mr-2" />
            <span>Добавить интеграцию</span>
          </Button>
        </div>
        <hr className=" bg-gray-400 mt-5 border-gray-400" />
        <div className="mt-5 text-sm text-gray-500">
          Здесь будут отображаться <br /> платежи с датой в будущем 👇
        </div>
      </article>
    </aside>
  );
};

export default AppSider;
