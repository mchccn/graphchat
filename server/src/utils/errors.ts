export const queryError = (status: number, message: string) => ({
  status,
  message,
});

export const wrapErrors = (
  ...errors: { status: number; message: string }[]
) => ({ errors });
