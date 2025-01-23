import { ReactNode } from "react";

interface IContainerProps {
  children: ReactNode;
}

const Container = ({ children }: IContainerProps) => {
  return <div className="">{children}</div>;
};

export default Container;
