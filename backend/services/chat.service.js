const sequelize = require('../libs/sequelize');

class ChatService {
  constructor() {}

  async sendMessage(pregunta, userId) {
    const respuesta = await this.searchKnowledge(pregunta);

    await sequelize.models.ChatMessageTr.create({
      userId: userId || null,
      pregunta,
      respuesta
    });

    return { pregunta, respuesta };
  }

  async searchKnowledge(pregunta) {
    const normalizedQuestion = this.normalizeText(pregunta);
    const questionWords = normalizedQuestion.split(/\s+/).filter(w => w.length > 2);

    const entries = await sequelize.models.ChatKnowledgeTr.findAll({
      where: { activo: true },
      raw: true
    });

    if (!entries || entries.length === 0) {
      return 'No tengo respuestas disponibles en este momento. Por favor, contacta a soporte.';
    }

    let bestMatch = null;
    let bestScore = 0;

    for (const entry of entries) {
      const keywords = entry.palabrasClave || [];
      const normalizedKeywords = keywords.map(k => this.normalizeText(k));
      const entryText = this.normalizeText(entry.pregunta + ' ' + (entry.categoria || ''));
      const allText = normalizedQuestion + ' ' + entryText + ' ' + normalizedKeywords.join(' ');

      let score = 0;
      for (const word of questionWords) {
        if (normalizedKeywords.some(k => k.includes(word) || word.includes(k))) {
          score += 3;
        }
        if (entryText.includes(word)) {
          score += 2;
        }
        if (normalizedKeywords.some(k => k === word)) {
          score += 2;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    }

    const minScore = Math.max(3, Math.floor(questionWords.length * 0.4));

    if (bestMatch && bestScore >= minScore) {
      return bestMatch.respuesta;
    }

    return 'No encontré una respuesta exacta para tu pregunta. ¿Puedes reformularla o contactar a soporte técnico?';
  }

  normalizeText(text) {
    return (text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async getHistory(userId, limit = 20) {
    const messages = await sequelize.models.ChatMessageTr.findAll({
      where: userId ? { userId } : {},
      order: [['created_at', 'DESC']],
      limit,
      raw: true
    });
    return messages.reverse();
  }

  async getFaq() {
    const entries = await sequelize.models.ChatKnowledgeTr.findAll({
      where: { activo: true },
      order: [['categoria', 'ASC'], ['id', 'ASC']],
      raw: true
    });
    return entries;
  }

  async createKnowledge(data) {
    const entry = await sequelize.models.ChatKnowledgeTr.create(data);
    return entry;
  }

  async updateKnowledge(id, changes) {
    const entry = await sequelize.models.ChatKnowledgeTr.findByPk(id);
    if (!entry) return null;
    await entry.update(changes);
    return await sequelize.models.ChatKnowledgeTr.findByPk(id, { raw: true });
  }

  async deleteKnowledge(id) {
    const entry = await sequelize.models.ChatKnowledgeTr.findByPk(id);
    if (!entry) return null;
    await entry.destroy();
    return { id };
  }

  async seedKnowledge() {
    const count = await sequelize.models.ChatKnowledgeTr.count();
    if (count > 0) return { message: 'Base de conocimiento ya inicializada', count };

    const faqData = [
      {
        pregunta: '¿Cómo crear un usuario?',
        respuesta: 'Para crear un usuario ve a la sección "Usuarios" desde el menú lateral, haz clic en "Nuevo Usuario", completa los datos (nombre, correo, contraseña) y selecciona el rol. También puedes crear usuarios desde el Dashboard con el botón "Crear Usuario".',
        categoria: 'Usuarios',
        palabrasClave: ['crear', 'usuario', 'usuarios', 'nuevo', 'agregar', 'añadir', 'cuenta', 'registrar']
      },
      {
        pregunta: '¿Cómo registrar una empresa?',
        respuesta: 'Para registrar una empresa ve a "Empresas" > "Nueva Empresa". Completa los datos obligatorios: nombre, RIF y email. El sistema creará automáticamente los correlativos y configuración inicial. Solo los roles master y admin pueden crear empresas.',
        categoria: 'Empresas',
        palabrasClave: ['empresa', 'empresas', 'registrar', 'crear', 'nueva', 'rif', 'organizacion']
      },
      {
        pregunta: '¿Qué es el módulo de inventario?',
        respuesta: 'El módulo de inventario permite gestionar entradas y salidas de productos, controlar tarimas, artículos, lotes, y generar reportes. Incluye: dashboard de inventario, ingresos, salidas, solicitudes y reportes de movimientos.',
        categoria: 'Inventario',
        palabrasClave: ['inventario', 'productos', 'entradas', 'salidas', 'tarimas', 'articulos', 'lotes', 'stock', 'almacen']
      },
      {
        pregunta: '¿Cómo solicitar una anulación?',
        respuesta: 'Para solicitar una anulación ve a la lista de Ingresos, haz clic en "Anular" junto al ingreso que deseas anular. Ingresa el motivo de la anulación y se enviará una solicitud al master para su aprobación. Las anulaciones requieren autorización.',
        categoria: 'Inventario',
        palabrasClave: ['anulacion', 'anular', 'cancelar', 'eliminar', 'solicitud', 'borrar']
      },
      {
        pregunta: '¿Cómo cambiar mi contraseña?',
        respuesta: 'Para cambiar tu contraseña, contacta al administrador del sistema. El administrador puede generar una contraseña temporal desde la gestión de usuarios o usar la función "Restablecer contraseña" desde el panel de usuario.',
        categoria: 'Cuenta',
        palabrasClave: ['contraseña', 'password', 'cambiar', 'clave', 'restablecer', 'recuperar']
      },
      {
        pregunta: '¿Qué son los módulos?',
        respuesta: 'Los módulos son las secciones del sistema que se pueden asignar a cada usuario. Incluyen: Dashboard, Usuarios, Empresas, Módulos, Anulaciones e Inventario. El master controla qué módulos tiene activos cada usuario.',
        categoria: 'General',
        palabrasClave: ['modulos', 'modulos', 'secciones', 'permisos', 'accesos', 'asignar', 'activar']
      },
      {
        pregunta: '¿Cómo exportar reportes?',
        respuesta: 'Desde la sección de Reportes en Inventario puedes ver reportes de movimientos, ingresos y salidas. Selecciona el rango de fechas y los filtros deseados. El sistema muestra tablas con los datos que puedes copiar o exportar.',
        categoria: 'Reportes',
        palabrasClave: ['reportes', 'exportar', 'datos', 'excel', 'pdf', 'informes', 'estadisticas', 'graficas']
      },
      {
        pregunta: '¿Qué es TechSolutions?',
        respuesta: 'TechSolutions es una plataforma de gestión empresarial integral que ofrece administración de usuarios, control de inventario, gestión de empresas y reportes analíticos. Incluye un período de prueba gratuito de 14 días.',
        categoria: 'General',
        palabrasClave: ['techsolutions', 'plataforma', 'sistema', 'que es', 'informacion', 'acerca', 'descripcion']
      },
      {
        pregunta: '¿Cómo funciona el período de prueba?',
        respuesta: 'Al registrarte obtienes 14 días de prueba gratuita sin tarjeta de crédito. Durante este período tienes acceso completo a todas las funcionalidades. Al finalizar, contacta a ventas para activar tu suscripción.',
        categoria: 'General',
        palabrasClave: ['prueba', 'trial', 'demo', 'gratis', 'gratuito', 'dias', 'suscripcion', 'plan']
      },
      {
        pregunta: '¿Cómo ver los reportes de ingresos?',
        respuesta: 'Navega a Inventario > Reportes > Ingresos. Puedes filtrar por rango de fechas y proveedor. El reporte muestra correlativo, factura, fecha, tarimas y estado de cada ingreso.',
        categoria: 'Reportes',
        palabrasClave: ['reportes', 'ingresos', 'ver', 'consultar', 'filtro', 'fechas']
      }
    ];

    await sequelize.models.ChatKnowledgeTr.bulkCreate(faqData);
    return { message: 'Base de conocimiento inicializada', count: faqData.length };
  }
}

module.exports = ChatService;
