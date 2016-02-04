function getAllData() {
    // Generate a random Firebase location
    var firebaseUrlLocation = "https://resplendent-torch-5319.firebaseio-demo.com/location";
    var firebaseLocation = new Firebase(firebaseUrlLocation);

    // Create a new GeoFire instance at the random Firebase location
    var geoFire = new GeoFire(firebaseLocation);

    var firebaseUrlData = "https://resplendent-torch-5319.firebaseio-demo.com/data";
    var firebaseData = new Firebase(firebaseUrlData);

    var geoQuery = geoFire.query({
        center: [48.8919593,2.3486984],
        radius: 99999 //kilometers
    });

    var infowindow_array = [];
    
    google.maps.event.addListener(map, "click", function () {
        for (var i in infowindow_array) {
            infowindow_array[i].close();
        }
    });

    geoQuery.on("key_entered", function(key, location) {
        console.log("New marker from " + key + " placed at " + location );

        new_marker_position = new google.maps.LatLng(location[0], location[1]);
        var marker = new google.maps.Marker({
            position: new_marker_position,
            animation: google.maps.Animation.DROP,
            map: map,
        });
        
        markerClusterer.addMarker(marker);

        panTo(location[0], location[1]);

        firebaseData.child(key).on("value", function(dataSnapshot) {
            var val = dataSnapshot.val();
            var content = '<div id="iw-container">' +
                              '<div class="iw-title">' + dataSnapshot.val()["place_name"] + '</div>' +
                              '<div class="iw-content">' +
                                  '<div class="iw-subTitle">Message</div>' +
                                  '<img src=' + val["place_photo"] + ' height="100" width="100">' +
                                  '<p>' + dataSnapshot.key()/*val["formatted_address"]*/ + '</p>' +
                                  /*'<div class="iw-subTitle">Message</div>' +
                                  val["formatted_phone_number"] + '<br>' +
                                  '<a href="' + val["website"] + '" target="_blank">' + val["website"] + '</a><br>' +*/
                              '</div>' +
                              '<div class="iw-bottom-gradient"></div>' +
                          '</div>';

            var infowindow = new google.maps.InfoWindow({
                content: content
            });

            infowindow_array.push(infowindow);

            for (var i in infowindow_array) {
                infowindow_array[i].close();
            }
        
            if (init == false) {
                map.setZoom(13);
                infowindow.open(map, marker);
            }

            marker.addListener('click', function() {
//                map.setCenter(this.getPosition());
                panTo(this.getPosition().lat(), this.getPosition().lng());
                map.setZoom(13);
                for (var i in infowindow_array) {
                    infowindow_array[i].close();
                }
                infowindow.open(map, marker);
            });

            // *
            // START INFOWINDOW CUSTOMIZE.
            // The google.maps.event.addListener() event expects
            // the creation of the infowindow HTML structure 'domready'
            // and before the opening of the infowindow, defined styles are applied.
            // *
            google.maps.event.addListener(infowindow, 'domready', function() {
                replaceElementsIW();
            });
        });
    });
}

function replaceElementsIW() {
    // Reference to the DIV that wraps the bottom of infowindow
    var iwOuter = $('.gm-style-iw');

    /* Since this div is in a position prior to .gm-div style-iw.
     * We use jQuery and create a iwBackground variable,
     * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
     */
    var iwBackground = iwOuter.prev();

    // Removes background shadow DIV
    iwBackground
    .children(':nth-child(2)')
    .css({
        'display' : 'none'
    });

    // Removes white background DIV
    iwBackground
    .children(':nth-child(4)')
    .css({
        'display' : 'none'
    });

    // Moves the infowindow 115px to the right.
    //iwOuter.parent().parent().css({left: '115px'});
    iwOuter
    .children(':nth-child(1)')
    .css({
        'width' : '100%',
        'min-height': '190px'
    });

    // Moves the shadow of the arrow 76px to the left margin.
    //iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

    // Moves the arrow 76px to the left margin.
    //iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

    // Changes the desired tail shadow color.
    iwBackground
    .children(':nth-child(3)')
    .find('div')
    .children()
    .css({
        'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px',
        'z-index' : '1'
    });

    // Reference to the div that groups the close button elements.
    var iwCloseBtn = iwOuter.next();

    // Apply the desired effect to the close button
    iwCloseBtn.css({
        'opacity': '1',
        'right': '38px',
        'top': '3px',
        'border': '7px solid #48b5e9',
        'border-radius': '13px',
        'box-shadow': '0 0 5px #3990B9'
    });

    // If the content of infowindow not exceed the set maximum height, then the gradient is removed.
    if ($('.iw-content').height() < 140) {
        $('.iw-bottom-gradient').css({ display: 'none' });
    }
}