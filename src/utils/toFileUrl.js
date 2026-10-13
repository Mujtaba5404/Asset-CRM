import { SERVER_URL } from "../constants/SERVER_URL";

/**
 * Absolute URL for a file the API stored.
 *
 * Accepts a bare path or an attachment object with `filePath`. The server
 * runs on Windows, so paths come back as `public\uploads\x.png`; backslashes
 * are turned into URL separators.
 */
const toFileUrl = (file) => {
  const path = typeof file === "string" ? file : file?.filePath;
  if (!path) return "";

  return `${SERVER_URL}${path.replace(/\\/g, "/").replace(/^\/+/, "")}`;
};

/** File name from a stored path ("public\uploads\x.png" → "x.png"). */
export const toFileName = (file) => (typeof file === "string" ? file : file?.originalName || file?.filePath)?.split(/[\\/]/).pop() || "File";

export default toFileUrl;
