import LanguageSwitcher from "./language-switcher";
import { TitleAndBackButton } from "./title-and-button";
import { UserProfile } from "./user-profile-picture";

// Navigation header component
const NavigationHeader = ({ initialPathname }: { initialPathname: string }) => (
  <header className="flex flex-col gap-4 w-full justify-between items-center h-40 z-20 mb-4">
    <section className="flex w-full max-w-7xl pt-8 justify-between items-center gap-2 container h-full pb-2">
      <UserProfile />
      <LanguageSwitcher />
    </section>
    <TitleAndBackButton initialPathname={initialPathname} />
  </header>
);

export default NavigationHeader;