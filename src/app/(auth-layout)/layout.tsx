import React from "react";

type Props = {
  children: Readonly<React.ReactNode>;
};

export default function AuthLayout({ children }: Props) {
  return (
    <>
      <div className="auth-layout">{children}</div>
    </>
  );
}
