const TransactionsTabel = () => {
  return (
    <article>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">
              <input type="checkbox" className="h-5 w-5" />
            </th>
            <th className="p-2 text-left">Дата</th>
            <th className="p-2 text-left">Сумма</th>
            <th className="p-2 text-left">Счет/остаток</th>
            <th className="p-2 text-left">Контрагент</th>
            <th className="p-2 text-left">Категория</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-2">
              <input type="checkbox" className="h-5 w-5" />
            </td>
            <td className="p-2">
              <div>25 янв. 2025</div>
              <div className="text-gray-500">10:51</div>
            </td>
            <td className="p-2 text-green-500">+100 TJS</td>
            <td className="p-2">
              <div>Crypto</div>
              <div className="text-gray-500">200 TJS</div>
            </td>
            <td className="p-2">bank</td>
            <td className="p-2">Инвестиции</td>
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

export default TransactionsTabel;
