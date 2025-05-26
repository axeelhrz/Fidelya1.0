"use client";

import { useTheme } from "@/components/theme-provider";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { Button } from "@mui/material";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      onClick={toggleTheme}
      sx={{
        minWidth: "auto",
        p: 1,
        borderRadius: "50%",
        color: "text.primary",
        position: "relative",
        overflow: "hidden",
      }}
      component={motion.button}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === "light" ? 0 : 180,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 10,
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {theme === "light" ? (
          <IconMoon size={20} stroke={1.5} />
        ) : (
          <IconSun size={20} stroke={1.5} />
        )}
      </motion.div>
      
      <motion.div
        initial={false}
        animate={{
          scale: theme === "light" ? 0 : 10,
          opacity: theme === "light" ? 0 : 0.2,
        }}
        transition={{
          duration: 0.5,
        }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 4,
          height: 4,
          borderRadius: "50%",
          backgroundColor: "#5D5FEF",
          transform: "translate(-50%, -50%)",
        }}
      />
    </Button>
  );
}