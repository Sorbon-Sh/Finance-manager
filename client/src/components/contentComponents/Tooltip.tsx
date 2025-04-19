interface IProps {
  number: number;
  className?: string;
  isActive: boolean;
}

const Tooltip = ({ number, className, isActive }: IProps) => {
  return (
    <div
      className={`flex text-black absolute z-10 gap-x-1 ${isActive ? "block" : "hidden"}   items-center justify-center min-w-16-28 bg-slate-50 border  rounded-lg px-3 py-2 ${className}  `}
    >
      <h1 className="font-bold text-lg">Сумма:</h1>
      <p className="text-lg font-normal">{number}</p>
    </div>
  );
};
export default Tooltip;
