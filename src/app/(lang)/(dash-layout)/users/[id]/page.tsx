import React from "react";
import UsersPage from "./UsersPage";

export async function generateStaticParams() {
    return [{ id: "1" }];
}

export default function page() {
    return (
        <div>
            <UsersPage ></UsersPage>
        </div>
    );
}
