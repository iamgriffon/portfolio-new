import LanguageSwitcher from "./language-switcher";
import { TitleAndBackButton } from "./title-and-button";
import { UserProfile } from "./user-profile-picture";

// Navigation header component
const NavigationHeader = ({ initialPathname }: { initialPathname: string }) => (
  <header className="flex flex-col gap-2 sm:gap-4 w-full justify-between items-center h-auto min-h-[6rem] sm:min-h-[8rem] z-20 mb-2 sm:mb-4">
    <section className="flex w-full max-w-7xl items-center justify-between relative px-3 pt-2 sm:px-6 sm:pt-4">
      <UserProfile />
      <LanguageSwitcher />
    </section>
    <TitleAndBackButton initialPathname={initialPathname} />
  </header>
);

export default NavigationHeader;
