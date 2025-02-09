const API_URL = "http://localhost:3001";
const JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IktyaXNobmFuZWVyYWo3NzNAZ21haWwuY29tIiwiaWQiOiI2N2E0ODU0YWM0MzQ3MjRiNmViOWQyYTMiLCJuYW1lIjoiTmVlcmFqIiwiY29tcGFueU5hbWUiOiJDb21wYW55IE5hbWUiLCJjb21wYW55TG9nbyI6Imh0dHBzOi8vcmVzLmNsb3VkaW5hcnkuY29tL2R5ZmhicXRqbS9pbWFnZS91cGxvYWQvZl9hdXRvLHFfYXV0by9zZzF1ZmRzejh3dzltY2Npa3ljNSIsImlhdCI6MTczODgzNTI3NCwiZXhwIjoxNzQxNDI3Mjc0fQ.jZRf_OV-85KO8atFtdHbTxnWgPg9sxC9clON6PebQ6A"
export { API_URL, JWT_TOKEN };

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