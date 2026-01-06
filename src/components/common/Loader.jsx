import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Loader = ({ fullScreen = true, size = 40 }) => {
  const containerClass = fullScreen
    ? "min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center"
    : "flex items-center justify-center p-4";

  return (
    <div className={containerClass}>
      <Box sx={{ display: "flex" }}>
        <CircularProgress size={size} />
      </Box>
    </div>
  );
};

export default Loader;


