export function parseAlertMonitorIds(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is string =>
        typeof item === 'string' && item.trim().length > 0,
    );
  } catch {
    return [];
  }
}

export function validAlertName(name: string) {
  const trimmed = name.trim();
  return trimmed.length > 0 && trimmed.length <= 255;
}

export function validAlertThresholds(
  failures: number,
  recoveries: number,
  intervalSeconds: number,
) {
  return (
    Number.isInteger(failures) &&
    failures >= 1 &&
    failures <= 20 &&
    Number.isInteger(recoveries) &&
    recoveries >= 1 &&
    recoveries <= 20 &&
    Number.isInteger(intervalSeconds) &&
    intervalSeconds >= 15 &&
    intervalSeconds <= 3600
  );
}
