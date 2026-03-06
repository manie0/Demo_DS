import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const styles = {
  page: {
    minHeight: "100vh",
    width: "100vw",
    margin: 0,
    padding: 0,
    background:
      "radial-gradient(1200px 700px at 20% 15%, rgba(120, 60, 255, .35), transparent 60%)," +
      "radial-gradient(1100px 650px at 80% 20%, rgba(0, 220, 255, .28), transparent 60%)," +
      "radial-gradient(900px 500px at 50% 90%, rgba(0, 255, 140, .18), transparent 65%)," +
      "#070A10",
    color: "#F3F6FF",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
  },
  container: {
    maxWidth: 1300,
    margin: "0 auto",
    padding: "28px 22px 34px",
    boxSizing: "border-box",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 18,
  },
  titleWrap: { display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" },
  title: {
    fontSize: 44,
    lineHeight: 1.05,
    margin: 0,
    letterSpacing: -0.8,
  },
  subtitle: {
    margin: 0,
    color: "rgba(243,246,255,.74)",
    fontSize: 14,
  },
  badge: {
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,.14)",
    background: "rgba(255,255,255,.06)",
    color: "rgba(243,246,255,.85)",
    fontSize: 12,
    backdropFilter: "blur(10px)",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 18,
    width: "100%",
  },
  card: {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,.12)",
    background: "rgba(255,255,255,.06)",
    backdropFilter: "blur(12px)",
    boxShadow:
      "0 18px 60px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.08)",
    overflow: "hidden",
  },
  cardHeader: {
    padding: "16px 18px",
    borderBottom: "1px solid rgba(255,255,255,.10)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  cardTitle: {
    margin: 0,
    fontSize: 18,
    letterSpacing: -0.2,
  },
  pill: {
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(0,0,0,.35)",
    border: "1px solid rgba(255,255,255,.14)",
    color: "rgba(243,246,255,.78)",
    fontSize: 12,
  },
  cardBody: {
    padding: 18,
  },
  label: {
    fontSize: 12,
    color: "rgba(243,246,255,.72)",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,.14)",
    background: "rgba(10,14,26,.55)",
    color: "#F3F6FF",
    outline: "none",
    boxSizing: "border-box",
  },
  field: { marginBottom: 14 },
  row: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
  btnPrimary: {
    padding: "11px 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,.16)",
    background:
      "linear-gradient(135deg, rgba(120,60,255,.95), rgba(0,220,255,.70))",
    color: "#070A10",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 12px 30px rgba(70,120,255,.22)",
  },
  btnGhost: {
    padding: "11px 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,.16)",
    background: "rgba(255,255,255,.06)",
    color: "#F3F6FF",
    fontWeight: 700,
    cursor: "pointer",
  },
  divider: {
    height: 1,
    background: "rgba(255,255,255,.10)",
    margin: "14px 0",
  },
  pre: {
    margin: 0,
    padding: 14,
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,.12)",
    background: "rgba(0,0,0,.35)",
    color: "rgba(243,246,255,.92)",
    overflow: "auto",
    fontSize: 12,
    lineHeight: 1.35,
  },
  hint: {
    marginTop: 12,
    color: "rgba(243,246,255,.55)",
    fontSize: 12,
  },
  smallNote: {
    color: "rgba(243,246,255,.65)",
    fontSize: 12,
  },
  footer: {
    marginTop: 18,
    padding: "12px 14px",
    borderRadius: 16,
    border: "1px dashed rgba(255,255,255,.18)",
    background: "rgba(255,255,255,.05)",
    color: "rgba(243,246,255,.70)",
    fontSize: 12,
  },
};

function Campo({ etiqueta, ...props }) {
  return (
    <div style={styles.field}>
      <div style={styles.label}>{etiqueta}</div>
      <input {...props} style={styles.input} />
    </div>
  );
}

export default function App() {
  const [calib, setCalib] = useState({
    sensorOffsetCm: 0,
    scaleFactor: 1,
    minValidCm: 0,
    maxValidCm: 300,
  });

  const [rawCm, setRawCm] = useState(100);
  const [respuestaCalib, setRespuestaCalib] = useState({});
  const [respuestaLectura, setRespuestaLectura] = useState({});
  const [cargando, setCargando] = useState(false);

  const cargarCalibracion = async () => {
    try {
      setCargando(true);
      const res = await fetch(`${BASE_URL}/calibration`);
      if (!res.ok) throw new Error(`GET /calibration -> ${res.status}`);
      const data = await res.json();

      setCalib({
        sensorOffsetCm: data.sensorOffsetCm ?? 0,
        scaleFactor: data.scaleFactor ?? 1,
        minValidCm: data.minValidCm ?? 0,
        maxValidCm: data.maxValidCm ?? 300,
      });

      setRespuestaCalib(data);
    } catch (e) {
      setRespuestaCalib({ error: String(e.message || e) });
    } finally {
      setCargando(false);
    }
  };

  const guardarCalibracion = async () => {
    try {
      setCargando(true);
      const body = {
        sensorOffsetCm: Number(calib.sensorOffsetCm),
        scaleFactor: Number(calib.scaleFactor),
        minValidCm: Number(calib.minValidCm),
        maxValidCm: Number(calib.maxValidCm),
      };

      const res = await fetch(`${BASE_URL}/calibration`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `PUT /calibration -> ${res.status}`);

      setRespuestaCalib(data);
    } catch (e) {
      setRespuestaCalib({ error: String(e.message || e) });
    } finally {
      setCargando(false);
    }
  };

  const enviarLectura = async () => {
    try {
      setCargando(true);
      const res = await fetch(`${BASE_URL}/readings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawCm: Number(rawCm) }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `POST /readings -> ${res.status}`);

      setRespuestaLectura(data);
    } catch (e) {
      setRespuestaLectura({ error: String(e.message || e) });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCalibracion();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topBar}>
          <div>
            <div style={styles.titleWrap}>
              <h1 style={styles.title}>Tanques de Agua</h1>
              <span style={styles.badge}>Grupo 6 • Singleton</span>
            </div>
            <p style={styles.subtitle}>
              Panel de calibración global y simulación de lecturas.
            </p>
          </div>

          <button style={styles.btnGhost} onClick={cargarCalibracion} disabled={cargando}>
            {cargando ? "Cargando..." : "Recargar"}
          </button>
        </div>

        <div style={styles.layout}>
          {/* Calibración */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Calibración (Singleton)</h2>
              <span style={styles.pill}>PUT /calibration • GET /calibration</span>
            </div>

            <div style={styles.cardBody}>
              <Campo
                etiqueta="Desplazamiento del sensor (cm) — sensorOffsetCm"
                type="number"
                step="0.01"
                value={calib.sensorOffsetCm}
                onChange={(e) =>
                  setCalib((c) => ({ ...c, sensorOffsetCm: e.target.value }))
                }
              />
              <Campo
                etiqueta="Factor de escala — scaleFactor"
                type="number"
                step="0.0001"
                value={calib.scaleFactor}
                onChange={(e) =>
                  setCalib((c) => ({ ...c, scaleFactor: e.target.value }))
                }
              />
              <Campo
                etiqueta="Mínimo válido (cm) — minValidCm"
                type="number"
                step="0.01"
                value={calib.minValidCm}
                onChange={(e) =>
                  setCalib((c) => ({ ...c, minValidCm: e.target.value }))
                }
              />
              <Campo
                etiqueta="Máximo válido (cm) — maxValidCm"
                type="number"
                step="0.01"
                value={calib.maxValidCm}
                onChange={(e) =>
                  setCalib((c) => ({ ...c, maxValidCm: e.target.value }))
                }
              />

              <div style={styles.row}>
                <button style={styles.btnPrimary} onClick={guardarCalibracion} disabled={cargando}>
                  {cargando ? "Procesando..." : "Guardar cambios"}
                </button>
                <button style={styles.btnGhost} onClick={cargarCalibracion} disabled={cargando}>
                  Restaurar
                </button>
              </div>

              <div style={styles.divider} />

              <div style={{ ...styles.row, justifyContent: "space-between" }}>
                <strong style={{ fontSize: 13 }}>Respuesta</strong>
                <span style={styles.smallNote}>
                  Se aplica a todas las lecturas (instancia única).
                </span>
              </div>

              <div style={{ height: 10 }} />
              <pre style={styles.pre}>{JSON.stringify(respuestaCalib, null, 2)}</pre>
            </div>
          </div>

          {/* Lecturas */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Lecturas</h2>
              <span style={styles.pill}>POST /readings</span>
            </div>

            <div style={styles.cardBody}>
              <Campo
                etiqueta="Lectura cruda (cm) — rawCm"
                type="number"
                step="0.01"
                value={rawCm}
                onChange={(e) => setRawCm(e.target.value)}
              />

              <div style={styles.row}>
                <button style={styles.btnPrimary} onClick={enviarLectura} disabled={cargando}>
                  {cargando ? "Enviando..." : "Enviar lectura"}
                </button>
              </div>

              <div style={styles.hint}>
                Fórmula: <b>calibratedCm = rawCm × scaleFactor + sensorOffsetCm</b>
              </div>

              <div style={styles.divider} />

              <strong style={{ fontSize: 13 }}>Respuesta</strong>
              <div style={{ height: 10 }} />
              <pre style={styles.pre}>{JSON.stringify(respuestaLectura, null, 2)}</pre>

              <div style={styles.footer}>
                Consejo: ajusta <b>sensorOffsetCm</b> (desfase) o <b>scaleFactor</b> (proporción),
                guarda, y luego envía lecturas para ver el cambio inmediatamente.
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 980px) {
            .grid-two {
              grid-template-columns: 1fr !important;
            }
          }
          button:disabled {
            opacity: .7;
            cursor: not-allowed;
          }
          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type=number] {
            -moz-appearance: textfield;
          }
        `}</style>
      </div>
    </div>
  );
}