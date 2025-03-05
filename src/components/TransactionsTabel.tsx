import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ColDef,
  GridApi,
  GridReadyEvent,
  ModuleRegistry,
  RowClickedEvent,
  RowSelectionModule,
  themeQuartz,
  ValidationModule,
} from "ag-grid-community";
import {
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  RowGroupingModule,
  AllEnterpriseModule,
  ExcelExportModule,
  QuickFilterModule,
} from "ag-grid-enterprise";
import { GridAndTransaction } from "../types/types";
import { useGetSumQuery } from "../api/rtk-query/insertToDataBase";
import { useAppDispatch } from "../hooks/useReduxTypedHooks";
import { openModal, setTransactionId } from "../redux/slices/StateAndData";
import { useDeleteTransactionMutation } from "../api/rtk-query/deleteData";
ModuleRegistry.registerModules([
  RowSelectionModule,
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  AllEnterpriseModule,
  ExcelExportModule,
  RowGroupingModule,
  QuickFilterModule,
  ValidationModule /* Development Only */,
]);

const TransactionsTable = () => {
  const dispatch = useAppDispatch();
  const gridRef = useRef<AgGridReact<GridAndTransaction>>(null);
  const [deleteTransaction] = useDeleteTransactionMutation();
  const [selectRows, setSelecRows] = useState<GridAndTransaction[]>([]);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "500px", width: "100%" }), []);
  const { data: transactions } = useGetSumQuery("transactions");
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
  }, []);

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        field: "date",
        headerName: "Дата",
        valueFormatter: (params) => {
          const date = params.value;
          return date
            ? `${date.day}.${date.month.shortName}.${date.year} ${date.hour}:${date.minute}`
            : "";
        },
      },
      {
        field: "amount",
        headerName: "Сумма",
        valueFormatter: (params) => {
          return params.data.tranCategory === "income"
            ? `+${params.value}`
            : `-${params.value}`;
        },
        cellStyle: (params) => ({
          color: params.data.tranCategory === "income" ? "green" : "red",
        }),
      },
      { field: "account", headerName: "Счет" },
      { field: "counterParty", headerName: "Контрагент" },
      { field: "category", headerName: "Категория" },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
      cellClass: "cursor-pointer",
    };
  }, []);

  const myTheme = themeQuartz.withParams({
    wrapperBorder: false,
    headerRowBorder: true,
    headerFontSize: "14px",
    headerBackgroundColor: "white",
    headerTextColor: "gray",
    rowBorder: { style: "solid", width: 2, color: "#e3e6e8" },
    columnBorder: { style: "none" },
    rowHeight: "74px",
    rowHoverColor: "#edf4f7",
  });

  const rowSelection = useMemo<
    { mode: "single" } | { mode: "multiRow" }
  >(() => {
    return {
      mode: "multiRow",
    };
  }, []);

  const onSelectionChanged = useCallback(() => {
    if (gridRef.current) {
      const selectedData = gridRef.current.api.getSelectedRows();
      setSelecRows(selectedData);
      // Здесь вы можете обновить состояние или выполнить другие действия с выбранными данными
    }
  }, []);

  useEffect(() => {
    if (gridApi && transactions) {
      gridApi.setGridOption("rowData", transactions);
    }
  }, [transactions, gridApi]);

  const editIncome = (id: string) => {
    dispatch(setTransactionId(id));
    dispatch(openModal(["income", true]));
  };

  const handleRowClick = useCallback((event: RowClickedEvent) => {
    console.log(event.data);

    if (event.data.tranCategory === "income") {
      editIncome(event.data.id);
    } else {
      return null;
    }
  }, []);

  const deleteTran = () => {
    const ids = selectRows.map((elem) => elem.id);
    deleteTransaction(ids);
  };
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current!.api.setGridOption(
      "quickFilterText",
      (document.getElementById("filter-text-box") as HTMLInputElement).value
    );
  }, []);
  const onExportClick = () => {
    gridRef.current?.api.exportDataAsExcel({
      fileName: "FinManager.xlsx",
    });
  };
  return (
    <section>
      <div style={containerStyle}>
        <div className="">
          <div className="grid grid-cols-5 mb-7 gap-x-10   justify-between ">
            <input
              type="text"
              id="filter-text-box"
              onInput={onFilterTextBoxChanged}
              placeholder="Поиск по счетам, контрагентам, категориям"
              className="py-2 rounded-xl col-span-4  bg-[#edf4f7] ml-2 mr-9 outline-green-300 pl-4 search"
            />
            <button
              onClick={onExportClick}
              className="bg-green-600 cursor-pointer rounded-xl text-white font-medium"
            >
              Экспорт в Excel
            </button>
          </div>
          <div>
            <div
              className={`bg-[#00b28e] w-full px-5  ease-in-out transition-all duration-700 ${
                selectRows.length !== 0 ? "h-9" : "h-0 text-transparent"
              } font-bold text-[15px] text-slate-100 flex justify-between  items-center rounded-xl`}
            >
              <span onClick={deleteTran}>Удалить запись,</span>
              {selectRows.length <= 1 && <span>Изменить,</span>}
              <span>
                Доход * {selectRows.length} платеж *{" "}
                {selectRows
                  .filter((elem) => elem.tranCategory === "income")
                  .reduce((acc, amount) => acc + amount.amount, 0)}
              </span>
            </div>
          </div>
          {/* Test t*/}
        </div>
        <div style={gridStyle}>
          <AgGridReact<GridAndTransaction>
            getRowId={(params) => params.data.id}
            theme={myTheme}
            ref={gridRef}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowSelection={rowSelection}
            onGridReady={onGridReady}
            onRowClicked={handleRowClick}
            onSelectionChanged={onSelectionChanged}
          />
        </div>
      </div>
    </section>
  );
};

export default TransactionsTable;
