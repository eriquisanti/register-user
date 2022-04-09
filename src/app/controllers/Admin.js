const bcrypt = require("bcryptjs");
const { render } = require("express/lib/response");
const yup = require("yup");
const Admins = require("../models/Admin");

class Admin {
  async postAdmin(req, res) {
    let schema = yup.object().shape({
      name: yup.string().required(),
      login: yup.string().required(),
      password: yup.string().required(),
    });

    const schemaValidate = await schema.isValid(req.body);

    if (!schemaValidate) {
      return res.status(400).json({
        error: true,
        massage: "invalid data",
      });
    }

    let userExist = await Admins.findOne({ login: req.body.login });

    if (userExist) {
      return res.status(201).json({
        code: 201,
        error: true,
        massage: "User already exists",
      });
    }

    const data = req.body;

    data.password = await bcrypt.hash(data.password, 8);

    await Admins.create(data, (err) => {
      if (err) {
        return res.status(500).json({
          code:400,
          error: true,
          message: "error when entering user in mongoDB",
        });
      }

      return res.status(200).json({
        code: 200,
        error: false,
        massage: "user registered successfully",
      });
    });
  }

  async postLogin(req, res) {
    const login = req.body.login;
    const password = req.body.password;
    let loginExist = await Admins.findOne({ login: login });

    if (loginExist) {
      Admins.findOne({ login: login }, { __v: 0 })
        .then((result) => {
          bcrypt
            .compare(password, result.password)
            .then((result) => {
              if (result) {
                req.session.login = login;
                res.status(200).json({
                  login: login,
                  logged: result,
                  code: 200,
                  message: "successfully logged in"
                });
              } else {
                res.status(201).json({ 
                  logged: false, code: 402,  message: "Incorrect password"});
              }
            })
            .catch((err) => {
              res.status(500).json({ logged: false,code: 400, message: "Error request password" })
            });
        })
        .catch((err) => {
          res.status(500).json({ logged: false,code: 401, message: "Error request User" })
          
        });
    } else {
      res.status(201).json({logged: false, code: 403, message: "Incorrect login" })
    }
  }

  getLogin(req, res) {
    req.session.login ? res.render("painel") : res.render("login");
  }

  getPainel(req, res) {
    if (req.session.login) {
      res.render("painel");
    } else {
      res.render("login")
    }
  }

  logout(req, res) {
    if (req.body.exit) {
      req.session.login = null;
      req.session.destroy();
      res.status(200).send(true);
    }
  }

  getNameAdmin(req, res) {
    console.log(req.body.login)
    Admins.findOne({login: req.body.login}, {login:0, password: 0}).then(result => {
      res.status(200).send(result.name)
    }).catch(err=>{
        res.status(500).json({eroor: err})
    })
  }
}

module.exports = new Admin();
