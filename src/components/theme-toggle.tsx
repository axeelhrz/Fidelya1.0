"use client";

import { useTheme } from "@/components/theme-provider";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { Button } from "@mui/material";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      sx={{
        minWidth: "auto",
        p: 1,
        borderRadius: "50%",
        color: "text.primary",
      }}
      component={motion.button}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {theme === "light" ? (
        <IconMoon size={20} stroke={1.5} />
      ) : (
        <IconSun size={20} stroke={1.5} />
      )}
    </Button>
  );
}