const { DataTypes, Sequelize, Model } = require('sequelize');

const CHAT_KNOWLEDGE_TR_TABLE = 'chat_knowledge_tr';

const ChatKnowledgeTrSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  pregunta: {
    allowNull: false,
    type: DataTypes.STRING(300)
  },
  respuesta: {
    allowNull: false,
    type: DataTypes.TEXT
  },
  categoria: {
    allowNull: true,
    type: DataTypes.STRING(100)
  },
  palabrasClave: {
    allowNull: true,
    type: DataTypes.JSON,
    field: 'palabras_clave',
    defaultValue: []
  },
  activo: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    allowNull: true,
    type: DataTypes.DATE,
    field: 'updated_at',
    defaultValue: Sequelize.NOW
  }
};

class ChatKnowledgeTr extends Model {
  static associate(models) {}

  static config(sequelize) {
    return {
      sequelize,
      tableName: CHAT_KNOWLEDGE_TR_TABLE,
      modelName: 'ChatKnowledgeTr',
      timestamps: false
    };
  }
}

module.exports = { CHAT_KNOWLEDGE_TR_TABLE, ChatKnowledgeTrSchema, ChatKnowledgeTr };
