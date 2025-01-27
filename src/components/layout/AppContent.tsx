import { Link, Route, Routes } from "react-router";
import Transactions from "../contentComponents/Transactions";
import Analytic from "../contentComponents/Analytic";
import FinPlans from "../contentComponents/FinPlans";
import Deposits from "../contentComponents/Deposits";
export default function AppContent() {
  return (
    <main className="bg-white col-start-4 col-end-13 rounded-tr-3xl px-8">
      <nav>
        <ul className="flex  mb-6 mt-8 text-lg font-bold text-gray-500 [&>a>li]:px-5 [&>a>li]:py-2 [&>a>li]:rounded-full">
          <Link to="/">
            <li className="hover:text-slate-100 hover:bg-black">
              Transactions
            </li>
          </Link>
          <Link to="/analytic">
            <li className="hover:text-slate-100 hover:bg-black">Analytic</li>
          </Link>
          <Link to="/finplans">
            <li className="hover:text-slate-100 hover:bg-black">
              Create Fin Plans
            </li>
          </Link>
          <Link to="/deposits">
            <li className="hover:text-slate-100 hover:bg-black">Deposits</li>
          </Link>
        </ul>
      </nav>
      <section>
        {/*
        //* Если архитектура Routing в приложении большая, то сначала надо сверстать вёрстку,
        //* Затем Routing, чтобы не создавать путаницу и ошибок
         */}
        {/*
        //? Also can do on createBrowser in another case
         */}
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
