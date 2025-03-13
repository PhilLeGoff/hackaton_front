
export default formatTimestamp;
import { formatDistanceToNow } from "date-fns"; 
import { fr } from "date-fns/locale"; // ✅ Import French locale

const formatTimestamp = (timestamp) => {
  if (!timestamp) return ""; // Gérer les timestamps manquants
  const date = new Date(timestamp);

  return formatDistanceToNow(date, { addSuffix: true, locale: fr }); // Ex: "il y a 2 heures"
};

export default formatTimestamp;
