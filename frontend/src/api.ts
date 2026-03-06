import type { Alert, AlertFilters, CalibrationConfig, ReadingResult } from './types';

const BASE = ''; // Vite proxy redirige peticiones al backend


async function getErrorMessage(res: Response, fallback: string): Promise<string> {
  const payload = await res.json().catch(() => null) as { message?: string | string[] } | null;
  const detail = Array.isArray(payload?.message)
    ? payload?.message.join(', ')
    : payload?.message;

  if (res.status === 503) {
    return detail ?? `${fallback}. Verifica la conexión/configuración de la base de datos.`;
  }

  return detail ?? `${fallback} (HTTP ${res.status})`;
}

/** Obtiene las alertas activas (resolved = false) */
export async function fetchActiveAlerts(): Promise<Alert[]> {
  const res = await fetch(`${BASE}/alerts/active`);
  if (!res.ok) throw new Error(await getErrorMessage(res, 'No se pudieron obtener las alertas activas'));
  return res.json() as Promise<Alert[]>;
}

/** Obtiene todas las alertas con filtros opcionales */
export async function fetchAlerts(filters: AlertFilters): Promise<Alert[]> {
  const params = new URLSearchParams();
  if (filters.tankId) params.set('tankId', filters.tankId);
  if (filters.alertType && filters.alertType !== 'all') params.set('alertType', filters.alertType);
  if (filters.resolved && filters.resolved !== 'all') params.set('resolved', filters.resolved);

  const qs = params.toString();
  const res = await fetch(`${BASE}/alerts${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error(await getErrorMessage(res, 'No se pudieron obtener las alertas'));
  return res.json() as Promise<Alert[]>;
}

/** Evalúa una lectura de sensor y retorna las alertas generadas */
export async function evaluateReading(body: Record<string, number>): Promise<Alert[]> {
  const res = await fetch(`${BASE}/alerts/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await getErrorMessage(res, 'No se pudo evaluar la lectura'));
  return res.json() as Promise<Alert[]>;
}

/** Marca una alerta como resuelta */
export async function resolveAlert(id: number): Promise<Alert> {
  const res = await fetch(`${BASE}/alerts/${id}/resolve`, { method: 'PATCH' });
  if (!res.ok) throw new Error(await getErrorMessage(res, 'No se pudo resolver la alerta'));
  return res.json() as Promise<Alert>;
}

export async function fetchCalibration(): Promise<CalibrationConfig> {
  const res = await fetch(`${BASE}/calibration`);
  if (!res.ok) throw new Error(await getErrorMessage(res, 'No se pudo obtener la calibración'));
  return res.json() as Promise<CalibrationConfig>;
}

export async function updateCalibration(body: Partial<CalibrationConfig>): Promise<CalibrationConfig> {
  const res = await fetch(`${BASE}/calibration`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await getErrorMessage(res, 'No se pudo actualizar la calibración'));
  return res.json() as Promise<CalibrationConfig>;
}

export async function createReading(rawCm: number): Promise<ReadingResult> {
  const res = await fetch(`${BASE}/readings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rawCm }),
  });

  if (!res.ok) throw new Error(await getErrorMessage(res, 'No se pudo procesar la lectura'));

  return res.json() as Promise<ReadingResult>;
}
