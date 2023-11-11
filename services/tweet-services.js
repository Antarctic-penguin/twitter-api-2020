const { Tweet, Like } = require('../models')
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime'); 
dayjs.extend(relativeTime);
const helpers = require('../_helpers')
const tweetServices = {
  getTweets: (req, cb) => {
    Tweet.findAll({
      raw: true,
    })
      .then(tweets => {
        for(let i = 0; i < tweets.length; i++) {
          const createdAtDate = dayjs(tweets[i].createdAt);
          const updatedAtDate = dayjs(tweets[i].updatedAt);
          tweets[i].createdAt = createdAtDate.fromNow()
          tweets[i].updatedAt = updatedAtDate.fromNow()
        }
        cb(null, tweets);
      })
      .catch(err => cb(err));
  },
  getTweet: (req, cb) => {
    return Tweet.findByPk(req.params.id)
    .then(tweet => {
      if (!tweet) {
        throw new Error("Tweet didn't exist!");
    }
    tweet = tweet.toJSON();
    tweet.createdAt = dayjs(tweet.createdAt).fromNow();
    tweet.updatedAt = dayjs(tweet.updatedAt).fromNow();
    return cb(null, tweet);
    })
    .catch(err => cb(err))
  },
  postTweet: (req, cb) => {
    const UserId = helpers.getUser(req).id
    const { description } = req.body
    if (!UserId) res.status(500).json({
      status: 'error',
      data: {
        'Error Message': 'userId is required'
      }
    })
    const { file } = req
      Tweet.create({ UserId, description })
        .then(newTweet => cb(null,  {tweet: newTweet} ))
        .catch(err => cb(err))
  },
  addLike: (req, cb) => {
    const tweetId = req.params.id
    return Promise.all([
      Tweet.findByPk(tweetId),
      Like.findOne({
        where: {
          UserId: req.user.id,
          TweetId: tweetId
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error("tweet didn't exist!")
        if (like) throw new Error('You have favorited this tweet!')
        return Like.create({
          UserId: req.user.id,
          TweetId: tweet.id
        })
      })
      .then(addLike => cb(null,  {tweet: addLike} ))
      .catch(err => cb(err))
  },
  removeLike: (req, cb) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        TweetId: req.params.id
      }
    })
      .then(like => {
        if (!like) throw new Error("You haven't favorited this tweet")

        return like.destroy()
      })
      .then(removeLike => cb(null,  {tweet: removeLike} ))
      .catch(err => cb(err))
  }
}
module.exports = tweetServices