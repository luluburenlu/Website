let titleArr = [],
  resData = [];

const KEY = "9010da3a084d4bb5bf5f0f5ceaae5475";
// ("9010da3a084d4bb5bf5f0f5ceaae5475");

function skip(href) {
  window.open(href);
}

function copy(el) {
  return JSON.parse(JSON.stringify(el));
}

function computedTime(time) {
  let now = new Date(),
    old = new Date(time),
    diffTime = (now - old) / 1000,
    days = parseInt(diffTime / 86400),
    hours = parseInt(diffTime / 3600) - 24 * days,
    minutes = parseInt((diffTime % 3600) / 60),
    seconds = parseInt(diffTime % 60);

  return { days, hours, minutes, seconds };
}

function renderList(list) {
  $("#row").html("");
  for (var i = 0; i < list.length; i++) {
    let data = list[i];
    let time = computedTime(data.publishedAt);
    let resTime = time.days
      ? time.days + " days"
      : time.hours
      ? time.hours + " hours"
      : time.minutes
      ? time.minutes + " mins"
      : time.minutes + " mins";

    var reg = /<[^<>]+>/g;
    var img = [null, false, undefined, "null", "", "undefined"].includes(
      data.urlToImage
    );

    $("#row").append(`<div class="col-md-6 col-lg-3" onclick="skip('${
      data.url
    }')">
					<div class="card mb-4 shadow-sm">
							<img src="${
                img ? "./images/221523085944_.pic_hd.jpg" : data.urlToImage
              }" height="225" width="100%"/>
							<div class="card-body">
									<p class="card-text">
										<a class='wrap2'>${data.title}</a>
									</p>
									<p class='wrap3'>
											${(data.description + "").replace(reg, "")}
										</p>
									<div class="d-flex justify-content-between align-items-center">
											<div class="btn-group">
											</div>
											<small class="text-muted">${resTime}</small>
									</div>
							</div>
					</div>
			</div>`);
  }
}

function loadNews(sourceId) {
  var URL =
    "https://newsapi.org/v2/everything?sources=" +
    sourceId +
    "&apiKey=" +
    KEY +
    "&pageSize=30";
  $.get(URL, function (res) {
    renderList(res.articles);
  });
}

function switchNewsBoxs(id) {
  loadNews(id);
}

function loadSources() {
  var newsSourcesListContent = "";
  var URL = "https://newsapi.org/v2/sources?apiKey=" + KEY + "";

  $.get(URL, function (data) {
    loadNews(data.sources[0].id);
    titleArr = copy(data.sources);
    for (var i = 0; i < data.sources.length; i++) {
      newsSourcesListContent +=
        '<a onclick="switchNewsBoxs(&quot;' +
        data.sources[i].id +
        '&quot;)" aria-controls="home" class="list-group-item list-group-item-action" data-toggle="list" href="#list-home" id="list-home-list" role="tab">' +
        data.sources[i].name +
        "</a>";
    }
    $("#list-tab").html(newsSourcesListContent);
  });
}

$(document).ready(loadSources);

function search() {
  $("#searchBtn").click(() => {
    var val = $("#search").val();
    var URL = `https://newsapi.org/v2/top-headlines?q=${val}&apiKey=${KEY}`;
    $.get(URL, function (res) {
      renderList(res.articles);
    });
  });
}
search();
