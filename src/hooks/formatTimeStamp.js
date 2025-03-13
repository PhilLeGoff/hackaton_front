import { format, formatDistanceToNow } from "date-fns"; // Import date formatting functions

const formatTimestamp = (timestamp) => {
  if (!timestamp) return ""; // Handle missing timestamps
  const date = new Date(timestamp);
  
  return formatDistanceToNow(date, { addSuffix: true }); // Example: "2 hours ago"
};

export default formatTimestamp;