export function successResponse<T>(data: T, message?: string) {
  return {
    success: true,
    data,
    ...(message && { message }),
  };
}

export function errorResponse(error: string) {
  return {
    success: false,
    error,
  };
}
