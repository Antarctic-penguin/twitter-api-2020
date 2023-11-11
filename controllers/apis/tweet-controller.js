const tweetServices = require('../../services/tweet-services')
const tweetController = {
  getTweets: (req, res, next) => {
    tweetServices.getTweets(req, (err, data) => err ? next(err) : res.json(data))
  },
  getTweet: (req, res, next) => {
    tweetServices.getTweet(req, (err, data) => err ? next(err) : res.json(data))
  },
  postTweet: (req, res, next) => {
    tweetServices.postTweet(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  addLike: (req, res, next) => {
    tweetServices.addLike(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  removeLike: (req, res, next) => {
    tweetServices.removeLike(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
}
module.exports = tweetController