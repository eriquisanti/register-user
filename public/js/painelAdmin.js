const nameAdmin = $("#inputNameAdmin");
const loginAdmin = $("#inputLoginAdmin");
const passwordAdmin = $("#inputPasswordLogin");

$(document).ready(function () {
  removeError(nameAdmin);
  removeError(loginAdmin);
  removeError(passwordAdmin);

  validateInputs(nameAdmin);
  validateInputs(loginAdmin);
  validateInputs(passwordAdmin);

  let login = $.cookie("login");
  console.log(login)
  login = CryptoJS.AES.decrypt(login, "EncryptionKey");
  $.removeCookie("login")

  getAdmin(login.toString(CryptoJS.enc.Utf8))

});

$("#buttonExit").click(() => {
  $.ajax({
    url: "/logout",
    data: JSON.stringify({ exit: true }),
    type: "POST",
    contentType: "application/json",
    cache: false,
    success: function (result) {
      if (result) {
        window.location.pathname = "/login";
      }
    },
    error: function (result) {
      console(result);
    },
  });
});

$("#formRegisterAdmin").submit((event) => {
  event.preventDefault();

  const data = {
    name: nameAdmin.val(),
    login: loginAdmin.val(),
    password: passwordAdmin.val(),
  };

  /**
   * Codigos de error
   * 200 - Registrado com sucesso
   * 201 - usuario ja existente
   * 400 - erro ao Inserir usuario
   **/
  $.ajax({
    url: "/register/admin",
    data: JSON.stringify(data),
    type: "POST",
    contentType: "application/json",
    cache: false,

    success: function (result) {
      if (result.code === 200) {
        $("#alert-error").remove();
        alertMessage(
          "alert-success",
          "Admin cadastrado com sucesso!",
          "success",
          "check"
        );
        nameAdmin.val("");
        loginAdmin.val("");
        passwordAdmin.val("");

        nameAdmin.removeClass("is-invalid");
        loginAdmin.removeClass("is-invalid");
        passwordAdmin.removeClass("is-invalid");

        nameAdmin.removeClass("is-valid");
        loginAdmin.removeClass("is-valid");
        passwordAdmin.removeClass("is-valid");
      } else if (result.code === 201) {
        $("#alert-success").remove();
        alertMessage(
          "alert-error",
          "Usuario já cadastrado! Por favor cadastre outro login.",
          "danger",
          "exclamation-triangle-fill"
        );
        loginAdmin.val("");
        loginAdmin.addClass("is-invalid");
      }
    },

    error: function (error) {
      $("#alert-error").remove();
      $("#alert-success").remove();
      alertMessage(
        "alert-error",
        "Algo deu errado! Por favor verifique os campos.",
        "danger",
        "exclamation-triangle-fill"
      );
      validateInputs(nameAdmin);
      validateInputs(loginAdmin);
      validateInputs(passwordAdmin);
    },
  });
});
