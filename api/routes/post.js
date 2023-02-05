const { Router } = require('express')
const { saveImageToDisk } = require('../middleware/uploads.js')
const router = Router()
const Post = require('../models/Post')
const { jwtValidate } = require('../middleware/jwt.js')

router.get('/', async (req, res) => {
  try {
    // const posts = await Post.find().populate('author', ['username']).sort({ createdAt: -1 })
   
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: 'users', // collection name in db
          localField: 'author', // field in the Post collection
          foreignField: '_id', // field in the User collection
          as: 'author', // alias for User object to be populated
        },
      },
      {
        $unwind: '$author',
      },
      {
        $project: {
          _id: 1,
          title: 1,
          summary: 1,
          content: 1,
          cover: 1,
          createdAt: 1,
          updatedAt: 1,
          author: '$author.username',
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ])

    res.status(200).json(posts)
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const post = await Post.findById(id).populate('author', ['username'])
    res.status(200).json(post)
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
})

router.post('/', jwtValidate, async (req, res) => {
  try {
    const { userId } = req.tokenDt
    const { title, summary, image, content } = req.body
    const photo = await saveImageToDisk(image)

    // console.log(req.headers)
    const post = new Post({
      title: title,
      summary: summary,
      cover: photo,
      content: content,
      author: userId,
    })
    const data = await post.save()
    console.log(data)
    res.status(201).json({
      message: 'เพิ่มข้อมูลเรียบร้อย',
      post: data,
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
})

module.exports = router
