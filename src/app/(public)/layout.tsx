import * as React from "react";
import {PublicHeader} from "@/components/public-header";

/**
 * The pages anyone can open: registration, and the personal payment link, whose token is the key. They have no sidebar.
 */
export default function PublicLayout({children}: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-dvh flex-col bg-background">
            <PublicHeader/>
            <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">{children}</main>
        </div>
    );
}
