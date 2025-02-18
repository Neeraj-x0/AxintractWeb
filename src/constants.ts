"use client";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
// FETCH TOKEN FROM LOCAL STORAGE WHERE NAME = AUTHTOKEN

export { API_URL };



export const parseBody = (obj: object): unknown => {
  if (obj === null || obj === undefined) return undefined;
  if (typeof obj !== "object") return obj === "" ? undefined : obj;
  if (Array.isArray(obj)) {
    const cleanedArray = obj.map(parseBody).filter((item) => item !== undefined);
    return cleanedArray.length ? cleanedArray : undefined;
  }
  const cleanedObj: Record<string, unknown> = {};
  let hasValidProperties = false;
  for (const [key, value] of Object.entries(obj)) {
    const cleanedValue = parseBody(value);
    if (cleanedValue !== undefined) {
      cleanedObj[key] = cleanedValue;
      hasValidProperties = true;
    }
  }
  return hasValidProperties ? cleanedObj : undefined;
};

