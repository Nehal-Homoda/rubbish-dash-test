import React from "react";

type Props = {
  children: Readonly<React.ReactNode>;
};

export default function DashLayout({ children }: Props) {
  return (
    <>
      <div className="dash-layout">{children}</div>
    </>
  );
}
