/**
 * Flatten a payload into multipart form data with bracket keys
 * (`warranty[startDate]`), the shape the API's multipart parser expects.
 * Arrays repeat the same key, so `images: [a, b]` becomes two `images` parts.
 * `null`/`undefined` are left out rather than sent as the strings "null"/"undefined".
 */
const toFormData = (payload, formData = new FormData(), prefix = "") => {
  Object.entries(payload).forEach(([key, value]) => {
    const name = prefix ? `${prefix}[${key}]` : key;

    if (value === null || value === undefined) return;

    if (Array.isArray(value)) value.forEach((item) => formData.append(name, item));
    else if (value instanceof Blob) formData.append(name, value);
    else if (value instanceof Date) formData.append(name, value.toISOString());
    else if (typeof value === "object") toFormData(value, formData, name);
    else formData.append(name, value);
  });

  return formData;
};

export default toFormData;
