(() => {
  //color icon
  const colorIcon = "white";

  // select element
  const nhiet = document.querySelector("#do");
  const nhietDo = document.querySelector(".nhietdo");
  const mieuta = document.querySelector(".mieuta");
  const muigio = document.querySelector("#muigio");
  const donvi = document.querySelector(".donvi");
  const iconWeather = document.getElementById("iconWeather");

  //select thoi gian toi
  let coverTime = UNIX_timestamp => {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time =
      date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
    return time;
  };

  const keyApi = `7a427dc4922710c85c7a30563d270921`;
  const proxy = `https://cors-anywhere.herokuapp.com/`;

  let getToaDo = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation &&
        navigator.geolocation.getCurrentPosition(position => {
          resolve({
            long: position.coords.longitude,
            lat: position.coords.latitude
          });
        });
    });
  };
  // get long and lat location
  let fetApi = o => {
    return new Promise((resolve, reject) => {
      fetch(o)
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
  };

  //setIcon(ten icon, element chua icon do)
  let setIcon = (s, id) => {
    const skycons = new Skycons({ color: colorIcon });
    let i = s.replace(/-/g, "_").toUpperCase();
    skycons.play();
    skycons.set(id, Skycons[i]);
  };
  let coverNhietDo = (a, c) => (c ? a * (9 / 5) + 32 : (5 / 9) * (a - 32));
  // true cover c -> f | false cover f -> c

  // lay thong tin nhiet do tu api
  (async () => {
    try {
      let a = await getToaDo();
      let api = `${proxy}https://api.darksky.net/forecast/${keyApi}/${a.lat},${
        a.long
      }`;
      let dataNhietDo = await fetApi(api);
      const { temperature, summary, icon } = dataNhietDo.currently;
      const { daily } = dataNhietDo;

      //render html
      nhiet.textContent = temperature;
      mieuta.textContent = summary;
      muigio.textContent = dataNhietDo.timezone;
      setIcon(icon, iconWeather);

      // listen event
      nhietDo.onclick = () => {
        let currentNhiet = nhiet.textContent;
        if (donvi.innerHTML === "F") {
          currentNhiet = coverNhietDo(currentNhiet, false).toFixed(2);
          donvi.innerHTML = "C";
          nhiet.innerHTML = currentNhiet;
        } else {
          currentNhiet = coverNhietDo(currentNhiet, true).toFixed(2);
          donvi.innerHTML = "F";
          nhiet.innerHTML = currentNhiet;
        }
      };
      let dataNhiet = daily.data.map((e, i) => {
        return `<div class="feature">
        <div id="_a">
          <div class="_b">
            <p>Min temperature: ${
              coverNhietDo(e.temperatureMin, false).toFixed(2)
            } <span>&#186;</span><span class="_donvi">C</span></p>
            <p>Max temperature: ${
              coverNhietDo(e.temperatureMax, false).toFixed(2)
            } <span>&#186;</span> <span class="_donvi">C</span></p>
            <canvas id="_icon${i}" width="128" height="128"></canvas>
          </div>
          <div class="_mieuta">${e.summary}</div>
          <div class="_ngay">${coverTime(e.time)}</div>
        </div>
      </div>`;
      });
      const div = document.querySelector(".dubao");
      div.innerHTML = dataNhiet.join('')
      daily.data.map((e, i) => {
        setIcon(e.icon, document.querySelector("#_icon" + i));
      });
    } catch (err) {
      console.error(err);
    }
  })();
})();
