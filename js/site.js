var App = {};
(function(App){
    'use strict';
    App.init = function(){
        MapFunctions.init('mapDiv');
        $(document).on('mapclicked', '#mapDiv', App.addMarker)
    };

    App.markers = [];

    App.addMarker = function(e, latlng){
        console.log(latlng);
    };

    $(document).ready(function (){
        App.init();
    });
}(App));