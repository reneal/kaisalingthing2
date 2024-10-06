
document.addEventListener('DOMContentLoaded', function () {
    var container = document.getElementById('events');

    // Get the current language
    var lang = document.documentElement.getAttribute('lang');
    var noEventsTextEstonian = 'Praegu esinemisi kirjas pole, aga plaanis on kindlasti kontserte anda. Ärge muretsege!';
    var noEventsTextEnglish = 'Currently, there are no scheduled performances, but we definitely plan to have concerts. Don\'t worry!';
    
    function getNoEventsText() {
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
        xhr.onload = function() {
            var status = xhr.status;
            if (status === 200) {
                callback(null, xhr.response);
            } else {
                callback(status);
            }
        };
        xhr.send();
    }

    fetchJSON('https://fienta.com/o/840?format=json', function (err, data) {
        if (!err && data.events.length) {
            data.events.forEach(function (event) {
                var googleMapsLink = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(event.address);
                
                var imageHtml = '';
                if (event.image_url) {
                    // Using 1070x602 as the image width and height
                    var imageWidth = 1070;
                    var imageHeight = 602;
                    imageHtml = '<a href="' + event.buy_tickets_url + '"><img src="' + event.image_url + '" alt="' + event.title + '" class="event-image" width="' + imageWidth + '" height="' + imageHeight + '" /></a>';
                }
                
                container.insertAdjacentHTML('beforeend',
                    '<div class="event-card">' +
                    imageHtml +
                    '<div class="event-date"><i class="fa fa-calendar-alt"></i> ' + formatEventDate(event.starts_at) + '</div>' +
                    '<div class="event-title"><a href="' + event.buy_tickets_url + '">' + event.title + '</a></div>' +
                    '<div class="event-venue"><i class="fa fa-map-marker-alt"></i> <a href="' + googleMapsLink + '" target="_blank" title="' + event.address + '">' + event.venue + '</a></div>' +
                    '</div>'
                );
            });
        } else {
            container.insertAdjacentHTML('beforeend', getNoEventsText());
        }
    });
});
