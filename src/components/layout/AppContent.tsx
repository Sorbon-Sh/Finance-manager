import { Link, Route, Routes } from "react-router";
import Transactions from "../contentComponents/Transactions";
import Analytic from "../contentComponents/Analytic";
import FinPlans from "../contentComponents/FinPlans";
import Deposits from "../contentComponents/Deposits";

export default function AppContent() {
  return (
    <main className="bg-white col-start-4 col-end-13 rounded-tr-3xl px-8">
      <menu className="flex gap-x-5  mb-6 mt-8 text-lg font-bold text-gray-500">
        <Link to="/">
          <div>Transactions</div>
        </Link>
        <Link to="/analytic">
          <div>Analytic</div>
        </Link>
        <Link to="/finplans">
          <div>Create Fin Plans</div>
        </Link>
        <Link to="/deposits">
          <div>Deposites</div>
        </Link>
        <div>Other...</div>
      </menu>

      <section>
        <div className="flex mb-7">
          <div>All time</div>
          <div>
            <input
              type="text"
              placeholder="Поиск по счетам, клиентам, комментариям"
              className="w-[519px] p-2 rounded-lg bg-[#edf4f7] ml-2 mr-9"
            />
          </div>
          <div className="">Filter By</div>
        </div>
        {/* Also can do in createBrowser */}
        <Routes>
          <Route path="/" element={<Transactions />} />
          <Route path="/analytic" element={<Analytic />} />
          <Route path="/finplans" element={<FinPlans />} />
          <Route path="/deposits" element={<Deposits />} />
          <Route path="*" element={<div>NO Page Found</div>} />
        </Routes>
      </section>
    </main>
  );
}
