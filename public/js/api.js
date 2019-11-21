const base_url = "https://api.football-data.org/v2/";
const klasemen_url = "competitions/2021/standings";
const team_url = "competitions/2021/teams";
var tempData;

const api_key = "829d2d81427a459d8c0e4f41fefa7ba8";


var dbProms = idb.open("db_football", 1, function(upgradeDb) {
  if (!upgradeDb.objectStoreNames.contains("team")) {
    var tbl_team = upgradeDb.createObjectStore("team", { keyPath: "id" });
  }
});

function addFavoritedTeam(id) {
  var allert = confirm("Save this team to your favorite collection?")
  if (allert) {
    var article = tempData.teams.filter(data => data.id == id)[0]
    dbProms.then(function(db) {
      var tx = db.transaction("team", "readwrite");
      tx.objectStore("team").put(article);
      return tx.complete;
    });
  }
}

function deleteFavoritedTeam(id) {
  var allert = confirm("Delete this team from your favorite collection?")
  if (allert) {
    dbProms.then(function(db) {
      var tx = db.transaction("team", "readwrite") ;
      tx.objectStore("team").delete(id);
      location.reload();
      return tx.complete;
    });
  }
}

function status(response) {
  if (response.status != 200) {
    console.log("Error: " + response.status);
    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
}

function json(response) {
  return response.json();
}

function error(response) {
  console.log("Error: " + response);
}


function getDataKlasemen() {
  if ("caches" in window) {
    caches.match(base_url + klasemen_url).then(function(response) {
      if (response) {
        response.json().then(function(data) {
          var articlesHTML = "";
          data.standings.forEach(function(response) {
            articlesHTML += `
            <div class="col s6">
              <div class="card">
                <div class="card-content">
                  <table>
                    <tr>
                      <td>Club</td>
                      <td>Played</td>
                      <td>Points</td>
                    </tr>
            `;
            for (x in response.table) {
              articlesHTML += `
              <tr>
                <td><img src="${response.table[x].team.crestUrl.replace(/^http:\/\//i, 'https://')}" width="20" />
                ${response.table[x].team.name}</td>
                <td>${response.table[x].playedGames}</td>
                <td>${response.table[x].points}</td>
              </tr>
              `;
            }
            articlesHTML += `
                    </table>
                  </div>
                </div>
              </div>
            `;
          });
          document.getElementById("klasemen_base").innerHTML = articlesHTML;
        });
      }
    });
  }

  const fetchApi = function(url) {
    fetch(url + klasemen_url, {
      headers: { 'X-Auth-Token' : api_key }
    }, data => {
      return data;
    }).then(status)
      .then(json)
      .then(function(data) {
        var articlesHTML = "";
        data.standings.forEach(function(response) {
          articlesHTML += `
            <div class="col s6">
              <div class="card">
                <div class="card-content">
                  <table>
                    <tr>
                      <td>Club</td>
                      <td>Played</td>
                      <td>Points</td>
                    </tr>
            `;
          for (x in response.table) {
            articlesHTML += `
              <tr>
                <td><img src="${response.table[x].team.crestUrl.replace(/^http:\/\//i, 'https://')}" width="20" />
                ${response.table[x].team.name}</td>
                <td>${response.table[x].playedGames}</td>
                <td>${response.table[x].points}</td>
              </tr>
            `;
          }
          articlesHTML += `
                    </table>
                  </div>
                </div>
              </div>
          `;
        });
        document.getElementById("klasemen_base").innerHTML = articlesHTML;
      }).catch(error);
  };
  fetchApi(base_url);
}

function getTeam() {
  if ("caches" in window) {
    caches.match(base_url + team_url).then(function(response) {
      if (response) {
        response.json().then(function(data) {
          var articlesHTML = "";
          data.teams.forEach(function(article) {
            articlesHTML +=  `
              <div class="col s12 m7">
                  <div class="card">
                    <div class="<div class="card-image waves-effect waves-block waves-light">
                      <div class="center-align">
                        <img src="${article.crestUrl.replace(/^http:\/\//i, 'https://')}" width="100" class="responsive-img">
                      </div>
                    </div>
                    <div class="card-content">
                      <span class="card-title activator grey-text text-darken-4">${article.name}<i class="material-icons right">more_vert</i></span>
                      <p><a target="_blank" href="${article.website}">Visit us!</a></p>
                    </div>
                    <div class="card-action">
                      <a class="waves-effect waves-light btn green" onClick="addFavoritedTeam(${article.id})">Like us?</a>
                    </div>
                    <div class="card-reveal">
                      <span class="card-title grey-text text-darken-4">${article.name}<i class="material-icons right">close</i></span>
                      <p>Hello, this is the ${article.name}, usually also called ${article.shortName}. the team is located at ${article.address}, the telephone number is ${article.phone} and the email address is ${article.email}.</p>
                    </div>
                  </div>
              </div>
            `;
          });
          document.getElementById("team_base").innerHTML = articlesHTML;
        });
      }
    });
  }

  const fetchApi = function(url) {
    fetch(url + team_url, {
      headers: { 'X-Auth-Token' : api_key }
    }, data => {
      return data;
    }).then(status)
    .then(json)
    .then(function(data) {
      var articlesHTML = "";
      tempData = data;
      data.teams.forEach(function(article) {
        articlesHTML +=  `
        <div class="col s12 m6">
            <div class="card">
              <div class="<div class="card-image waves-effect waves-block waves-light">
                <div class="center-align">
                  <img src="${article.crestUrl.replace(/^http:\/\//i, 'https://')}" width="100" class="responsive-img">
                </div>
              </div>
              <div class="card-content">
                <span class="card-title activator grey-text text-darken-4">${article.name}<i class="material-icons right">more_vert</i></span>
                <p><a target="_blank" href="${article.website}">Visit us!</a></p>
              </div>
              <div class="card-action">
                <a class="waves-effect waves-light btn green" onClick="addFavoritedTeam(${article.id})">Like us?</a>
              </div>
              <div class="card-reveal">
                <span class="card-title grey-text text-darken-4">${article.name}<i class="material-icons right">close</i></span>
                <p>Hello, this is the ${article.name}, usually also called ${article.shortName}. the team is located at ${article.address}, the telephone number is ${article.phone} and the email address is ${article.email}.</p>
              </div>
            </div>
        </div>
        `;
      });

      document.getElementById("team_base").innerHTML = articlesHTML;
    }).catch(error);
  }

  fetchApi(base_url);
}

function getFavouritedTeams() {
  dbProms.then(function(db) {
    var tx = db.transaction("team", "readonly");
    var store = tx.objectStore("team");
    var req = store.getAll();
    return req;
  }).then(function(response) {
    var articlesHTML = "";
    response.forEach(function(article) {
      articlesHTML += `
        <div class="col s12 m6">
        <div class="card">
          <div class="<div class="card-image waves-effect waves-block waves-light">
            <div class="center-align">
              <img src="${article.crestUrl.replace(/^http:\/\//i, 'https://')}" width="100" class="responsive-img">
            </div>
          </div>
          <div class="card-content">
            <span class="card-title activator grey-text text-darken-4">${article.name}<i class="material-icons right">more_vert</i></span>
            <p><a target="_blank" href="${article.website}">Visit us!</a></p>
          </div>
          <div class="card-action">
            <a class="waves-effect waves-light btn red" onClick="deleteFavoritedTeam(${article.id})">Remove us?</a>
          </div>
          <div class="card-reveal">
            <span class="card-title grey-text text-darken-4">${article.name}<i class="material-icons right">close</i></span>
            <p>Hello, this is the ${article.name}, usually also called ${article.shortName}. the team is located at ${article.address}, the telephone number is ${article.phone} and the email address is ${article.email}.</p>
          </div>
        </div>
        </div>
      `;
    });

    if (response.length == 0) {
      articlesHTML += '<h6 class="center-align">Love some team, and come again!</6>';
    }

    document.getElementById("favourite_team_base").innerHTML = articlesHTML;

  });
}
