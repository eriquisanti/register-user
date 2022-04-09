const bcrypt = require("bcryptjs");
const yup = require("yup");
const Users = require("../models/User");

class User {
  async postUser(req, res) {
    let schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().required(),
      cpf: yup.number().required(),
      sexo: yup.string(),
      birth_data: yup.date(),
      tel: yup.number().required(),
      address: yup
        .object({
          cep: yup.number().required(),
          city: yup.string().required(),
          state: yup.string().required(),
          street: yup.string().required(),
          district: yup.string().required(),
          number: yup.number().required(),
        })
        .required(),
      social: yup.object({
        facebook: yup.string(),
        instagram: yup.string(),
        twitter: yup.string(),
        linkedin: yup.string(),
        github: yup.string(),
      }),
    });

    const schemaValidate = await schema.isValid(req.body);

    if (!schemaValidate) {
      return res.status(400).json({
        code: 400,
        error: true,
        massage: "invalid data",
      });
    }

    let userExist = await Users.findOne({ email: req.body.email });

    if (userExist) {
      return res.status(201).json({
        code: 201,
        error: true,
        massage: "User already exists",
      });
    }

    const data = req.body;

    data.password = await bcrypt.hash(data.password, 8);

    await Users.create(data, (err) => {
      if (err) {
        return res.status(500).json({
          code: 500,
          error: true,
          message: "error when entering user in mongoDB",
        });
      }

      return res.status(200).json({
        email: data.email,
        code: 200,
        error: false,
        massage: "user registered successfully",
      });
    });
  }

  getUser(req, res) {
    const query = req.query;
    let validate = false;
    let validateId = false;
    let validatePagination = false;

    let page = req.query.page || '1'
    let limit =  req.query.limit || '10'

    let skip = limit * (page - 1);

    Object.keys(query).forEach(function (item) {
      if (
        item === "_id" ||
        item === "name" ||
        item === "email" ||
        item === "tel" ||
        item === "sexo" ||
        item === "date" ||
        item === "city" ||
        item === "state" ||
        item === "page" ||
        item === "limit" ||
        item === "skip"
      ) {
        if (query[item]) {
          validate = true;
          if (Object.keys(query)[0] === "_id") {
            validateId = true;
          }
          Object.keys(query).forEach(function (attr) {
            if (attr === "page" || attr === "page" || attr === "skip") {
              validatePagination = true;
            }
          });
        } else {
          return res.status(401).json({
            error: true,
            mesagem: "Empty parameter query",
          });
        }
      } else {
        return res.status(401).json({
          error: true,
          mesagem: "Query wrong parameter",
        });
      }
    });

    if (validate && !validateId && !validatePagination) {
      Users.find(query, { password: 0, __v: 0 })
        .then((user) => {
          res.status(200).json({ User: user });
        })
        .catch((err) => {
          res.status(500).json({
            error: [true, err],
            message: "error in the request",
          });
        });
    } else if (validateId) {
      Users.findOne(query, { password: 0, __v: 0, dateAt: 0 })
        .then((data) => {
          res.status(200).json({ User: data });
        })
        .catch((err) => {
          res.status(500).json({
            error: [true, err],
            message: "error in the request",
          });
        });
    } else if (validatePagination) {
      Users.find({}, { password: 0, __v: 0 })
        .skip(skip)
        .limit(limit)
        .then((data) => {
          res.status(200).json({
            Users: data,
            pagination: {
              page: page,
              limit: limit,
              skip: skip,
            },
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: [true, err],
            message: "error in the request",
          });
        });
    } else {
      Users.find({}, { password: 0, __v: 0 })
        .then((data) => {
          res.status(200).json({
            Users: data,
            pagination: {
              page: page,
              limit: limit,
              skip: skip,
            },
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: [true, err],
            message: "error in the request",
          });
        });
    }
  }
}

module.exports = new User();
