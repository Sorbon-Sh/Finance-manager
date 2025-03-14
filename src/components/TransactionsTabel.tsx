import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import transferIcon from "../assets/transfer-icon.png";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
  ModuleRegistry,
  RowClickedEvent,
  RowSelectionModule,
  RowSelectionOptions,
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
import { useGetSumQuery } from "../api/rtk-query/insertTranData";
import { useAppDispatch } from "../hooks/useReduxTypedHooks";
import { openModal, setTransactionId } from "../redux/slices/StateAndData";
import { useDeleteTransactionMutation } from "../api/rtk-query/deleteTranData";
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
  const rowsId = selectRows.find((item) => item);
  const containerStyle = useMemo(
    () => ({
      width: "100%",
      height: "100%",
    }),
    []
  );
  const gridStyle = useMemo(() => ({ height: "500px", width: "100%" }), []);
  const { data: transactions, refetch } = useGetSumQuery("transactions");
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
        cellRenderer: (params: ICellRendererParams) => {
          if (params.data.tranCategory === "transfer") {
            return (
              <div className="flex items-center">
                <img
                  src={transferIcon}
                  title="icon from Icons8"
                  className="size-5 mr-2"
                />
                <span>{params.value}</span>
              </div>
            );
          }
          if (params.data.tranCategory === "income") {
            return `+${params.value}`;
          } else {
            return `-${params.value}`;
          }
        },
        cellStyle: (params) => ({
          color:
            params.data.tranCategory === "income"
              ? "green"
              : params.data.tranCategory === "transfer"
              ? "black"
              : "red",
        }),
      },
      {
        field: "account",
        headerName: "Счет",
        cellRenderer: (params: ICellRendererParams) => {
          if (params.data.tranCategory === "transfer") {
            return `${JSON.parse(params.data.account).toAccount}`;
          } else {
            return params.data.account;
          }
        },
      },
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
    checkboxCheckedBackgroundColor: "#00b28e",
    checkboxCheckedShapeColor: "#fff",
  });

  const rowSelection = useMemo<
    RowSelectionOptions | "single" | "multiple"
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

  const editRowsByCheckBox = (rowId: { id: string; tranCategory: string }) => {
    if (rowId.tranCategory === "income") {
      dispatch(setTransactionId(rowId.id));
      dispatch(openModal(["income", true]));
    }
    if (rowId.tranCategory === "transfer") {
      dispatch(setTransactionId(rowId.id));
      dispatch(openModal(["transfer", true]));
    }
  };
  const editTransfer = (ids: string) => {
    dispatch(setTransactionId(ids));
    dispatch(openModal(["transfer", true]));
  };

  const handleRowClick = useCallback((event: RowClickedEvent) => {
    if (event.data.tranCategory === "income") editRowsByCheckBox(event.data.id);
    if (event.data.tranCategory === "transfer") editTransfer(event.data.id);
  }, []);

  const deleteTran = async () => {
    const ids = selectRows.map((elem) => elem.id);
    await deleteTransaction(ids);
    refetch();
  };

  return (
    <section>
      <div style={containerStyle}>
        <div>
          <div className="grid grid-cols-5 mb-7 gap-x-10   justify-between ">
            <input
              type="text"
              id="filter-text-box"
              autoComplete="off"
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
              <span
                onClick={deleteTran}
                className={`cursor-pointer hover:bg-slate-50/30 px-2 py-1 rounded-xl ${
                  selectRows.length !== 0 ? "visible" : "hidden"
                }`}
              >
                Удалить запись
              </span>
              {selectRows.length <= 1 && (
                <span
                  className={`cursor-pointer hover:bg-slate-50/30 px-2 py-1 rounded-xl ${
                    selectRows.length !== 0 ? "visible" : "hidden"
                  }`}
                  onClick={() => editRowsByCheckBox(rowsId)}
                >
                  Изменить
                </span>
              )}
              <span
                className={`cursor-pointer ${
                  selectRows.length !== 0 ? "visible" : "hidden"
                }`}
              >
                Доход * {selectRows.length} платеж *{" "}
                {selectRows
                  .filter((elem) => elem.tranCategory === "income")
                  .reduce((acc, amount) => acc + amount.amount, 0)}
              </span>
            </div>
          </div>
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
