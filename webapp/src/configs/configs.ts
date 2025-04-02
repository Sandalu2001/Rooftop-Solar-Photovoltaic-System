export const CognitoConfig = {
  region: process.env.REACT_APP_REGION ?? "",
  userPoolId: process.env.REACT_APP_API_USER_POOL_ID ?? "",
  clientId: process.env.REACT_APP_CLIENT_ID ?? "",
};

export const ServiceBaseUrl = process.env.REACT_APP_SERVICE_URL ?? "";

export const AppConfig = {
  serviceUrls: {
    getProducts: ServiceBaseUrl + "/products",
    getInventoryProducts: ServiceBaseUrl + "/products/inventory",
    addProduct: ServiceBaseUrl + "/products",
    makeOrder: ServiceBaseUrl + "/orders",
    getAnnotation: ServiceBaseUrl + "/convert",
    getPairs: ServiceBaseUrl + "/centroid",
  },
};
