

import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { locales, getMessages } from "@/i18n";
import { headers } from "next/headers";
import { ReactNode } from "react";
import NavigationHeader from "@/components/ui/common/navigation-header";

interface LocaleLayoutProps {
  children: ReactNode;
  params: {
    locale: string;
  };
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  const initialPathname =
    (await headers()).get("x-url")?.replace("/", "") || "";

  if (!locale || !locales.includes(locale)) {
    notFound();
  }
  const messages = await getMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <NavigationHeader initialPathname={initialPathname} />
      <main className="w-full h-full pt-20 overflow-scroll">{children}</main>
    </NextIntlClientProvider>
  );
}
