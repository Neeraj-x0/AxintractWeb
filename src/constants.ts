const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
// FETCH TOKEN FROM LOCAL STORAGE WHERE NAME = AUTHTOKEN
let JWT_TOKEN = localStorage.getItem("AUTHTOKEN")

// IF TOKEN IS NULL THEN SET IT TO Neerajs token
if (JWT_TOKEN === null) JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IktyaXNobmFuZWVyYWo3NzNAZ21haWwuY29tIiwiaWQiOiI2N2FmNGMzMjFjYmU5MmEyMDk0NjQzYjYiLCJuYW1lIjoiTmVlcmFqIiwiY29tcGFueU5hbWUiOiJDb21wYW55IE5hbWUiLCJjb21wYW55TG9nbyI6Imh0dHBzOi8vcmVzLmNsb3VkaW5hcnkuY29tL2R5ZmhicXRqbS9pbWFnZS91cGxvYWQvZl9hdXRvLHFfYXV0by9zZzF1ZmRzejh3dzltY2Npa3ljNSIsImlhdCI6MTczOTU0MTU1NCwiZXhwIjoxNzQyMTMzNTU0fQ.IP9B0agX7fGFAHfL5FGSUUU76hrkdN7HkFsEkQ_Qlyo";



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

