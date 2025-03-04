import { IAssets } from "../types/types";

const DepositsTable = ({ header, items }: IAssets) => {
  return (
    <article>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">
              <input type="checkbox" className="h-5 w-5" />
            </th>
            <th className="p-2 text-left">{header.date}</th>
            <th className="p-2 text-left">{header.investmentAmount}</th>
            <th className="p-2 text-left">{header.monthly}</th>
            <th className="p-2 text-left">{header.annual}</th>
            <th className="p-2 text-left">{header.commission}</th>
            <th className="p-2 text-left">{header.all}</th>
            <th className="p-2 text-left">{header.bank}</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-2">
              <input type="checkbox" className="h-5 w-5" />
            </td>
            <td className="p-2">
              <div>{items.date}</div>
              <div className="text-gray-500">{items.time}</div>
            </td>
            <td className="p-2 text-green-500">{items.investmentAmount}</td>
            <td className="p-2">
              <div>
                {items.monthlyInterest}
                <div>50</div>
              </div>
            </td>
            <td className="p-2">
              {items.annualInterest}
              <div>100</div>
            </td>
            <td className="p-2">
              {items.commission}
              <div>10$</div>
            </td>
            <td className="p-2">{items.all}</td>
            <td className="p-2">{items.bank}</td>
          </tr>
          <tr className="border-b">
            <td className="p-2">
              <input type="checkbox" className="h-5 w-5" />
            </td>
            <td className="p-2">
              <div>23 янв. 2025</div>
              <div className="text-gray-500">19:24</div>
            </td>
            <td className="p-2 text-green-500">+1 093.62 TJS</td>
            <td className="p-2">
              <div>Bank account</div>
              <div className="text-gray-500">1 093.62 TJS</div>
            </td>
            <td className="p-2">bank</td>
            <td className="p-2">Инвестиции</td>
          </tr>
        </tbody>
      </table>
    </article>
  );
};

export default DepositsTable;
