import {Logo} from "@/components/logo";
import {LogoText} from "@/components/logo-text";
import {ModeToggle} from "@/components/mode-toggle.client";
import {LanguageToggle} from "@/components/language-toggle.client";

/** The header of the pages that have no sidebar: the start page for visitors, registration and personal payment links. */
export function PublicHeader() {
    return (
        <header className="px-4 py-2">
            <div className="flex w-full flex-nowrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center justify-start gap-3">
                    <a
                        href="https://www.fgv.nu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 flex-nowrap"
                    >
                        <div className="flex aspect-square size-10 items-center justify-center rounded-lg">
                            <Logo/>
                        </div>
                        <div className="min-w-0 overflow-hidden">
                            <LogoText className="h-10 w-auto text-foreground"/>
                        </div>
                    </a>
                </div>
        
                <div className="flex shrink-0 items-center gap-2">
                    <LanguageToggle/>
                    <ModeToggle/>
                </div>
            </div>
        </header>
    );
}
