const { Client } = require('pg');
const c = new Client({ host: 'localhost', port: 5432, database: 'postgres', user: 'postgres', password: 'Abc123..' });

const modulos = [
  { nombre: 'Dashboard', ruta: '/inventory/dashboard', icono: '📊', orden: 1, seccion: null, descripcion: 'Panel principal del inventario' },
  { nombre: 'Ingresos', ruta: '/inventory/ingreso', icono: '📥', orden: 2, seccion: 'Ingresos', descripcion: 'Registro de ingresos al inventario' },
  { nombre: 'Movimientos', ruta: '/inventory/ingreso/movimientos', icono: '📈', orden: 3, seccion: 'Ingresos', descripcion: 'Movimientos de inventario' },
  { nombre: 'Salidas', ruta: '/inventory/salida', icono: '📤', orden: 4, seccion: 'Salidas', descripcion: 'Registro de salidas del inventario' },
  { nombre: 'Solicitudes', ruta: '/inventory/solicitudes', icono: '📋', orden: 5, seccion: 'Solicitudes', descripcion: 'Solicitudes de inventario' },
  { nombre: 'Reporte Movimientos', ruta: '/inventory/reportes/movimientos', icono: '📊', orden: 6, seccion: 'Reportes', descripcion: 'Reporte de movimientos' },
  { nombre: 'Reporte Ingresos', ruta: '/inventory/reportes/ingresos', icono: '📥', orden: 7, seccion: 'Reportes', descripcion: 'Reporte de ingresos' },
  { nombre: 'Reporte Salidas', ruta: '/inventory/reportes/salidas', icono: '📤', orden: 8, seccion: 'Reportes', descripcion: 'Reporte de salidas' }
];

async function run() {
  await c.connect();
  await c.query('ALTER TABLE modulo_tr ADD COLUMN IF NOT EXISTS seccion VARCHAR(255)');
  for (const m of modulos) {
    await c.query(
      `INSERT INTO modulo_tr (nombre, ruta, icono, orden, seccion, activo, descripcion)
       VALUES ($1, $2, $3, $4, $5, true, $6)
       ON CONFLICT (nombre) DO UPDATE SET ruta = EXCLUDED.ruta, icono = EXCLUDED.icono, orden = EXCLUDED.orden, seccion = EXCLUDED.seccion, descripcion = EXCLUDED.descripcion`,
      [m.nombre, m.ruta, m.icono, m.orden, m.seccion, m.descripcion]
    );
  }
  const { rows } = await c.query('SELECT id, nombre, ruta, orden, seccion, activo FROM modulo_tr ORDER BY orden, id');
  console.table(rows);
  await c.end();
}

run().catch(e => { console.error(e.message); process.exit(1); });
