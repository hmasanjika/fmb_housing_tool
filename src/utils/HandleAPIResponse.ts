export function HandleAPIResponse(APIres: any) {
  if (APIres.response) {
    if (APIres.response.data.includes("Error: Insert failed, duplicate id")) {
      return "duplicate";
    }
    console.log("Status:", APIres.response.status);
    console.log("Data:", APIres.response.data);
    console.log("headers:", APIres.response.headers);
    return "other";
  } else if (APIres.request) {
    console.log("no response received:", APIres.request);
    return "request";
  } else {
    console.log("Error:", APIres.message);
    return "message";
  }
}
