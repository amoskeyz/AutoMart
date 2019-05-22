class userController {
  static welcome(req, res) {
    return res.status(200).json({
      message: 'Welcome to AutoMart',
    });
  }
}

export default userController;
