"use client";
import { store } from "@/stores/store";
import { Provider } from "react-redux";

export default function StoreProvider({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    console.log(process.env.NEXT_PUBLIC_VERSION);

    return (
        <>
            <Provider store={store}>{children}</Provider>
        </>
    );
}
