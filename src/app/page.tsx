import { redirect } from 'next/navigation';
import { locales } from '@/i18n';

export default function HomePage() {
  redirect(`/${locales[0]}`);
}
