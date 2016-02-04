
function completeAndRedirect() {
    var firebaseRef = new Firebase("https://resplendent-torch-5319.firebaseio-demo.com");
    var title = document.forms[0].elements[0].value;

    var geoFireLocation = new GeoFire(firebaseRef.child("location"));
    // put location in database
    geoFireLocation.set(title , place_location).then(function() {
        console.log("DONE");
    });
    // put data in database
    firebaseRef.child('data').child(title).set({
        "place_name": place_name,
        "place_photo": place_photo,
        "formatted_address": formatted_address,
        "formatted_phone_number": formatted_phone_number,
        "website":website
    });
    // reset form
    $('#location').val('');
    $('#title').val('');
    
    // reset variables
    place_location = [];
    place_name = "";
    place_photo = "https://62e528761d0685343e1c-f3d1b99a743ffa4142d9d7f1978d9686.ssl.cf2.rackcdn.com/files/93616/area14mp/image-20150902-6700-t2axrz.jpg";
    formatted_address = "";
    formatted_phone_number = "";
    website = "";
}