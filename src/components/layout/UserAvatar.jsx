import Avatar from "@mui/material/Avatar";
import { deepPurple, deepOrange } from "@mui/material/colors";
import { getMediaUrl } from "../../utils/imageUtils";

export default function UserAvatar({ username, headshot, has_headshot, size = 40 }) {
  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[1][0]).toUpperCase();
  };

  const colors = [deepPurple[500], deepOrange[500]];
  const color = colors[username?.charCodeAt(0) % colors.length];

  // Use has_headshot flag from backend if available, otherwise fallback to checking headshot
  const shouldShowHeadshot = has_headshot !== undefined ? has_headshot : Boolean(headshot);
  const headshotUrl = shouldShowHeadshot && headshot ? getMediaUrl(headshot) : null;

  return (
    <Avatar 
      src={headshotUrl} 
      alt={username}
      sx={{ width: size, height: size, bgcolor: color }}
    >
      {getInitials(username)}
    </Avatar>
  );
}
