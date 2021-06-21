export const __prod__ = process.env.NODE_ENV === "production";

export const __milliseconds__ = {
  MILLISECOND: 1,
  SECOND: 1000,
  MINUTE: 60000,
  HOUR: 3600000,
  DAY: 86400000,
  WEEK: 604800000,
  MONTH: 2419200000,
  YEAR: 29030400000,
  NEVER: 9007199254740991,
} as const;
