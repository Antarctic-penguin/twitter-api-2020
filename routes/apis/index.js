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
router.get('/tweets/:id', authenticated, tweetController.getTweet)
router.get('/tweets', tweetController.getTweets)
router.post('/tweets',authenticated ,tweetController.postTweet)
router.post('/like/:tweetId', authenticated, userController.addLike)
router.delete('/like/:tweetId', authenticated, userController.removeLike)

router.use('/', apiErrorHandler)

module.exports = router




