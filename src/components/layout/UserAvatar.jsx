import Avatar from "@mui/material/Avatar";
import { deepPurple, deepOrange } from "@mui/material/colors";

export default function UserAvatar({ username }) {
  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[1][0]).toUpperCase();
  };

  const colors = [deepPurple[500], deepOrange[500]];
  const color = colors[username?.charCodeAt(0) % colors.length];

  return <Avatar sx={{ bgcolor: color }}>{getInitials(username)}</Avatar>;
}
