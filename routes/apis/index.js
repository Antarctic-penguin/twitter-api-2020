const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const admin = require('./modules/admin')
const tweetController = require('../../controllers/apis/tweet-controller')
const userController = require('../../controllers/apis/user-controller')
const { authenticated, authenticatedAdmin } = require('../../middleware/api-auth')
const { apiErrorHandler } = require('../../middleware/error-handler')

router.use('/admin', authenticated, authenticatedAdmin, admin)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn) 
router.post('/tweets/:id/like', authenticated, tweetController.addLike)
router.post('/tweets/:id/unlike', authenticated, tweetController.removeLike)
router.get('/tweets/:id', authenticated, tweetController.getTweet)
router.get('/tweets', tweetController.getTweets)
router.post('/tweets',authenticated ,tweetController.postTweet)


router.use('/', apiErrorHandler)

module.exports = router




