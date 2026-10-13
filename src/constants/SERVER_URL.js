const useProxy = import.meta.env.DEV;


export const SERVER_URL = useProxy ? "/asset-api/" : "https://rv10n5m4-8003.inc1.devtunnels.ms/";

export const AUTH_SERVER_URL = useProxy ? "/auth-api/" : "https://rv10n5m4-8004.inc1.devtunnels.ms/";
