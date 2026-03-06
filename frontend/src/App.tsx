import { useState, useEffect, useCallback } from 'react';
import type { Alert, AlertFilters, EvaluateForm, CalibrationConfig, ReadingResult } from './types';
import {
  fetchAlerts,
  fetchActiveAlerts,
  evaluateReading,
  resolveAlert,
  fetchCalibration,
  updateCalibration,
  createReading,
} from './api';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ALERT_TYPES = ['all', 'NIVEL_BAJO', 'NIVEL_CRITICO', 'NIVEL_ALTO', 'LLENO', 'POSIBLE_FUGA', 'NORMAL'];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('es-CO', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ─── AlertBadge ───────────────────────────────────────────────────────────────
function AlertBadge({ type }: { type: string }) {
  return (
    <span className={`badge badge-${type}`}>
      {type.replace('_', ' ')}
    </span>
  );
}

// ─── AlertTable ───────────────────────────────────────────────────────────────
interface AlertTableProps {
  alerts: Alert[];
  loading: boolean;
  onResolve: (id: number) => void;
  resolvingId: number | null;
}

function AlertTable({ alerts, loading, onResolve, resolvingId }: AlertTableProps) {
  if (loading) {
    return <p style={{ color: 'var(--muted)', padding: '24px 0', textAlign: 'center' }}>Cargando alertas…</p>;
  }
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tanque</th>
            <th>Tipo</th>
            <th>Nivel (L)</th>
            <th>%</th>
            <th>Umbral (L)</th>
            <th>Mensaje</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {alerts.length === 0 ? (
            <tr className="empty-row">
              <td colSpan={10}>No hay alertas para mostrar.</td>
            </tr>
          ) : (
            alerts.map((a) => (
              <tr key={a.id}>
                <td>#{a.id}</td>
                <td>
                  <strong>{a.tank?.name ?? `Tanque ${a.tankId}`}</strong>
                  <br />
                  <span style={{ color: 'var(--muted)', fontSize: 11 }}>ID: {a.tankId}</span>
                </td>
                <td><AlertBadge type={a.alertType} /></td>
                <td>{a.currentLevel.toFixed(1)}</td>
                <td>{a.percentage.toFixed(1)}%</td>
                <td>{a.threshold}</td>
                <td style={{ maxWidth: 220, fontSize: 12 }}>{a.message}</td>
                <td style={{ whiteSpace: 'nowrap', fontSize: 12 }}>{formatDate(a.createdAt)}</td>
                <td>
                  {a.resolved ? (
                    <span style={{ color: 'var(--success)', fontSize: 12, fontWeight: 600 }}>Resuelta</span>
                  ) : (
                    <span style={{ color: 'var(--danger)', fontSize: 12, fontWeight: 600 }}>Activa</span>
                  )}
                </td>
                <td>
                  {!a.resolved && (
                    <button
                      className="btn btn-success"
                      onClick={() => onResolve(a.id)}
                      disabled={resolvingId === a.id}
                    >
                      {resolvingId === a.id ? <span className="spinner" /> : 'Resolver'}
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ─── EvaluatePanel ────────────────────────────────────────────────────────────
interface EvaluatePanelProps {
  onNewAlerts: () => void;
}

const EMPTY_FORM: EvaluateForm = {
  tankId: '1',
  levelLiters: '',
  percentage: '',
  temperatureC: '',
  previousLevelLiters: '',
  minutesSinceLastReading: '',
};

function EvaluatePanel({ onNewAlerts }: EvaluatePanelProps) {
  const [form, setForm] = useState<EvaluateForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Alert[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResults(null);
    setLoading(true);
    try {
      const body: Record<string, number> = {
        tankId:      Number(form.tankId),
        levelLiters: Number(form.levelLiters),
        percentage:  Number(form.percentage),
      };
      if (form.temperatureC)          body.temperatureC          = Number(form.temperatureC);
      if (form.previousLevelLiters)   body.previousLevelLiters   = Number(form.previousLevelLiters);
      if (form.minutesSinceLastReading) body.minutesSinceLastReading = Number(form.minutesSinceLastReading);

      const events = await evaluateReading(body);
      setResults(events);
      onNewAlerts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <div className="card-title">Evaluar lectura de sensor</div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>ID del Tanque *</label>
          <input name="tankId" type="number" min="1" value={form.tankId} onChange={handleChange} required />
          <small>Tanques de demo: 1 (Norte) y 2 (Sur)</small>
        </div>
        <div className="form-row">
          <label>Nivel actual (litros) *</label>
          <input name="levelLiters" type="number" min="0" step="0.1"
            placeholder="Ej: 80" value={form.levelLiters} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <label>Porcentaje de llenado (%) *</label>
          <input name="percentage" type="number" min="0" max="100" step="0.1"
            placeholder="Ej: 8" value={form.percentage} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <label>Temperatura (°C)</label>
          <input name="temperatureC" type="number" step="0.1"
            placeholder="Ej: 22.5" value={form.temperatureC} onChange={handleChange} />
        </div>

        <p className="form-section-title">Detección de fugas (opcional)</p>
        <div className="form-row">
          <label>Nivel anterior (litros)</label>
          <input name="previousLevelLiters" type="number" min="0" step="0.1"
            placeholder="Ej: 120" value={form.previousLevelLiters} onChange={handleChange} />
        </div>
        <div className="form-row">
          <label>Minutos desde la lectura anterior</label>
          <input name="minutesSinceLastReading" type="number" min="0" step="0.5"
            placeholder="Ej: 5" value={form.minutesSinceLastReading} onChange={handleChange} />
        </div>

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? <><span className="spinner" /> Evaluando…</> : 'Evaluar'}
        </button>
      </form>

      {error && <div className="alert-msg error">{error}</div>}

      {results && (
        <div style={{ marginTop: 12 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 6 }}>
            Resultado ({results.length} evento{results.length !== 1 ? 's' : ''}):
          </p>
          <div className="result-list">
            {results.map((r, i) => (
              <div key={i} className={`result-item ${r.alertType}`}>
                <strong>{r.alertType}</strong>
                {r.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



function CalibrationPanel() {
  const [config, setConfig] = useState<CalibrationConfig>({
    sensorOffsetCm: 0,
    scaleFactor: 1,
    minValidCm: 0,
    maxValidCm: 300,
  });
  const [rawCm, setRawCm] = useState('100');
  const [reading, setReading] = useState<ReadingResult | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadCalibration = useCallback(async () => {
    setError(null);
    try {
      const data = await fetchCalibration();
      setConfig(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar la calibración');
    }
  }, []);

  useEffect(() => {
    void loadCalibration();
  }, [loadCalibration]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: Number(value) }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const saved = await updateCalibration({
        sensorOffsetCm: Number(config.sensorOffsetCm),
        scaleFactor: Number(config.scaleFactor),
        minValidCm: Number(config.minValidCm),
        maxValidCm: Number(config.maxValidCm),
      });
      setConfig(saved);
      setMessage('Configuración guardada');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la calibración');
    }
  }

  async function handleReading() {
    setError(null);
    setMessage(null);
    setReading(null);
    try {
      const res = await createReading(Number(rawCm));
      setReading(res);
      setMessage('Lectura procesada correctamente');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo procesar la lectura');
    }
  }

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <div className="card-title">Calibración y lectura</div>

      <form className="form" onSubmit={handleSave}>
        <div className="form-row">
          <label>Offset sensor (cm)</label>
          <input name="sensorOffsetCm" type="number" step="0.1" value={config.sensorOffsetCm} onChange={handleChange} />
        </div>
        <div className="form-row">
          <label>Factor de escala</label>
          <input name="scaleFactor" type="number" step="0.01" value={config.scaleFactor} onChange={handleChange} />
        </div>
        <div className="form-row">
          <label>Mínimo válido (cm)</label>
          <input name="minValidCm" type="number" step="0.1" value={config.minValidCm} onChange={handleChange} />
        </div>
        <div className="form-row">
          <label>Máximo válido (cm)</label>
          <input name="maxValidCm" type="number" step="0.1" value={config.maxValidCm} onChange={handleChange} />
        </div>
        <button className="btn btn-primary" type="submit">Guardar calibración</button>
      </form>

      <div className="form-section-title">Prueba de lectura cruda</div>
      <div className="filters" style={{ marginTop: 10 }}>
        <input type="number" step="0.1" value={rawCm} onChange={(e) => setRawCm(e.target.value)} placeholder="raw cm" />
        <button className="btn btn-primary" onClick={() => void handleReading()}>Procesar lectura</button>
      </div>

      {message && <div className="alert-msg success">{message}</div>}
      {error && <div className="alert-msg error">{error}</div>}

      {reading && (
        <div className="result-list">
          <div className="result-item NORMAL">
            <strong>Lectura calibrada</strong>
            raw: {reading.rawCm} cm · calibrada: {reading.calibratedCm.toFixed(2)} cm
          </div>
        </div>
      )}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]               = useState<'active' | 'all'>('active');
  const [alerts, setAlerts]         = useState<Alert[]>([]);
  const [loading, setLoading]       = useState(true);
  const [resolvingId, setResolvingId] = useState<number | null>(null);
  const [filters, setFilters]       = useState<AlertFilters>({ tankId: '', alertType: 'all', resolved: 'all' });

  const loadAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const data = tab === 'active'
        ? await fetchActiveAlerts()
        : await fetchAlerts(filters);
      setAlerts(data);
    } catch {
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, [tab, filters]);

  useEffect(() => { void loadAlerts(); }, [loadAlerts]);

  async function handleResolve(id: number) {
    setResolvingId(id);
    try {
      await resolveAlert(id);
      await loadAlerts();
    } finally {
      setResolvingId(null);
    }
  }

  function handleFilterChange(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  const activeCount = alerts.filter((a) => !a.resolved).length;

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <div>
          <h1>Lecturas y Alertas de Tanques</h1>
          <div className="subtitle">Patrón Observer – Grupo 6 · Diseño de Software</div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="main">
        {/* ── Panel izquierdo: tabla de alertas ── */}
        <section className="alerts-section">
          <div className="card">
            <div className="card-title">
              Panel de alertas
              {activeCount > 0 && <span className="count-badge">{activeCount}</span>}
              <button
                onClick={() => void loadAlerts()}
                style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
              >
                Actualizar
              </button>
            </div>

            {/* Tabs */}
            <div className="tabs">
              <button className={`tab ${tab === 'active' ? 'active' : ''}`} onClick={() => setTab('active')}>
                Activas {activeCount > 0 && `(${activeCount})`}
              </button>
              <button className={`tab ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>
                Todas
              </button>
            </div>

            {/* Filtros (solo en tab "Todas") */}
            {tab === 'all' && (
              <div className="filters">
                <input
                  name="tankId"
                  type="number"
                  placeholder="Tanque ID"
                  value={filters.tankId}
                  onChange={handleFilterChange}
                  style={{ width: 110 }}
                />
                <select name="alertType" value={filters.alertType} onChange={handleFilterChange}>
                  {ALERT_TYPES.map((t) => (
                    <option key={t} value={t}>{t === 'all' ? 'Todos los tipos' : t.replace('_', ' ')}</option>
                  ))}
                </select>
                <select name="resolved" value={filters.resolved} onChange={handleFilterChange}>
                  <option value="all">Activas y resueltas</option>
                  <option value="false">Solo activas</option>
                  <option value="true">Solo resueltas</option>
                </select>
                <button className="btn btn-primary" onClick={() => void loadAlerts()}>
                  Filtrar
                </button>
              </div>
            )}

            <AlertTable
              alerts={alerts}
              loading={loading}
              onResolve={(id) => void handleResolve(id)}
              resolvingId={resolvingId}
            />
          </div>
        </section>

        {/* ── Sidebar: formulario de evaluación ── */}
        <aside className="sidebar">
          <EvaluatePanel onNewAlerts={() => void loadAlerts()} />

          {/* Mini-guía de umbrales */}
          <CalibrationPanel />

          <div className="card" style={{ marginTop: 16 }}>
            <div className="card-title">Umbrales de demo</div>
            <table style={{ fontSize: 12, width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', paddingBottom: 6, color: 'var(--muted)' }}>Tanque</th>
                  <th style={{ textAlign: 'right', color: 'var(--muted)' }}>Cap.</th>
                  <th style={{ textAlign: 'right', color: 'var(--muted)' }}>Crit.</th>
                  <th style={{ textAlign: 'right', color: 'var(--muted)' }}>Min.</th>
                  <th style={{ textAlign: 'right', color: 'var(--muted)' }}>Max.</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Norte (ID 1)</td>
                  <td style={{ textAlign: 'right' }}>1000L</td>
                  <td style={{ textAlign: 'right', color: 'var(--c-critico)' }}>50L</td>
                  <td style={{ textAlign: 'right', color: 'var(--c-bajo)' }}>100L</td>
                  <td style={{ textAlign: 'right', color: 'var(--c-alto)' }}>900L</td>
                </tr>
                <tr>
                  <td>Sur (ID 2)</td>
                  <td style={{ textAlign: 'right' }}>500L</td>
                  <td style={{ textAlign: 'right', color: 'var(--c-critico)' }}>25L</td>
                  <td style={{ textAlign: 'right', color: 'var(--c-bajo)' }}>50L</td>
                  <td style={{ textAlign: 'right', color: 'var(--c-alto)' }}>450L</td>
                </tr>
              </tbody>
            </table>
          </div>
        </aside>
      </main>
    </div>
  );
}
