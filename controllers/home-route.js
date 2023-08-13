// Import all packages and models
const router = require("express").Router();
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

// this route to render homepage

router.get("/", async (req, res) => {
  try {
        
    // this will find all posts with associated usernames
    
    const postData = await Post.findAll({
      include: [{ model: User, attributes: ["username"] }],
    });
   
    // this Convert post data  JavaScript object!!
    const posts = postData.map((post) => post.get({ plain: true }));
    
    // this render homepage template and login status
    res.render("homepage", {
      posts,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
        
    // If there is an error!!
    res.status(500).json(err);
  }
});

// this will Route to render individual post page

router.get("/post/:id", withAuth, async (req, res) => {
  try {
        
    
    // this will Find post by Id along will associated username and comments with associated usernames
    
    
        const postData = await Post.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ["username"] },
        {
          model: Comment,
          include: [{ model: User, attributes: ["username"] }],
        },
      ],
    });
    
    
    // this will Convert post data to JavaScript object!!
   
    const post = postData.get({ plain: true });
    
    
    // this will Render post template data and login status
    
    
    res.render("post", {
      ...post,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
        
    // If there is an error!
   
    res.status(500).json(err);
  }
});


//This will render dashboard page with post and find all post by user

router.get("/dashboard", withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      where: { user_id: req.session.user_id },
      include: [{ model: User, attributes: ["username"] }],
    });
    // Convert post data to plain JavaScript object
    const posts = postData.map((post) => post.get({ plain: true }));

    res.render("dashboard", {
      posts,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//This will render the login

router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }
  res.render("login");
});

//This will render the sigup

router.get("/signup", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }
  res.render("signup");
});


//this will render the new post page


router.get("/newpost", (req, res) => {
  if (req.session.logged_in) {
    res.render("newpost");
    return;
  }
  res.redirect("/login");
});


//this will render the edit post page


router.get("/editpost/:id", async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ["username"] },
        {
          model: Comment,
          include: [{ model: User, attributes: ["username"] }],
        },
      ],
    });

    const post = postData.get({ plain: true });

    res.render("editpost", {
      ...post,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// this will module exports router

module.exports = router;