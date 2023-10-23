import { Api, ContentType } from "./api";

const baseUrl = "/__api";

export const api = new Api({
  baseUrl,
  headers: {
    "content-type": ContentType.Json,
  },
  format: "json",
  authHeader: "Authorization",
});
