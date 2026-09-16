const ExcelJS = require('exceljs');
const boom = require('@hapi/boom');
const sequelize = require('../libs/sequelize');
const CorrelativoTrService = require('./correlativo.service');
const IngresoDetalleTrService = require('./ingreso-detalle.service');

class IngresoExcelService {
  constructor() {
    this.correlativoService = new CorrelativoTrService();
    this.detalleService = new IngresoDetalleTrService();
  }

  async generateTemplate(companyId) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'TechSolutions';
    workbook.created = new Date();

    // ── Hoja 1: Encabezado del Ingreso ──
    const headerSheet = workbook.addWorksheet('Encabezado', {
      properties: { tabColor: { argb: '2563EB' } }
    });

    headerSheet.columns = [
      { header: 'NUMERO_FACTURA', key: 'numeroFactura', width: 20 },
      { header: 'FECHA_INGRESO (YYYY-MM-DD)', key: 'fechaIngreso', width: 25 },
      { header: 'CANTIDAD_TARIMAS', key: 'cantidadTarimas', width: 20 },
      { header: 'PROVEEDOR', key: 'proveedor', width: 25 },
      { header: 'OBSERVACIONES', key: 'observaciones', width: 35 }
    ];

    const headerRow = headerSheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFF' }, size: 11 };
    headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '2563EB' } };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    headerRow.height = 28;

    // Ejemplo de datos
    headerSheet.addRow({
      numeroFactura: 'FAC-00123',
      fechaIngreso: '2026-09-15',
      cantidadTarimas: 5,
      proveedor: 'Proveedor Ejemplo',
      observaciones: 'Observaciones del ingreso'
    });

    // Instrucciones
    const instrucSheet = workbook.addWorksheet('Instrucciones', {
      properties: { tabColor: { argb: 'F59E0B' } }
    });

    instrucSheet.columns = [
      { header: 'INSTRUCCIONES PARA LLENAR EL ARCHIVO', key: 'instruccion', width: 80 }
    ];

    const instrucHeader = instrucSheet.getRow(1);
    instrucHeader.font = { bold: true, size: 14, color: { argb: '1E293B' } };
    instrucHeader.height = 30;

    const instructions = [
      '1. Complete los datos del encabezado en la hoja "Encabezado" (una sola fila).',
      '2. Complete las líneas del ingreso en la hoja "Lineas" (una fila por cada artículo).',
      '3. El campo CORRELATIVO se genera automáticamente, no lo modifique.',
      '4. FECHA_INGRESO y FECHA_DIGITACION deben tener formato YYYY-MM-DD.',
      '5. CANTIDAD_TARIMAS debe ser un número entero positivo.',
      '6. En la hoja "Lineas": LOTE, ARTICULO, TARIMA, CAJA, UNIDAD, SOLICITADO, ENTREGADO, MERMAS, DEVOLUCION y COSTO individual son obligatorios.',
      '7. TOTAL_INGRESO = CAJA + UNIDAD (se calcula automáticamente si deja el campo vacío).',
      '8. Guardar el archivo y subirlo desde el sistema en Inventario > Ingresos > Subir Excel.',
      '',
      'NOTA: El correlativo se asigna automáticamente al subir el archivo.'
    ];

    instructions.forEach((text, i) => {
      const row = instrucSheet.addRow({ instruccion: text });
      row.font = { size: 11, color: { argb: '475569' } };
      row.height = 22;
    });

    // ── Hoja 2: Líneas del Ingreso ──
    const linesSheet = workbook.addWorksheet('Lineas', {
      properties: { tabColor: { argb: '10B981' } }
    });

    linesSheet.columns = [
      { header: 'LOTE', key: 'lote', width: 18 },
      { header: 'ARTICULO', key: 'articulo', width: 30 },
      { header: 'TARIMA', key: 'tarima', width: 10 },
      { header: 'CAJA', key: 'caja', width: 10 },
      { header: 'UNIDAD', key: 'unidad', width: 10 },
      { header: 'TOTAL_INGRESO', key: 'totalIngreso', width: 15 },
      { header: 'SOLICITADO', key: 'solicitado', width: 14 },
      { header: 'ENTREGADO', key: 'entregado', width: 14 },
      { header: 'MERMAS', key: 'mermas', width: 10 },
      { header: 'DEVOLUCION', key: 'devolucion', width: 12 },
      { header: 'COSTO_INDIVIDUAL', key: 'costoIndividual', width: 18 }
    ];

    const linesRow = linesSheet.getRow(1);
    linesRow.font = { bold: true, color: { argb: 'FFFFFF' }, size: 11 };
    linesRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '10B981' } };
    linesRow.alignment = { horizontal: 'center', vertical: 'middle' };
    linesRow.height = 28;

    // Ejemplo de líneas
    const exampleLines = [
      { lote: 'LOTE-001', articulo: 'Producto A', tarima: 2, caja: 10, unidad: 5, totalIngreso: 15, solicitado: 20, entregado: 15, mermas: 0, devolucion: 0, costoIndividual: 12.50 },
      { lote: 'LOTE-002', articulo: 'Producto B', tarima: 3, caja: 20, unidad: 0, totalIngreso: 20, solicitado: 25, entregado: 20, mermas: 1, devolucion: 0, costoIndividual: 8.75 }
    ];

    exampleLines.forEach(line => linesSheet.addRow(line));

    return workbook;
  }

  async parseAndCreate(fileBuffer, companyId, userId) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer);

    // ── Parsear Encabezado ──
    const headerSheet = workbook.getWorksheet('Encabezado');
    if (!headerSheet) {
      throw boom.badRequest('No se encontró la hoja "Encabezado" en el archivo Excel.');
    }

    const headerRow = headerSheet.getRow(2);
    if (!headerRow || headerRow.values.length < 5) {
      throw boom.badRequest('La hoja "Encabezado" está vacía o tiene formato incorrecto.');
    }

    const numeroFactura = String(headerRow.getCell(1).value || '').trim();
    const fechaIngresoRaw = headerRow.getCell(2).value;
    const cantidadTarimas = parseInt(headerRow.getCell(3).value) || 0;
    const proveedor = String(headerRow.getCell(4).value || '').trim();
    const observaciones = String(headerRow.getCell(5).value || '').trim();

    if (!numeroFactura) {
      throw boom.badRequest('El campo NUMERO_FACTURA es obligatorio.');
    }
    if (!fechaIngresoRaw) {
      throw boom.badRequest('El campo FECHA_INGRESO es obligatorio.');
    }
    if (cantidadTarimas <= 0) {
      throw boom.badRequest('CANTIDAD_TARIMAS debe ser mayor a 0.');
    }

    let fechaIngreso;
    if (fechaIngresoRaw instanceof Date) {
      fechaIngreso = fechaIngresoRaw;
    } else {
      fechaIngreso = new Date(String(fechaIngresoRaw));
      if (isNaN(fechaIngreso.getTime())) {
        throw boom.badRequest('El formato de FECHA_INGRESO no es válido. Use YYYY-MM-DD.');
      }
    }

    // Generar correlativo
    const correlativo = await this.correlativoService.generateCorrelativo(companyId, 'ing');

    // Crear ingreso
    const ingreso = await sequelize.models.IngresoTr.create({
      correlativo,
      numeroFactura,
      fechaIngreso,
      fechaDigitacion: new Date(),
      cantidadTarimas,
      usuarioDigito: 'Excel Import',
      proveedor: proveedor || null,
      observaciones: observaciones || null,
      companyId: companyId || null,
      userId: userId || null,
      status: 'pendiente'
    });

    // ── Parsear Líneas ──
    const linesSheet = workbook.getWorksheet('Lineas');
    if (!linesSheet) {
      return {
        ingreso: ingreso.dataValues,
        detalles: [],
        message: 'Ingreso creado sin líneas (no se encontró la hoja "Lineas").'
      };
    }

    const detalles = [];
    const errors = [];

    linesSheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Saltar encabezado

      const lote = String(row.getCell(1).value || '').trim();
      const articulo = String(row.getCell(2).value || '').trim();
      const tarima = parseInt(row.getCell(3).value) || 0;
      const caja = parseInt(row.getCell(4).value) || 0;
      const unidad = parseInt(row.getCell(5).value) || 0;
      let totalIngreso = parseInt(row.getCell(6).value) || 0;
      const solicitado = parseInt(row.getCell(7).value) || 0;
      const entregado = parseInt(row.getCell(8).value) || 0;
      const mermas = parseInt(row.getCell(9).value) || 0;
      const devolucion = parseInt(row.getCell(10).value) || 0;
      const costoIndividual = parseFloat(row.getCell(11).value) || 0;

      // Auto-calcular totalIngreso si está vacío
      if (totalIngreso === 0 && (caja > 0 || unidad > 0)) {
        totalIngreso = caja + unidad;
      }

      if (!lote || !articulo) {
        errors.push(`Fila ${rowNumber}: LOTE y ARTICULO son obligatorios.`);
        return;
      }
      if (tarima <= 0) {
        errors.push(`Fila ${rowNumber}: TARIMA debe ser mayor a 0.`);
        return;
      }

      detalles.push({
        lote,
        articulo,
        tarima,
        caja,
        unidad,
        totalIngreso,
        solicitado,
        entregado,
        mermas,
        devolucion,
        costoIndividual,
        companyId: companyId || null,
        userId: userId || null
      });
    });

    if (errors.length > 0) {
      // Si hay errores, eliminar el ingreso creado
      await ingreso.destroy();
      throw boom.badRequest(`Errores en el archivo:\n${errors.join('\n')}`);
    }

    // Crear detalles uno por uno (respeta validación de tarimas)
    const createdDetalles = [];
    for (const detalle of detalles) {
      try {
        const created = await this.detalleService.create({
          ...detalle,
          ingreso_id: ingreso.id
        });
        createdDetalles.push(created);
      } catch (err) {
        errors.push(`Error creando línea "${detalle.lote}": ${err.message}`);
      }
    }

    return {
      ingreso: await sequelize.models.IngresoTr.findByPk(ingreso.id, { raw: true }),
      detalles: createdDetalles,
      errores: errors.length > 0 ? errors : undefined,
      message: `Ingreso ${correlativo} creado con ${createdDetalles.length} línea(s).${errors.length > 0 ? ` (${errors.length} errores)` : ''}`
    };
  }
}

module.exports = IngresoExcelService;
