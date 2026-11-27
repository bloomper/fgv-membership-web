import { Logo } from "@bloomper/fgv-web-ui/shell/logo";
import { LogoText } from "@bloomper/fgv-web-ui/shell/logo-text";
import { ModeToggle } from "@bloomper/fgv-web-ui/shell/toggles";
import { LanguageToggle } from "@bloomper/fgv-web-ui/shell/toggles";

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
            className="flex flex-nowrap items-center gap-3"
          >
            <div className="flex aspect-square size-10 items-center justify-center rounded-lg">
              <Logo />
            </div>
            <div className="min-w-0 overflow-hidden">
              <LogoText className="text-foreground h-10 w-auto" />
            </div>
          </a>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageToggle />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
