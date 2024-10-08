document.addEventListener('DOMContentLoaded', function () {
  var container = document.getElementById('events');

  // Get the current language
  var lang = document.documentElement.getAttribute('lang');
  
  function getNoEventsText() {
    var noEventsTextEstonian = 'Praegu esinemisi kirjas pole, aga plaanis on kindlasti kontserte anda. Ärge muretsege!';
    var noEventsTextEnglish = 'Currently, there are no scheduled performances, but we definitely plan to have concerts. Don\'t worry!';
    if (lang === 'en') {
      return noEventsTextEnglish;
    }
    return noEventsTextEstonian;
  }

  function formatDateToEstonian(dateStr) {
    var date = new Date(dateStr.replace(/-/g, "/"));
    var months = ['jaanuar', 'veebruar', 'märts', 'aprill', 'mai', 'juuni', 'juuli', 'august', 'september', 'oktoober', 'november', 'detsember'];
    var day = date.getDate();
    var month = months[date.getMonth()];
    var year = date.getFullYear();
    var currentYear = new Date().getFullYear();

    return day + '. ' + month + (currentYear !== year ? ' ' + year : '');
  }

  function formatDateToEnglish(dateStr) {
    var date = new Date(dateStr.replace(/-/g, "/"));
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var day = date.getDate();
    var month = months[date.getMonth()];
    var year = date.getFullYear();
    var currentYear = new Date().getFullYear();

    return month + ' ' + day + (currentYear !== year ? ', ' + year : '');
  }

  function formatEventDate(dateStr) {
    if (lang === 'en') {
      return formatDateToEnglish(dateStr);
    }
    return formatDateToEstonian(dateStr);
  }

  function fetchJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status);
      }
    };
    xhr.send();
  }

  // Function to handle category events
  function handleCategoryEvents(events) {
    if (events.length > 0) {
      // Display one image per category (from first event)
      let imageHtml = '';
      if (events[0].image_url) {
        imageHtml = `<img src="${events[0].image_url}" alt="${events[0].title}" class="event-image"/>`;
      }
      
      // Display one title / general information per category.
      let categoryHtml = ``;
      categoryHtml += `
        <div class="post-content">
        <section class="container list">
        <ul>
        <h3 class="post-title">
          <a href="${events[0].buy_tickets_url}">${events.title}</a>
        </h3>
        ${imageHtml}  `;
      
      // Display dates and venues.
      events.forEach(function (event) {
        const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`;
        categoryHtml += `
              <li>
              <span class="date">${formatEventDate(event.starts_at)}</span>
              <a class="title" href="${googleMapsLink}" target="_blank">${event.venue}</a>
            </li>`;
      });
      categoryHtml += '</ul></section></div>';
      container.insertAdjacentHTML('beforeend', categoryHtml);
    }
  }

  fetchJSON('https://fienta.com/o/840?format=json', function (err, data) {
    if (!err && data.events.length) {
      // Group events by series_id
      let groupedEvents = {};
      data.events.forEach(function (event) {
            if (!groupedEvents[event.series_id]) {
              groupedEvents[event.series_id] = [];
               // Hardcode name for series_id kaisa-ling-thingi-kontserttuur-big-bang
               if(event.series_id === 'kaisa-ling-thingi-kontserttuur-big-bang') {
                groupedEvents[event.series_id].title = ' Big Bäng plaadiesitlustuur';
              } 
              else if(event.series_id == 'late-night-cabaret') {
                groupedEvents[event.series_id].title = 'Late Night Cabaret';
              }
              else {
                groupedEvents[event.series_id].title = event.series_id;
              }
            }
            groupedEvents[event.series_id].push(event);
      });

      
      

      // Create the HTML!
      for (const seriesId in groupedEvents) {
        if (groupedEvents.hasOwnProperty(seriesId)) {
          const events = groupedEvents[seriesId];
          if (events.length > 1) {
            handleCategoryEvents(events);
          }
        }
      }
    } else {
      // If there are no events, let's tell the user.
      container.insertAdjacentHTML('beforeend', '<p>' + getNoEventsText() + '</p>');
    }
  });
});
