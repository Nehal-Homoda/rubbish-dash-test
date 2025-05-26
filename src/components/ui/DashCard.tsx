import { ReactNode } from "react";

export default function DashCard({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <>
      <div className="bg-background px-6 py-7 rounded-3xl shadow-lg w-1/2 ms-32">
        {title ? (
          <div className="title w-fit text-foreground ">
            <p className="font-bold text-lg">{title}</p>
          </div>
        ) : (
          ""
        )}

        <div className="content mt-5">{children}</div>
      </div>
    </>
  );
}
