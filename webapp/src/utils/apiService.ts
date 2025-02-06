import { fetchAuthSession, JWT } from "aws-amplify/auth";
import axios, { AxiosInstance, CancelTokenSource } from "axios";
import axiosRetry from "axios-retry";

export class APIService {
  private static _instance: AxiosInstance;
  private static _accessToken: JWT;
  private static _cancelTokenSource = axios.CancelToken.source();

  constructor() {
    fetchAuthSession()
      .then((resp) => {
        APIService._accessToken = resp!.tokens!.accessToken;
      })
      .catch((error) => {
        console.log(error);
      });

    APIService._instance = axios.create();
    axiosRetry(APIService._instance, {
      retries: 3,
      retryCondition(error) {
        switch (error.response?.status) {
          case 404:
          case 429:
          case 401:
            return true;
          default:
            return false;
        }
      },
      onRetry() {
        APIService.updateTokens();
        APIService._instance!.interceptors.request.clear();
        APIService.updateRequestInterceptor();
      },
    });

    APIService.updateRequestInterceptor();
  }

  public static getInstance(): AxiosInstance {
    return APIService._instance;
  }

  public static getCancelToken() {
    return APIService._cancelTokenSource;
  }

  public static updateCancelToken(): CancelTokenSource {
    APIService._cancelTokenSource = axios.CancelToken.source();
    return APIService._cancelTokenSource;
  }

  private static updateTokens() {
    fetchAuthSession()
      .then((resp) => {
        APIService._accessToken = resp!.tokens!.accessToken;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  private static updateRequestInterceptor() {
    if (APIService._instance) {
      APIService._instance.interceptors.request.use(
        (config) => {
          config.headers.set(
            "Authorization",
            "Bearer " + APIService._accessToken
          );
          return config;
        },
        (error) => {
          Promise.reject(error);
        }
      );
    }
  }
}
