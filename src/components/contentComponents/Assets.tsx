import DepositsTable from "../AssetsTable";

const Assets = () => {
  return (
    <DepositsTable
      header={{
        date: "Date",
        investmentAmount: "Investment",
        monthly: "Monthly",
        annual: "Annual",
        commission: "Commission",
        all: "All",
        bank: "Bank",
        //? Создать данные так
        // items: {
        //   date: "25 янв. 2025",
        //   time: "10:51",
        //   investmentAmount: "10,000$",
        //   monthlyInterest: "1.083%",
        //   annualInterest: "13%",
        //   commission: "8%",
        //   bank: "Sber Bank",
        // }
      }}
      items={{
        date: "25 янв. 2025",
        time: "10:51",
        investmentAmount: "10,000$",
        monthlyInterest: "1.083%",
        annualInterest: "13%",
        commission: "8%",
        all: "32",
        bank: "Sber Bank",
      }}
    />
  );
};

export default Assets;
