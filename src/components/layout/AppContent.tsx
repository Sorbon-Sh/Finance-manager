export default function AppContent() {
  return (
    <main className="bg-white col-start-4 col-end-13 rounded-tr-3xl px-8">
      <div className="flex gap-x-5  mb-6 mt-8 text-lg font-bold text-gray-500">
        <div>Transactions</div>
        <div>Analitics</div>
        <div>Create Fin Plane</div>
        <div>Other...</div>
      </div>

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
        <div>Money info</div>
      </section>
    </main>
  );
}
