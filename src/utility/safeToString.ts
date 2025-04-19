export const safeToString = (value: number | null | undefined): string | null =>
    value !== null && value !== undefined ? value.toString() : null;