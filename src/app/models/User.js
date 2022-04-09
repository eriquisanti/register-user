const mongoose = require("mongoose");

const User = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  cpf: { type: Number, required: true },
  sexo: { type: String, required: true },
  birth_date: { type: Date, required: true },
  tel: { type: Number, required: true },
  address: {
    cep:  { type: Number, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    street: { type: String, required: true },
    district: { type: String, required: true },
    number: { type: Number, required: true },
  },
  social: { 
    facebook: { type: String, required: false },
    instagram: { type: String, required: false },
    twitter: { type: String, required: false },
    linkedin: { type: String, required: false },
    github: { type: String, required: false },
  },
  dateAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("user", User);
