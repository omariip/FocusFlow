import "dotenv/config";

export default ({ config }) => ({
  ...config,
  extra: {
    apiKey: process.env.API_KEY,
  },
});
