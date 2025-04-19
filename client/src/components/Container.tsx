import { ReactNode } from "react";

export interface IContainerProps {
  children: ReactNode;
}

const Container = ({ children }: IContainerProps) => {
  return <div className="">{children}</div>;
};

export default Container;
