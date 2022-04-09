const nameUser = $("#inputName");
const emailUser = $("#inputEmail");
const passwordUser = $("#inputPassword");
const cpf = $("#inputCpf");
const sexo = $("#selectSexo");
const date = $("#inputDate");
const tel = $("#inputTel");
const street = $("#inputStreet");
const number = $("#inputNumber");
const district = $("#inputDistrict");
const city = $("#inputCity");
const state = $("#inputState");
const cep = $("#inputCep");

const instagram = $("#instagram-url");
const twitter = $("#twitter-url");
const facebook = $("#facebook-url");
const linkedin = $("#linkedin-url");
const github = $("#github-url");

const statesBR = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MS",
  "MT",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

$(document).ready(function () {
  validateInputs(nameUser);
  //validateInputs(emailUser);
  validateInputs(passwordUser);
  //validateInputs(cpf);
  validateInputs(sexo);
  validateInputs(date);
  // validateInputs(tel);
  validateInputs(street);
  validateInputs(number);
  validateInputs(district);
  validateInputs(city);
  validateInputs(state);
  //validateInputs(cep);

  validateInputSocial(instagram);
  validateInputSocial(twitter);
  validateInputSocial(facebook);
  validateInputSocial(linkedin);
  validateInputSocial(github);

  cep.mask("00000-000");
  tel.mask("(00) 00000-0000");
  cpf.mask("000.000.000-00", { reverse: true });
  date.mask("00/00/0000", { placeholder: "__/__/____" });

  statesBR.map((sigla) => {
    let option = "<option value=" + sigla + ">" + sigla + "</option>";
    state.append(option);
    $("#inputStateInfo").append(option);
  });

  $.ajax({
    url: '/search/user',
    type: "GET",
    contentType: "application/json",
    success: function (result) {
      $("#numberUserRegistered").text(result.Users.length);
    },
    error: function (result) {
      console.log(result);
    },
  });

  getUsers('1');
  pagination('3')
});

$("#formRegisterUser").submit((event) => {
  event.preventDefault();
  const data = {
    name: nameUser.val(),
    email: emailUser.val(),
    password: passwordUser.val(),
    cpf: cpf.val().replace(/\D/g, ''),
    sexo: sexo.val(),
    birth_date: date.val().replace(/\D/g, ''),
    tel: tel.val().replace(/\D/g, ''),
    address: {
      cep: cep.val().replace(/\D/g, ''),
      city: city.val(),
      state: state.val(),
      street: street.val(),
      district: district.val(),
      number: number.val(),
    },
    social: {
      facebook: facebook.val(),
      instagram: instagram.val(),
      twitter: twitter.val(),
      linkedin: linkedin.val(),
      github: github.val(),
    },
  };

  if ($("#gridCheck").is(":checked")) {
    $.ajax({
      url: "/register/user",
      data: JSON.stringify(data),
      type: "POST",
      contentType: "application/json",
      cache: false,
      success: function (result) {
        console.log(result.code === 200)
        if (result.code === 200) {
          $("#alert-error").remove();
          $("#alert-warning").remove();

          alertMessage(
            "alert-success",
            "Usuário cadastrado com sucesso!",
            "success",
            "check"
          );
          ClearFielsUser();
          getUser(result.email)
        }else {
          $("#alert-warning").remove();
          $("#alert-success").remove();
          alertMessage(
            "alert-error",
            "Usuário já existe! Por favor altere seu e-mail.",
            "warning",
            "exclamation-triangle-fill"
          );
        }
      },
      error: function (result) {
        console.log(result);
        if (result.responseJSON.code === 400) {
          $("#alert-error").remove();
          $("#alert-success").remove();
          alertMessage(
            "alert-warning",
            "Por favor preencha os campos obrigatórios.",
            "warning",
            "exclamation-triangle-fill"
          );

          validateInputs(nameUser);
          validateInputs(emailUser);
          validateInputs(passwordUser);
          validateInputs(cpf);
          validateInputs(sexo);
          validateInputs(date);
          validateInputs(tel);
          validateInputs(street);
          validateInputs(number);
          validateInputs(district);
          validateInputs(city);
          validateInputs(state);
          validateInputs(cep);
        }
      },
    });
  } else {
    $("#gridCheck").addClass("is-invalid");
    alertMessage(
      "alert-error",
      "Por favor aceite os termos de privacidade para continuar o cadastro.",
      "warning",
      "exclamation-triangle-fill"
    );
  }
});

cep.blur(function () {
  var cepNumber = $(this)
    .val()
    .replace(/[^0-9]/, "");
  if (cepNumber) {
    var url = "https://viacep.com.br/ws/" + cepNumber + "/json/";
    $.ajax({
      url: url,
      dataType: "jsonp",
      crossDomain: true,
      contentType: "application/json",
      success: function (json) {
        if (json.logradouro) {
          street.val(json.logradouro);
          district.val(json.bairro);
          city.val(json.localidade);
          state.val(json.uf);

          street.addClass("is-valid");
          district.addClass("is-valid");
          city.addClass("is-valid");
          state.addClass("is-valid");
        } else {
          cep.addClass("is-invalid");
        }
      },
    });
  }
});

$("#gridCheck").change(() => {
  if ($("#gridCheck").is(":checked")) {
    $("#gridCheck").remove("is-invalid");
    $("#alert-error").remove();
  }
});

emailUser.blur(function () {
  if (validateEmail(emailUser.val())) {
    emailUser.removeClass("is-invalid");
    emailUser.addClass("is-valid");
  } else {
    emailUser.removeClass("is-valid");
    emailUser.addClass("is-invalid");
  }
});

cpf.blur(function () {
  if (isCpf(cpf.val())) {
    cpf.removeClass("is-invalid");
    cpf.addClass("is-valid");
  } else {
    cpf.addClass("is-invalid");
    cpf.remove("is-valid");
  }
});

tel.blur(function () {
  if (validateTel(tel.val())) {
    tel.removeClass("is-invalid");
    tel.addClass("is-valid");
  } else {
    tel.remove("is-valid");
    tel.addClass("is-invalid");
  }
});
