'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
  }, {});
  Tweet.associate = function(models) {
    Tweet.belongsTo(models.User , { foreignKey: 'UserId' })
    Tweet.hasMany(models.Like, { foreignKey: 'TweetId' })
    Tweet.hasMany(models.Reply, { foreignKey: 'TweetId' })
  };
  Tweet.init({
    UserId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Tweet',
    tableName: 'Tweets',
  })
  return Tweet;
};