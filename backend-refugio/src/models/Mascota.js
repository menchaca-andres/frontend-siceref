const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Mascota = sequelize.define('Mascota', {
  nombre: { type: DataTypes.STRING, allowNull: false },
  especie: { type: DataTypes.STRING },
  edad: { type: DataTypes.INTEGER }, // Podrías usar un ComboBox en el front para esto
  tamano: { type: DataTypes.STRING },
  estado_salud: { type: DataTypes.TEXT },
  adoptado: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = Mascota;
