"use client";

import { Routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";

// User profile component
export const UserProfile = () => {
  const pathname = usePathname();
  return (
    <a
      href="https://github.com/iamgriffon"
      className={cn(
        "flex items-center gap-3 cursor-pointer",
        pathname.includes(Routes.HOME) && "invisible"
      )}
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
};
