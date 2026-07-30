/**
 * Helpers para interpretar el valor de una respuesta, que puede venir como
 * string (texto o URL de un archivo subido), número, arreglo (opciones) u
 * objeto ({ url }) según cómo se haya guardado.
 */

const IMAGE_EXTENSIONS = /\.(png|jpe?g|gif|webp|bmp|svg|avif)(\?.*)?$/i;

/** Extrae una URL de archivo del valor de la respuesta, si la hay. */
export const extractFileUrl = (value: any): string | null => {
  if (!value) return null;
  if (typeof value === "string") {
    return /^https?:\/\//i.test(value) || value.startsWith("/") ? value : null;
  }
  if (typeof value === "object") {
    const url = value.url || value.fileUrl || value.link || value.secure_url;
    return typeof url === "string" ? url : null;
  }
  return null;
};

/** Indica si una URL apunta a una imagen (por extensión o host de imágenes). */
export const isImageUrl = (url?: string | null): boolean => {
  if (!url) return false;
  if (IMAGE_EXTENSIONS.test(url)) return true;
  return /(res\.cloudinary\.com|\/image\/upload\/)/i.test(url);
};

/** Texto legible para una respuesta que no es un archivo. */
export const formatTextAnswer = (value: any): string => {
  if (value === undefined || value === null || value === "") {
    return "Sin responder";
  }
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") {
    const url = extractFileUrl(value);
    return url ?? JSON.stringify(value);
  }
  return String(value);
};
