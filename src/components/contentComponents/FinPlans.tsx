const FinPlans = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="rounded-lg shadow-lg w-full ">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">Plans</h2>
          </div>
        </div>
        <div className="">
          <table className="w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Plan</th>
                <th className="py-2 px-4 border-b text-left">money/month</th>
                <th className="py-2 px-4 border-b text-left">max money</th>
                <th className="py-2 px-4 border-b text-left">year</th>
                <th className="py-2 px-4 border-b text-left">Сollected</th>
                <th className="py-2 px-4 border-b">Procent</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b">Home</td>
                <td className="py-2 px-4 border-b">1000TJS/month</td>
                <td className="py-2 px-4 border-b">50,000TJS</td>
                <td className="py-2 px-4 border-b">5 year</td>
                <td className="py-2 px-4 border-b">7,000</td>
                <td className="py-2 px-4 border-b">10%</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">
                  Startup{" "}
                  <span className="text-purple-600">(Current Plan)</span>
                </td>
                <td className="py-2 px-4 border-b">8 GB RAM</td>
                <td className="py-2 px-4 border-b">6 CPUs</td>
                <td className="py-2 px-4 border-b">256 GB SSD disk</td>
                <td className="py-2 px-4 border-b">$80/month</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                    disabled
                  >
                    Select
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Business</td>
                <td className="py-2 px-4 border-b">16 GB RAM</td>
                <td className="py-2 px-4 border-b">8 CPUs</td>
                <td className="py-2 px-4 border-b">512 GB SSD disk</td>
                <td className="py-2 px-4 border-b">$160/month</td>
                <td className="py-2 px-4 border-b">
                  <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">
                    Select
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4">Enterprise</td>
                <td className="py-2 px-4">1024 GB RAM</td>
                <td className="py-2 px-4">12 CPUs</td>
                <td className="py-2 px-4">128 GB SSD disk</td>
                <td className="py-2 px-4">$240/month</td>
                <td className="py-2 px-4">
                  <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">
                    Select
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinPlans;
