$(document).ready(function () {
  const login = $("#inputLogin");
  const password = $("#inputPassword");

 removeError(login);
 removeError(password);

});

$("form").submit((event) => {
  event.preventDefault();
  const login = $("#inputLogin");
  const password = $("#inputPassword");
  data = {
    login: login.val(),
    password: password.val(),
  };

  /**
   * Codigos de error
   * 200 - logado com sucesso
   * 402 - senha incorreta
   * 400 - erro ao encontar senha
   * 401 - erro ao encontar usuario
   * 403 - loggin errado
   */
  
  $.ajax({
    url: "/login/admin",
    data: JSON.stringify(data),
    type: "POST",
    contentType: "application/json",
    cache: false,

    success: function (result) {
      console.log(result);
      if (result.logged) {
        let login = CryptoJS.AES.encrypt(result.login, "EncryptionKey");
        $.cookie('login', login)
        window.location.pathname = "/admin/painel";
      } else {
        validateLogin(login, result.code);
        validatePassword(password, result.code);
      }
    },

    error: function (error) {
      console.log(error);
    },
  });
});



