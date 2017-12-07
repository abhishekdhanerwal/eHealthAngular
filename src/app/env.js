
(function (window) {
  window.__env = window.__env || {};

  var environment = "qa"; //can be dev, test or prod.qa

    if(environment === "qa"){
      window.__env.dataServerUrl = 'https://lit-plains-35147.herokuapp.com';
      window.__env.baseUrl = '/';
      window.__env.enableDebug = true;
      window.__env.user = "";
      window.__env.password = "";
    }
    else  {
      window.__env.dataServerUrl = 'http://localhost:8080';
      window.__env.baseUrl = '/';
      window.__env.enableDebug = true;
      window.__env.user = "9999999999";
      window.__env.password = "secret";
    }

}(this));

