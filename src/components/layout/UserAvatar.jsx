import Avatar from "@mui/material/Avatar";
import { deepPurple, deepOrange } from "@mui/material/colors";
import { getMediaUrl } from "../../utils/imageUtils";

export default function UserAvatar({ username, headshot, has_headshot, size = 40, availability_status }) {
  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[1][0]).toUpperCase();
  };

  const colors = [deepPurple[500], deepOrange[500]];
  const color = colors[username?.charCodeAt(0) % colors.length];

  const shouldShowHeadshot = has_headshot !== undefined ? has_headshot : Boolean(headshot);
  const headshotUrl = shouldShowHeadshot && headshot ? getMediaUrl(headshot) : null;

  const getAvailabilityDotColor = (status) => {
    if (!status) return null;
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'on-leave':
        return 'bg-yellow-500';
      case 'in-emergency':
        return 'bg-red-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const dotSize = Math.max(8, Math.min(12, Math.round(size * 0.5)));

  return (
    <div className="relative inline-block">
      <Avatar 
        src={headshotUrl} 
        alt={username}
        sx={{ width: size, height: size, bgcolor: color }}
      >
        {getInitials(username)}
      </Avatar>
      {/* Availability Status Dot */}
      {availability_status && (
        <div
          className={`
            absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-gray-800
            ${getAvailabilityDotColor(availability_status)}
          `}
          style={{
            width: `${dotSize}px`,
            height: `${dotSize}px`,
          }}
        />
      )}
    </div>
  );
}
