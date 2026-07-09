export function reportLovableError(error: unknown, _context?: Record<string, unknown>) {
  if (import.meta.env.DEV) {
    console.error(error);
  }
}
