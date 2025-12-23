import React, { useContext } from "react";
import { IconButton, Tooltip } from "@mui/material";
import DarkModeSharpIcon from "@mui/icons-material/DarkModeSharp";
import { ColorModeContext } from "../../context/ColorModeContext";
import { useTheme } from "@mui/material/styles";

export default function ThemeToggle() {
  const theme = useTheme();
  const { toggleColorMode } = useContext(ColorModeContext);

  return (
    <div className="theme-toggle">
      <Tooltip
        title={`Switch to ${
          theme.palette.mode === "light" ? "dark" : "light"
        } mode`}
      >
        <IconButton
          className="theme-toggle__button"
          onClick={toggleColorMode}
          color="primary"
        >
          <DarkModeSharpIcon className="theme-toggle__icon" />
        </IconButton>
      </Tooltip>
    </div>
  );
}
