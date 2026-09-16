const { DataTypes, Sequelize, Model } = require('sequelize');

const CHAT_MESSAGE_TR_TABLE = 'chat_message_tr';

const ChatMessageTrSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  userId: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'user_id',
    references: {
      model: 'user_tr',
      key: 'id'
    }
  },
  pregunta: {
    allowNull: false,
    type: DataTypes.TEXT
  },
  respuesta: {
    allowNull: false,
    type: DataTypes.TEXT
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW
  }
};

class ChatMessageTr extends Model {
  static associate(models) {
    this.belongsTo(models.UserTr, { foreignKey: 'userId', as: 'user' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CHAT_MESSAGE_TR_TABLE,
      modelName: 'ChatMessageTr',
      timestamps: false
    };
  }
}

module.exports = { CHAT_MESSAGE_TR_TABLE, ChatMessageTrSchema, ChatMessageTr };
