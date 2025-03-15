import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { locales, getMessages } from "@/app/i18n";
import LanguageSwitcher from "@/components/ui/language-switcher";
import Link from "next/link";
import Image from "next/image";
export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  const messages = await getMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="min-h-screen w-full overflow-hidden">
        <header className="flex w-full justify-between items-center container mx-auto px-4 mt-10">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <Image
              src="https://github.com/iamgriffon.png"
              alt="Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="font-bold text-lg text-white">Gustavo</span>
          </Link>
          <LanguageSwitcher />
        </header>

        <main className="relative z-10 w-full min-h-screen">{children}</main>
      </div>
    </NextIntlClientProvider>
  );
}
