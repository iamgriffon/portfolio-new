import { AnimationProps, motion } from "framer-motion";
import { SectionTitle } from "../ui/common/section-title";
import { MenuItem } from "../ui/menu-item";
import { MenuOption } from "./types";

export const Menu = ({
  menuOptions,
  handleMenuOptionClick,
  menuAnimationProps,
  menuRef,
  menuTitle,
}: {
  menuOptions: MenuOption[];
  handleMenuOptionClick: (action: string) => void;
  menuAnimationProps: AnimationProps;
  menuRef: React.RefObject<HTMLDivElement | null>;
  menuTitle: string;
}) => (
  <motion.div
    className="mt-8 flex flex-col items-center"
    {...menuAnimationProps}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    ref={menuRef}
  >
    <div className="max-w-md w-full min-w-96 z-10">
      <SectionTitle title={menuTitle} className="text-white" />
      <section className="space-y-4">
        {menuOptions.map((option, index) => (
          <MenuItem
            key={index}
            title={option.title}
            icon={option.icon}
            onClick={() => handleMenuOptionClick(option.action)}
            index={index}
            interactive={true}
          />
        ))}
      </section>
    </div>
  </motion.div>
);