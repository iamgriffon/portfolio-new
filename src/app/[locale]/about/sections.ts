import { useTranslations } from "next-intl";

const t = useTranslations("about");

export const sections = [
  {
    title: t("sections.resume"),
    description: t("sections.resumeDescription"),
  },
  {
    title: t("sections.skills"),
    description: t("sections.skillsDescription"),
  },
  {
    title: t("sections.socials"),
    description: t("sections.socialsDescription"),
  },
];
