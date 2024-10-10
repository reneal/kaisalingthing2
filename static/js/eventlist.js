document.addEventListener('DOMContentLoaded', function () {
  var container = document.getElementById('events');

  // Get the current language
  var lang = document.documentElement.getAttribute('lang');

  if (lang === 'en') {
    var buyTicketText = 'Buy ticket'
  }
  else {
    var buyTicketText = 'Osta pilet'
  }
  
  if (lang === 'en') {
    var reservePlaceText = 'Reserve a seat'
  }
  else {
    var reservePlaceText = 'Broneeri istekoht'
  }
  


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
  
  function formatEventLocation(venueStr) {
    const venueMap = {
      'Kultuuriklubi BAAS': 'Rapla (Kultuuriklubi BAAS)',
      'Philly Joe\'s Jazz Club': 'Tallinn (Philly Joe\'s Jazz Club)',
      'Sakala Keskus': 'Viljandi (Sakala Keskus)',
      'Vilde ja Vine': 'Tartu (Vilde ja Vine)',
      'Endla Kohvik': 'Pärnu (Endla Kohvik)',
      'Heldeke': "Tallinn (Heldeke)"
    };
    
    for (const [venue, replacement] of Object.entries(venueMap)) {
      if (venueStr.includes(venue)) {
        return replacement;
      }
    }
    
    if (lang === 'en') {
      return venueStr;
    }
    return venueStr;
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
      
      // Display one title / general information per category with 'Osta pilet' button styled as a button.
      let categoryHtml = `
        <div class="eventseries-grid">
          <div class="category-header">
            <h3 class="post-title">
              <a href="${events.call_to_action_url}" target="_blank">${events.title}</a>
            </h3>
            <a href="${events.call_to_action_url}" target="_blank" class="buy-ticket-button">${events.call_to_action_text}</a>
          </div>
          <a href="${events.call_to_action_url}" target="_blank">${imageHtml}</a>
        
        <div class="events-grid">`;
      
      // Display dates and venues.
      events.forEach(function (event) {
        categoryHtml += `
          <div class="event-card">
            <a class="date" href="${event.url}" target="_blank">${formatEventDate(event.starts_at)}</a>
            <a class="title" href="${event.url}" target="_blank">${formatEventLocation(event.venue)}</a>
          </div>`;
      });
      categoryHtml += '</div></div>';
      container.insertAdjacentHTML('beforeend', categoryHtml);
    }
  }

  /* Example response data:
  {
    "success": {
        "code": 200,
        "user_message": "Events returned successfully",
        "internal_message": "events_returned_successfully"
    },
    "time": {
        "timestamp": 1525436423,
        "date": "2018-05-04",
        "time": "15:20:23",
        "full_datetime": "2018-05-04T15:20:23+03:00",
        "timezone": "Europe/Tallinn",
        "timezone_short": "EEST",
        "gmt": "+0300"
    },
    "count": 1,
    "events": [
        {
            "id": 10,
            "title": "Happy event",
            "starts_at": "2018-09-22 00:00:00",
            "ends_at": "2018-10-22 23:59:59",
            "duration_string": "Sat 22. September - Mon 22. October 2018",
            "sale_status": "salesEnded",
            "attendance_mode": "offline",
            "venue": "Sydney Opera House",
            "address": "1600 Pennsylvania Ave., Washington, D.C., 20500",
            "address_postal_code": "10151",
            "description": "Lorem ipsum<br>\\n superma lex",
            "url": "https://fienta.com/happy-event",
            "buy_tickets_url": "https://fienta.com/happy-event",
            "image_url": "https://fienta.com/uploads/12456.jpg",
            "series_id": "happy-event",
            "organizer_name": "Great Events Ltd",
            "organizer_phone": "1 800 1234 5678",
            "organizer_email": "hello@greatevents.com",
            "organizer_id": 4567,
            "categories": [
                ""
            ]
        }
    ]
} */
  fetchJSON('https://fienta.com/o/840?format=json', function (err, data) {
  // Heldeke test  fetchJSON('https://fienta.com/o/825?format=json', function (err, data) {
    if (!err && data.events.length) {
      // Group events by series_id
      let groupedEvents = {};
      data.events.forEach(function (event) {
            if (!groupedEvents[event.series_id]) {
              groupedEvents[event.series_id] = [];
              groupedEvents[event.series_id].call_to_action_text = buyTicketText; // Default text, can be overriden by specific events.


               // Hardcode name & other parameters for specific series
               if(event.series_id === 'kaisa-ling-thingi-kontserttuur-big-bang') {
                if(lang === 'en') {
                  groupedEvents[event.series_id].title = "Big Bäng (New Album Tour)"; 
                  groupedEvents[event.series_id].call_to_action_text = "Buy album";
                }
                else {
                  groupedEvents[event.series_id].title = 'Big Bäng plaadiesitlustuur';
                  groupedEvents[event.series_id].call_to_action_text = "Osta album";
                }
                groupedEvents[event.series_id].call_to_action_url = 'https://www.hooandja.ee/projekt/kaisa-ling-thingi-kolmas-taispikk-album-big-bang'
              } 
              else if(event.series_id == 'late-night-cabaret') {
                groupedEvents[event.series_id].title = 'Late Night Cabaret';
                groupedEvents[event.series_id].call_to_action_url = event.buy_tickets_url;
                groupedEvents[event.series_id].call_to_action_text = reservePlaceText;
              }
              else {
                groupedEvents[event.series_id].title = event.title;
                groupedEvents[event.series_id].call_to_action_url = event.buy_tickets_url;
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
