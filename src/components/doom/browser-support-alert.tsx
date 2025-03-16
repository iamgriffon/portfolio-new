import React from "react";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FaInfoCircle } from "react-icons/fa";
import { motion } from "framer-motion";

export function BrowserSupportAlert() {
  const t = useTranslations("main.doom");

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <Alert className="bg-destructive/20 border-destructive/30 mb-6">
        <FaInfoCircle className="h-4 w-4 text-white fill-white" />
        <AlertDescription className="text-white font-medium tracking-wide">
          {t("browserSupport")}
        </AlertDescription>
      </Alert>
    </motion.div>
  );
} 