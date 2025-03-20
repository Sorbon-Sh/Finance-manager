import loadingIcon from "../assets/cash-icon.gif";
import { FetchError } from "./FetchError";

interface IProps {
  className?: string;
  error: object | undefined;
  modal?: [string, boolean];
  onReload: () => void;
}

export const Loading = ({ className, error, onReload }: IProps) => {
  if (error) return <FetchError error={error} refetch={() => onReload()} />;
  return <img src={loadingIcon} className={`mx-auto ${className}`} />;
};
