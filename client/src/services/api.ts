import { Restaurant, User } from "../types";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";
type RequestFormat = keyof Omit<Body, "body" | "bodyUsed">;
type QueryParamsType = Record<string | number, any>;

export enum ContentType {
  Json = "application/json",
  Text = "text/plain",
  FormData = "multipart/form-data",
  // UrlEncoded = "application/x-www-form-urlencoded",
}
interface HttpInitParams
  extends Omit<RequestInit, "body" | "method" | "headers"> {
  baseUrl: string;
  headers: {
    "content-type": ContentType;
    Authorization?: string;
  };
  format: RequestFormat;
  authHeader: string;
}
interface RequestParams extends Partial<HttpInitParams> {
  path: string;
  method: RequestMethod;
  body?: unknown;
  secure?: boolean;
  query?: QueryParamsType;
}
interface HttpResonse<D, E> {
  data: D;
  error: E;
}
interface ErrorStatusCode {
  statusCode: number;
}
// modify this to fit with error response from your API server
interface ErrorModel extends ErrorStatusCode {
  status: string;
  message: string;
}

class HttpClient {
  private baseUrl = "";
  private format: RequestFormat = "json";
  private _authHeader = "";
  protected get authHeader() {
    return this._authHeader;
  }
  private set authHeader(value: string) {
    this._authHeader = value;
  }
  private baseRequestParams: Omit<
    HttpInitParams,
    "baseUrl" | "format" | "authHeader"
  > = {
    headers: {
      "content-type": ContentType.Json,
    },
  };

  constructor(config: HttpInitParams) {
    Object.assign(this, config);
  }

  protected request = async <D, E = ErrorModel>(
    params: RequestParams
  ): Promise<HttpResonse<D, E>> => {
    const fallbackDataResponse = null as unknown as D;
    const fallbackErrorResponse = null as unknown as E;

    const { path, method, query, body = null, secure = false } = params;

    let queryString = this.toQueryString(query);
    if (queryString) queryString = "?" + queryString;

    const fullRequestUrl = this.baseUrl + path + queryString;
    let fullRequestParams = {
      ...this.baseRequestParams,
      ...{ method },
      ...(!!body && { body: this.bodyConverter(body) }),
    };

    if (secure) {
      const authorization = localStorage.getItem(this.authHeader);
      if (!authorization)
        return {
          data: fallbackDataResponse,
          error: {
            status: "authorization error",
            message: "Not found authentication value in Local Storage!",
          } as E,
        };

      if (this.authHeader === "Authorization")
        fullRequestParams.headers["Authorization"] = authorization;
    }

    const res = await fetch(fullRequestUrl, fullRequestParams);
    const jsonRes = await res[this.format]();

    if (!res.ok) {
      // if (res.status === 401) localStorage.removeItem(this.authHeader);
      return {
        data: fallbackDataResponse,
        error: { ...jsonRes, ...{ statusCode: res.status } } as E,
      };
    }
    return {
      data: jsonRes as D,
      error: fallbackErrorResponse,
    };
  };

  // Functions convert params to query string
  private encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(
      typeof value === "number" ? value : `${value}`
    )}`;
  }
  private addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }
  private addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }
  private toQueryString(query: QueryParamsType = {}): string {
    const getQueryItem = (key: string) => {
      if (Array.isArray(query[key])) return this.addArrayQueryParam(query, key);
      return this.addQueryParam(query, key);
    };

    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key]
    );
    return keys.map((key) => getQueryItem(key)).join("&");
  }
  // -------------------------------------------------

  private bodyConverter(input: any) {
    return JSON.stringify(input);
  }
}

interface LoginInfo extends Pick<User, "phone"> {
  password: string;
}
interface AuthErrorResponse extends ErrorStatusCode {
  errors: {
    email?: string[];
    username?: string[];
    password?: string[];
    "email or password"?: string[];
  };
}
export class Api extends HttpClient {
  auth = {
    login: (phone: string, password: string) => {
      const user: LoginInfo = {
        phone,
        password,
      };
      return this.request<{ user: User }, AuthErrorResponse>({
        path: "/auth/login",
        method: "POST",
        body: { user },
      });
    },
    getToken: () => localStorage.getItem(this.authHeader) || null,
    setToken: (token: string) => {
      try {
        if (token) localStorage.setItem(this.authHeader, "Bearer " + token);
      } catch (e) {
        console.error("Cannot set token!");
        console.error(e);
      }
    },
    removeToken: () => {
      try {
        localStorage.removeItem(this.authHeader);
      } catch (e) {
        console.error("Cannot remove token!");
        console.error(e);
      }
    },
  };
  user = {
    getInfo: () =>
      this.request<User>({
        path: "/user/me",
        method: "GET",
        secure: true,
      }),
  };
  restaurant = {
    getAll: (query?: { page?: number; limit?: number }) =>
      this.request<Restaurant>({
        path: "/restaurants",
        method: "GET",
        query,
      }),
  };
}
