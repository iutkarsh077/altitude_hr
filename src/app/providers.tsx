"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { AddUserInformation, ClearUserInformation } from "@/features/userslices";
import store from "@/store/store";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type CurrentUser = {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
};

export function Providers({
    children,
    currentUser,
}: {
    children: React.ReactNode;
    currentUser: CurrentUser | null;
}) {
    const queryClient = new QueryClient()

    useEffect(() => {
        if (currentUser) {
            store.dispatch(AddUserInformation(currentUser));
        } else {
            store.dispatch(ClearUserInformation());
        }
    }, [currentUser]);

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </Provider>
    );
}
