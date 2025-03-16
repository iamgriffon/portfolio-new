import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { locales, getMessages } from "@/app/i18n";
import LanguageSwitcher from "@/components/ui/common/language-switcher";
import Image from "next/image";
import { headers } from "next/headers";
import { TitleAndBackButton } from "@/components/ui/common/title-and-button";

export default async function LocaleLayout(props: any) {
  const { children, params } = props;
  const { locale } = (await params) as { locale: string };
  const initialPathname =
    (await headers()).get("x-url")?.replace("/", "") || "";

  if (!locale || !locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <header className="flex flex-col gap-4 w-full justify-between items-center h-40 z-20 mb-4 shadow-md">
        <section className="flex w-full max-w-7xl pt-8 justify-between items-center gap-2 container h-full pb-2">
          {" "}
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
          <LanguageSwitcher />
        </section>
        <TitleAndBackButton initialPathname={initialPathname} />
      </header>
      <main className="w-full h-full overflow-scroll">{children}</main>
    </NextIntlClientProvider>
  );
}
