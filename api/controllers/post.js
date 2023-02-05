const Post = require('../models/Post')
const { saveImageToDisk } = require('../utils/uploads.js')

exports.PostList = async req => {
  try {
    // const posts = await Post.find().populate('author', ['username']).sort({ createdAt: -1 })

    return await Post.aggregate([
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
  } catch (error) {
    throw new Error(error.message)
  }
}

exports.getPost = async req => {
  try {
    const { id } = req.params
    return await Post.findById(id).populate('author', ['username'])
  } catch (error) {
    throw new Error(error.message)
  }
}

exports.createPost = async req => {
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
      
    return await post.save()
  } catch (error) {
    throw new Error(error.message)
  }
}

exports.editPost = async req => {
  try {
    const { id } = req.params
    return await Post.findByIdAndUpdate(id, { ...req.body }, { new: true })
  } catch (error) {
    throw new Error(error.message)
  }
}

exports.deletePost = async req => {
  try {
    const { id } = req.params
    return await Post.findByIdAndDelete(id)
  } catch (error) {
    throw new Error(error.message)
  }
}
