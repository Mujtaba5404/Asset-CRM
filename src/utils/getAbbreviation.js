/**
 * Initials for an avatar: first + last word, up to two characters.
 * "Dell Latitude Pro" -> "DP", "Laptop" -> "L".
 */
const getAbbreviation = (string = "") => {
  const words = String(string ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return "";

  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : "";

  return `${first}${last}`.toUpperCase();
};

export default getAbbreviation;
