function getUsers(page) {
  let limit = '10'
  let contUsers = parseInt(limit) * (parseInt(page) - 1);
   console.log(contUsers)

  $.ajax({
    url: `/search/user?page=${page}&limit=${limit}`,
    type: "GET",
    contentType: "application/json",
    success: function (result) {
      result.Users.map((user, index) => {
        let telephone = user.tel
          .toString()
          .replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
        var warraper = `<tr id=${
          user._id
        } class="user-line" data-bs-toggle="modal" data-bs-target="#infoUser" onClick="informationUser(id)"> <th scope="row">${
          contUsers + index + 1
        }</th> <td>${user.name}</td> <td>${
          user.email
        }</td> <td class="tel-table" data-mask="(00) 00000-0000">${telephone}</td> <td>${new Date(
          user.dateAt
        ).toLocaleDateString("pt-BR", {
          timeZone: "UTC",
        })}</td> </tr>`;
        $("#tbodyUser").append(warraper);
      });
    },
    error: function (result) {
      console.log(result);
    },
  });
}

function getUser(email) {
  $.ajax({
    url: `/search/user?email=${email}`,
    type: "GET",
    contentType: "application/json",
    success: function (result) {
      let userIndex = parseInt($("#numberUserRegistered").text()) + 1;
      $("#numberUserRegistered").text(userIndex);
      let user = result.User[0];
      // let telephone = user.tel
      //   .toString()
      //   .replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3");
      // var warraper = `<tr id=${
      //   user._id
      // } class="user-line" data-bs-toggle="modal" data-bs-target="#infoUser" onClick="informationUser(${
      //   user._id
      // })"> <th scope="row">${userIndex}</th> <td>${user.name}</td> <td>${
      //   user.email
      // }</td> <td class="tel-table" data-mask="(00) 00000-0000" >${telephone}</td> <td>${new Date(
      //   user.dateAt
      // ).toLocaleDateString("pt-BR", {
      //   timeZone: "UTC",
      // })}</td> </tr>`;
      // $("#tbodyUser").append(warraper);
    },
    error: function (result) {
      console.log(result);
    },
  });
}

function removeError(field) {
  field.bind("input", function () {
    field.removeClass("is-invalid");
  });
}

function validateLogin(field, code) {
  if (code === 403) {
    field.addClass("is-invalid");
  } else {
    field.removeClass("is-invalid");
  }
}

function validatePassword(field, code) {
  if (code === 402) {
    field.addClass("is-invalid");
  } else {
    field.removeClass("is-invalid");
  }
}

function alertMessage(id, message, type, icon) {
  const alertRegister = $(".alertRegister");
  var wrapper =
    '<div id="' +
    id +
    '" class="alert alert-' +
    type +
    ' d-flex align-items-center alert-dismissible" role="alert">' +
    '<i class="bi bi-' +
    icon +
    ' fs-4"></i>' +
    '<span class="px-3">' +
    message +
    "</span>" +
    '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';

  alertRegister.append(wrapper);
}

function validateInputs(field) {
  field.blur(function () {
    if (field.val() === "") {
      field.removeClass("is-valid");
      field.addClass("is-invalid");
    } else {
      field.removeClass("is-invalid");
      field.addClass("is-valid");
    }
  });
}

function validateInputSocial(field) {
  field.blur(function () {
    if (field.val() !== "") {
      field.addClass("is-valid");
    } else {
      field.removeClass("is-valid");
    }
  });
}

function validateEmail(email) {
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailReg.test(email);
}

function isCpf(cpf) {
  exp = /\.|-/g;
  cpf = cpf.toString().replace(exp, "");
  var digitoDigitado = eval(cpf.charAt(9) + cpf.charAt(10));
  var soma1 = 0,
    soma2 = 0;
  var vlr = 11;
  for (i = 0; i < 9; i++) {
    soma1 += eval(cpf.charAt(i) * (vlr - 1));
    soma2 += eval(cpf.charAt(i) * vlr);
    vlr--;
  }
  soma1 = (soma1 * 10) % 11 === 10 ? 0 : (soma1 * 10) % 11;
  soma2 = ((soma2 + 2 * soma1) * 10) % 11;
  if (
    cpf === "11111111111" ||
    cpf === "22222222222" ||
    cpf === "33333333333" ||
    cpf === "44444444444" ||
    cpf === "55555555555" ||
    cpf === "66666666666" ||
    cpf === "77777777777" ||
    cpf === "88888888888" ||
    cpf === "99999999999" ||
    cpf === "00000000000"
  ) {
    var digitoGerado = null;
  } else {
    var digitoGerado = soma1 * 10 + soma2;
  }
  if (digitoGerado !== digitoDigitado) {
    return false;
  }
  return true;
}

function validateTel(tel) {
  return tel.match(/\d/g).length === 11;
}

function ClearFiels() {
  $("form").find("input").val("");
  $("form").find("select").val("");
  $("form").find("input").removeClass("is-invalid");
  $("form").find("input").removeClass("is-valid");
  $("form").find("select").removeClass("is-invalid");
  $("form").find("select").removeClass("is-valid");
  $("#alert-success").remove();
  $("#alert-error").remove();
}

function ClearFielsUser() {
  $("form").find("input").val("");
  $("form").find("select").val("");
  $("form").find("input").removeClass("is-invalid");
  $("form").find("input").removeClass("is-valid");
  $("form").find("select").removeClass("is-invalid");
  $("form").find("select").removeClass("is-valid");
  $("#alert-error").remove();
}

function getAdmin(login) {
  $.ajax({
    url: "/get/admin",
    data: JSON.stringify({ login: login }),
    type: "POST",
    contentType: "application/json",
    cache: false,
    success: function (result) {
      console.log(result);
      $("#nameAdminSession").text(result);
    },
    error: function (result) {
      console.log(result);
    },
  });
}

function informationUser(id) {
  console.log("clicado: ", typeof id);

  $.ajax({
    url: `/search/user?_id=${id}`,
    type: "GET",
    contentType: "application/json",
    success: function (result) {
      console.log(result);
      const user = result.User;

      setTimeout(function () {
        $("#nameInfoUser").text(user.name)
        $("#inputEmailInfo").val(user.email);
        //$("#inputPasswordInfo").val(user.password)
        $("#inputNameInfo").val(user.name);
        $("#inputDateInfo").val(new Date(
          user.birth_date
        ).toLocaleDateString("pt-BR", {
          timeZone: "UTC",
        }));
        $("#inputCpfInfo").val(user.cpf.toString().replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"));
        $("#inputTelInfo").val(user.tel.toString()
        .replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3"));
        $("#selectSexoInfo").val(user.sexo);
        $("#inputCepInfo").val(user.address.cep.toString().replace(/(\d{5})(\d{3})/, "$1-$2"));
        $("#inputCityInfo").val(user.address.city);
        $("#inputStateInfo").val(user.address.state);
        $("#inputDistrictInfo").val(user.address.district);
        $("#inputStreetInfo").val(user.address.street);
        $("#inputNumberInfo").val(user.address.number);

        $("#instagram-urlInfo").val();
        $("#twitter-urlInfo").val();
        $("#facebook-urlInfo").val();
        $("#linkedin-urlInfo").val();
        $("#github-urlInfo").val();
      }, 200);
    },
    error: function (result) {
      console.log(result);
    },
  });
}

function pagination(page) {
  page = parseInt(page)
  let array = []
  const previus = '<li class="page-item"><span class="page-link" aria-label="Previous" style="cursor: pointer;"><span aria-hidden="true">&laquo;</span></span></li>'
  const next = ' <li class="page-item"><span class="page-link" aria-label="Next" style="cursor: pointer;"><span aria-hidden="true">&raquo;</span></span></li>'

  for (var i = 1; i <= page; i++) {
    let warraper = `<li id="${i}" onClick="paginationClick(id)" class="page-item"><span class="page-link" style="cursor: pointer;">${i}</span></li>`
    array.push(warraper);
  }
  let append = `${previus} ${array.map(num => {
    console.log(num)
      return num
  }).join('')} ${next}`

  $('.pagination').append(append);
}

function paginationClick(id){
  $("#tbodyUser").find('tr').remove();
  getUsers(id.toString())
}

function paginationNext(){

}
function addUserBtn(page){
  $("#tbodyUser").find('tr').remove();
  getUsers(page)
}