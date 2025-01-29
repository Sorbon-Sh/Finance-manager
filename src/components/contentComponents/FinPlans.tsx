import { Link } from "react-router";

const FinPlans = () => {
  return (
    <div className=" rounded-lg  w-full max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Plans</h2>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-full bg-white border border-gray-200 rounded-lg">
          <div className="flex py-2 px-4 border-b">
            <span className="w-1/5 font-semibold">Plan</span>
            <span className="w-1/5 font-semibold">Month</span>
            <span className="w-1/5 font-semibold">Max plan</span>
            <span className="w-1/5 font-semibold">Year</span>
            <span className="w-1/5 font-semibold">Procent</span>
            <span className="w-1/5 font-semibold">All</span>
            <span className="w-1/5"></span>
          </div>
          <div className="flex py-2 px-4 border-b">
            <Link to="table">
              <span className="w-1/5">Hobby</span>
            </Link>
            <span className="w-1/5">4 GB RAM</span>
            <span className="w-1/5">4 CPUs</span>
            <span className="w-1/5">128 GB SSD disk</span>
            <span className="w-1/5">$40/month</span>
            <span className="w-1/5">
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">
                Select
              </button>
            </span>
          </div>
          <div className="flex py-2 px-4 border-b">
            <span className="w-1/5">
              Startup <span className="text-purple-600">(Current Plan)</span>
            </span>
            <span className="w-1/5">8 GB RAM</span>
            <span className="w-1/5">6 CPUs</span>
            <span className="w-1/5">256 GB SSD disk</span>
            <span className="w-1/5">$80/month</span>
            <span className="w-1/5">
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                disabled
              >
                Select
              </button>
            </span>
          </div>
          <div className="flex py-2 px-4 border-b">
            <span className="w-1/5">Business</span>
            <span className="w-1/5">16 GB RAM</span>
            <span className="w-1/5">8 CPUs</span>
            <span className="w-1/5">512 GB SSD disk</span>
            <span className="w-1/5">$160/month</span>
            <span className="w-1/5">
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">
                Select
              </button>
            </span>
          </div>
          <div className="flex py-2 px-4">
            <span className="w-1/5">Enterprise</span>
            <span className="w-1/5">1024 GB RAM</span>
            <span className="w-1/5">12 CPUs</span>
            <span className="w-1/5">128 GB SSD disk</span>
            <span className="w-1/5">$240/month</span>
            <span className="w-1/5">
              <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg">
                Select
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinPlans;
