export const locales = ['en', 'pt-BR', 'zh'];

export async function getMessages(locale: string) {
  const messages = (await import(`../messages/${locale}.json`)).default;
  return messages;
}

export async function getTranslations(namespace: string, locale: string) {
  const messages = await getMessages(locale);
  return messages[namespace] || {};
} 