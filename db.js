const Sequelize = require('sequelize');
const databaseURI = 'postgres://localhost:5432/autherLecture';

const db = new Sequelize(databaseURI, {
    logging: false
  });

const User = db.define('user', {
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  googleId: Sequelize.STRING,
});

User.sync();

module.exports = {
  db,
  User
};
