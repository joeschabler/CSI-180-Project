import type { FC } from "react";

export const Header: FC<{ title: string }> = ({ title }) => {
  return (
    <header>
      <h1 style={{ paddingLeft: "20px" }}>{title}</h1>
    </header>
  );
};
