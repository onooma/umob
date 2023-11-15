export interface GBFSProviderResponse {
  data: {
    nl: {
      feeds: {
        name: string;
        url: string;
      }[];
    };
  };
}
