import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import transferIcon from "../../assets/transfer-icon.png";

import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ColDef,
  GridApi,
  GridReadyEvent,
  ICellRendererParams,
  ModuleRegistry,
  ProcessCellForExportParams,
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
import { GridAndTransaction } from "../../types/indexTypes";
import { useGetSumQuery } from "../../api/rtk-query/insertTranData";
import { useAppDispatch } from "../../hooks/useReduxTypedHooks";
import { openModal, setTransactionId } from "../../redux/slices/StateAndData";
import { useDeleteTransactionMutation } from "../../api/rtk-query/deleteTranData";
import Button from "../buttons/Button";
import { Loading } from "../Loading";
import { NoTransactions } from "../NoTransactions";
import useMainCurrency from "../../hooks/useMainCurrency";
import { toast } from "react-toastify";
import { truncateDecimal } from "../../utility/truncateDecimal";
import { useCapitalize } from "../../hooks/useCapitalize";
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
  const { toLowerCase } = useCapitalize();
  const mainCurrency = useMainCurrency();
  const containerStyle = useMemo(
    () => ({
      width: "100%",
      height: "100%",
    }),
    [],
  );
  const gridStyle = useMemo(() => ({ height: "500px", width: "100%" }), []);
  const { data: transactions, refetch, error } = useGetSumQuery("transactions");
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
            ? `${date.day}.${toLowerCase(date.month.shortName)}.${date.year} ${date.hour}:${date.minute}`
            : "";
        },
      },
      {
        field: "amount",
        tooltipField: "amount",
        headerName: "Сумма",
        cellRenderer: (params: ICellRendererParams) => {
          const amount = truncateDecimal(params.value);
          if (params.data.tranCategory === "transfer") {
            return (
              <div className="flex gap-x-1 items-center">
                <img
                  src={transferIcon}
                  title="icon from Icons8"
                  className="size-5 "
                />
                <span>{amount}</span>
                <span className="text-gray-500">{mainCurrency}</span>
              </div>
            );
          }
          if (params.data.tranCategory === "income") {
            return (
              <>
                <span>+{amount}</span>{" "}
                <span className="text-gray-500">{mainCurrency}</span>
              </>
            );
          } else {
            return (
              <>
                <span>-{amount}</span>{" "}
                <span className="text-gray-500">{mainCurrency}</span>
              </>
            );
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
      {
        field: "counterParty",
        headerName: "Контрагент",
        cellRenderer: (params: ICellRendererParams) => {
          if (params.data.counterParty !== "") {
            return params.data.counterParty;
          } else {
            return "Указать";
          }
        },
      },

      {
        field: "category",
        headerName: "Категория",
        cellRenderer: (params: ICellRendererParams) => {
          if (params.data.category !== "") {
            return params.data.category;
          } else {
            return "Указать";
          }
        },
      },
    ],
    [],
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
      (document.getElementById("filter-text-box") as HTMLInputElement).value,
    );
  }, []);
  const onExportClick = () => {
    gridRef.current?.api.exportDataAsExcel({
      fileName: "FinManager.xlsx",
      processCellCallback: (params: ProcessCellForExportParams) => {
        if (!params) return "No data";
        const data = params.node?.data;
        const colId = params.column.getColId();
        const currency = data.currency;
        const d = data.date;

        try {
          switch (colId) {
            case "account":
              if (data.tranCategory === "transfer") {
                const parsed = JSON.parse(data.account);
                return `${parsed.fromAccount} → ${parsed.toAccount}`;
              }
              return data.account;
            case "currency":
              return currency.namebank || "—";
            case "date":
              return `${d.day}.${d.month.number}.${d.year} ${d.hour}:${String(
                d.minute,
              ).padStart(2, "0")}`;

            default:
              return params.value;
          }
        } catch (error) {
          console.log("Excel error: ", error);
          return params.value;
        }
      },
    });
  };

  const editRowsByCheckBox = () => {
    const rowsId = selectRows.find((item) => item);
    if (!rowsId) throw new Error("editRowsByCheckBox ID is undefined");

    if (rowsId.tranCategory === "income") {
      dispatch(setTransactionId(rowsId.id));
      dispatch(openModal(["income", true]));
    }
    if (rowsId.tranCategory === "transfer") {
      dispatch(setTransactionId(rowsId.id));
      dispatch(openModal(["transfer", true]));
    }
    if (rowsId.tranCategory === "expense") {
      dispatch(setTransactionId(rowsId.id));
      dispatch(openModal(["expense", true]));
    }
  };

  const handleRowClick = useCallback((event: RowClickedEvent) => {
    if (event.data.tranCategory === "income") {
      dispatch(setTransactionId(event.data.id));
      dispatch(openModal(["income", true]));
    }
    if (event.data.tranCategory === "transfer") {
      dispatch(setTransactionId(event.data.id));
      dispatch(openModal(["transfer", true]));
    }
    if (event.data.tranCategory === "expense") {
      dispatch(setTransactionId(event.data.id));
      dispatch(openModal(["expense", true]));
    }
  }, []);

  const deleteTran = async () => {
    const toastId = toast.loading("Удаление данных...");
    const ids = selectRows.map((elem) => elem.id);
    await deleteTransaction(ids);
    toast.update(toastId, {
      render: "Транзакция успешно удалена!",
      type: "success",
      isLoading: false,
      autoClose: 2000,
    });
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
              className="bg-green-500 cursor-pointer rounded-xl text-white font-medium"
            >
              Экспорт в Excel
            </button>
          </div>
          <div>
            <div
              className={`bg-[#00b28e] w-full px-5  ease-in-out transition-all duration-700 ${
                selectRows.length !== 0
                  ? "h-9"
                  : "h-0 [&>span]:hidden [&>button]:hidden"
              } font-bold text-[15px] text-slate-100 flex justify-between  items-center rounded-xl`}
            >
              <Button
                submitHandler={deleteTran}
                className="cursor-pointer hover:bg-slate-50/30 px-2 py-1 rounded-xl"
              >
                Удалить запись
              </Button>
              {selectRows.length <= 1 && (
                <Button
                  className="cursor-pointer hover:bg-slate-50/30 px-2 py-1 rounded-xl"
                  submitHandler={() => editRowsByCheckBox()}
                >
                  Изменить
                </Button>
              )}
              <span className="cursor-pointer">
                Доход * {selectRows.length} платеж *{" "}
                {truncateDecimal(
                  selectRows
                    .filter((elem) => elem.tranCategory === "income")
                    .reduce((acc, amount) => acc + amount.amount, 0),
                )}
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
            loadingOverlayComponent={Loading}
            loadingOverlayComponentParams={{
              onReload: refetch,
              error: error,
            }}
            noRowsOverlayComponent={NoTransactions}
            noRowsOverlayComponentParams={{
              header: "Транзакции пустые",
              btnText: "Добавить",
              modal: ["income", true],
              error: error,
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default TransactionsTable;
