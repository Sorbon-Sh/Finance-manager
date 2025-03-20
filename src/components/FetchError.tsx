import { getErrorMessage } from "../utility/reduxErrorsCheck";

interface IProps {
  refetch: () => void;
  error: object;
}

export const FetchError = ({ refetch, error }: IProps) => {
  return (
    <div className="text-red-500 mt-12 font-medium flex justify-center items-center gap-x-4">
      <span>{getErrorMessage(error)}</span>
      <span
        onClick={() => refetch()}
        className="bg-blue-500 text-white cursor-pointer py-2 px-3 rounded-lg"
      >
        Refresh
      </span>
    </div>
  );
};
