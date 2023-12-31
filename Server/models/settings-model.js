import { DataTypes } from "sequelize";

import { db } from "../database/connectdb.js";

const Settings = db.define("settings", {
  // Model attributes are defined here
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  max_warning: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30,
  },
  max_accepted: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 20,
  },
});

Settings.afterValidate("unique", async (doc) => {
  // Verificar si el campo userId existe en el documento validado
  if (doc && doc.dataValues.userId) {
    // Buscar si ya existe algún registro con el mismo userId
    const existingSetting = await Settings.findOne({
      where: {
        userId: doc.dataValues.userId,
      },
    });
    // Si ya existe un registro con el mismo userId, generar un error de
    // validación
    if (existingSetting) {
      throw new Error("unique");
      // Puedes personalizar el mensaje de error según tus necesidades
    }
  }
});

export default Settings;
