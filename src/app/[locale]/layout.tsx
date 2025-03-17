import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { locales, getMessages } from "@/i18n";
import LanguageSwitcher from "@/components/ui/common/language-switcher";
import Image from "next/image";
import { headers } from "next/headers";
import { TitleAndBackButton } from "@/components/ui/common/title-and-button";
import { ReactNode } from "react";

// Layout props type
type LocaleLayoutProps = {
  children: ReactNode;
  params: {
    locale: string;
  };
};

// User profile component
const UserProfile = () => (
  <a
    href="https://github.com/iamgriffon"
    className="flex items-center gap-3 cursor-pointer"
    target="_blank"
  >
    <Image
      src="https://github.com/iamgriffon.png"
      alt="Logo"
      width={32}
      height={32}
      className="rounded-full"
    />
    <span className="font-bold text-lg text-white">Gustavo</span>
  </a>
);

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

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  
  // Get the current pathname from headers
  const initialPathname = (await headers()).get("x-url")?.replace("/", "") || "";

  // Validate that locale is supported
  if (!locale || !locales.includes(locale)) {
    notFound();
  }

  // Get messages for the current locale
  const messages = await getMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <NavigationHeader initialPathname={initialPathname} />
      <main className="w-full h-full pt-20 overflow-scroll">{children}</main>
    </NextIntlClientProvider>
  );
}
