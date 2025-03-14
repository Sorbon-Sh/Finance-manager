import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

import { useAppDispatch } from "../hooks/useReduxTypedHooks";
import { openModal, setPlanTranID } from "../redux/slices/StateAndData";

import { createPortal } from "react-dom";
import AddAmountToPlanModal from "./modalWindow/AddAmountToPlan";
import {
  useDeletePlanTransactionsMutation,
  useGetPlanTransactionsQuery,
} from "../api/rtk-query/finPlanTransactions";
import { useParams } from "react-router";
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

const PlanTable = () => {
  const { id: urlPlanId } = useParams();
  const dispatch = useAppDispatch();
  const gridRef = useRef<AgGridReact<GridAndTransaction>>(null);
  const [deletePlanTransactions] = useDeletePlanTransactionsMutation();
  const [selectRows, setSelecRows] = useState<GridAndTransaction[]>([]);

  const containerStyle = useMemo(
    () => ({
      width: "100%",
      height: "100%",
    }),
    []
  );
  const gridStyle = useMemo(() => ({ height: "500px", width: "100%" }), []);
  const { data: transactions, refetch } = useGetPlanTransactionsQuery();
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
        headerName: "Amount",
        cellRenderer: (params: ICellRendererParams) => {
          return <span>{params.value}</span>;
        },
        // cellStyle: (params) => ({}),
      },
      { field: "fromPlan", headerName: "Plan" },
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

  useEffect(() => {
    if (gridApi && transactions) {
      const showDataById = transactions.filter(
        (elem) => elem.planId === urlPlanId
      );
      gridApi.setGridOption("rowData", showDataById);
    }
  }, [transactions, gridApi]);

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current!.api.setGridOption(
      "quickFilterText",
      (document.getElementById("filter-text-box") as HTMLInputElement).value
    );
  }, []);

  const onSelectionChanged = useCallback(() => {
    if (gridRef.current) {
      const selectedData = gridRef.current.api.getSelectedRows();
      setSelecRows(selectedData);
    }
  }, []);

  const editPlanTran = () => {
    const rowIdByCheckBox = selectRows.find((item) => item);
    if (rowIdByCheckBox) {
      dispatch(setPlanTranID(rowIdByCheckBox.id));
      dispatch(openModal(["addAmountPlan", true]));
    }
  };

  const handleRowClick = useCallback((event: RowClickedEvent) => {
    dispatch(setPlanTranID(event.data.id));
    dispatch(openModal(["addAmountPlan", true]));
  }, []);

  const deleteTran = async () => {
    const ids = selectRows.map((elem) => elem.id);
    await deletePlanTransactions(ids);
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
              onClick={() => dispatch(openModal(["addAmountPlan", true]))}
              className="bg-green-600 cursor-pointer rounded-xl text-white font-medium"
            >
              Добавить сумму
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
                className="cursor-pointer hover:bg-slate-50/30 px-2 py-1 rounded-xl"
              >
                Удалить запись
              </span>
              {selectRows.length <= 1 && (
                <span
                  className="cursor-pointer hover:bg-slate-50/30 px-2 py-1 rounded-xl"
                  onClick={editPlanTran}
                >
                  Изменить
                </span>
              )}
              <span>
                Доход * {selectRows.length} платеж *{" "}
                {selectRows.reduce((acc, amount) => acc + amount.amount, 0)}
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
      {createPortal(<AddAmountToPlanModal />, document.body)}
    </section>
  );
};

export default PlanTable;
