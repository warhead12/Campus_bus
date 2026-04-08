/**
 * Safe message for axios / fetch failures (avoids alert("undefined")).
 */
export function getRequestErrorMessage(
  error,
  fallback = 'Request failed. Is the backend running at http://localhost:4000?'
) {
  const msg = error?.response?.data?.message;
  if (typeof msg === 'string' && msg.trim()) return msg;
  if (typeof error?.message === 'string' && error.message.trim()) return error.message;
  return fallback;
}
