const { Tweet, User, Like, Reply } = require('../models')
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime'); 
dayjs.extend(relativeTime)
const helpers = require('../_helpers')
const adminServices = {
  getTweets: (req, cb) => {
    const UserId = helpers.getUser(req).id
    return Promise.all([
      Like.findAll({where: { userId: UserId}}),
      Reply.findAll({where: { userId: UserId}}),
      Tweet.findAll({raw: true,include: [User]})
    ])
    .then(([likes, replies, tweets]) => {
      for(let i = 0; i < tweets.length; i++) {
        const createdAtDate = dayjs(tweets[i].createdAt);
        const updatedAtDate = dayjs(tweets[i].updatedAt);
        tweets[i].createdAt = createdAtDate.fromNow()
        tweets[i].updatedAt = updatedAtDate.fromNow()
        tweets[i]["likeCount"] = likes.length
        tweets[i]["replyCount"] = replies.length
      }
      cb(null, tweets);
    })
    .catch(err => cb(err));
},
  postTweet: (req, cb) => {
    const { UserId, description} = req.body
    if (!UserId) throw new Error('UserId is required!')
    const { file } = req
      Tweet.create({ UserId, description })
        .then(newTweet => cb(null, { tweet: newTweet }))
        .catch(err => cb(err))
  },
  deleteTweet: (req, cb) => {
    Tweet.findByPk(req.params.id)
      .then(tweet => {
        if (!tweet) {
          const err = new Error("Tweet didn't exist!")
          err.status = 404
          throw err
        }
        return tweet.destroy()
      })
      .then(deletedTweet => cb(null, { Tweet: deletedTweet }))
      .catch(err => cb(err))
  },
  getUsers: (req, cb) => {
    User.findAll({
      raw: true,
      include: [Like]
    })
      .then(users => {
        cb(null, users )
      })
      .catch(err => cb(err))
  },
}
module.exports = adminServices