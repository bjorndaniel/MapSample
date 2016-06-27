var App = {};
(function (App){
    'use strict';
    App.init = function (){
        MapFunctions.init('mapDiv');
        $(document).on('mapclicked', '#mapDiv', App.addMarker);
        $(document).on('click', '#btnCreate', App.create);
        $(document).on('click', '#btnClear', App.clear);
        $(document).on('click', '#btnPost', App.post);
    };

    App.markers = [];

    App.addMarker = function (e, latlng){
        var marker = L.marker([latlng.lat, latlng.lng], {
            icon: L.AwesomeMarkers.icon({
                icon: '',
                prefix: 'fa',
                markerColor: 'red',
                iconColor: 'white',
                html: '<span style="font-family:verdana;font-weight:bolder;"></span>'
            }),
            title: '',
            id: App.markers.length,
            latlng: latlng
        });
        App.markers.push(marker);
        MapFunctions.addMarker(marker, false);
    };

    App.clear = function (){
        MapFunctions.clearMap();
    };

    App.create = function (){
        MapFunctions.addPolygonFromMarkers();
    };

    App.post = function (){
        var modal = $('#divModal'),
        body = $('.modal-body', modal);
        $(body).html('');
        $(App.markers).each(function (i, obj){
            $(body).append($('<p>' + obj._latlng.lat + ' ' + obj._latlng.lng + '</p>'));
        });
        modal.modal('show');
    };

    $(document).ready(function (){
        App.init();
    });
}(App));
