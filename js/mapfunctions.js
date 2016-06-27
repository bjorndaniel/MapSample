/*global L*/
var MapFunctions = {};
(function (MapFunctions) {
    'use strict';
    var mapServer = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
    MapFunctions.defaultCoordinates = {
        lat: 57.701286,
        lng: 11.982849
    };
    MapFunctions.isInitialized = false;
    MapFunctions.currentMap = {};
    MapFunctions.markers = {};
    MapFunctions.polygons = [];
    MapFunctions.markersCount = 0;
    MapFunctions.panOnClick = false;
    MapFunctions.divId = 'mapDiv',
    MapFunctions.init = function (divId, callback, callbackparams) {
        MapFunctions.divId = divId ? divId : MapFunctions.divId;
        MapFunctions.currentMap = L.map(MapFunctions.divId , {
            maxZoom: 17
        }).setView([MapFunctions.defaultCoordinates.lat, MapFunctions.defaultCoordinates.lng], 14);
        MapFunctions.panOnClick = false;
        MapFunctions.markersCount = 0;
        L.tileLayer(mapServer, {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(MapFunctions.currentMap);

        MapFunctions.markers = L.featureGroup();
        MapFunctions.markers.on('click', MapFunctions.markerClick).addTo(MapFunctions.currentMap);
        MapFunctions.isInitialized = true;
        MapFunctions.currentMap.on('click', MapFunctions.mapClicked);
        MapFunctions.currentMap.on('move', MapFunctions.mapMoved);
        MapFunctions.currentMap.on('dragend', MapFunctions.dragEnd);
        MapFunctions.currentMap.on('zoomend', MapFunctions.dragEnd);

        if (callback) {
            callback(callbackparams);
        }
        return MapFunctions.currentMap;
    };

    MapFunctions.zoomToFitMarkers = function (){
        if (MapFunctions.markersCount > 0){
            MapFunctions.currentMap.fitBounds(MapFunctions.markers.getBounds());
        }
    };

    MapFunctions.addMarker = function (marker, panTo){
        var ltlng = marker.getLatLng();
        marker.setLatLng(ltlng);
        marker.originalColor = marker.options.icon.options.markerColor;
        if ($.isFunction(MapFunctions.markers.addLayer)) {
            MapFunctions.markers.addLayer(marker);
            MapFunctions.markersCount += 1;
            if (panTo) {
                MapFunctions.currentMap.panTo(latlng);
            }
        }
    };

    MapFunctions.removeMarker = function (marker) {
        if ($.isFunction(MapFunctions.markers.removeLayer)) {
            MapFunctions.markers.removeLayer(marker._leaflet_id);
            MapFunctions.markersCount -= 1;
        }
    };

    MapFunctions.clearMarkers = function () {
        MapFunctions.markers.clearLayers();
    };

    MapFunctions.markerClick = function (e) {
        console.log(e.layer.options.id + ' clicked');
    };

    MapFunctions.selectMarker = function (lt, lg, panTo) {
        var marker,
            coord;
        $(MapFunctions.markers.getLayers()).toEnumerable().ForEach(function (m) {
            marker = m[0];
            coord = marker.getLatLng();
            if (coord.lat.toFixed(5) === parseFloat(lt).toFixed(5) && coord.lng.toFixed(5) === parseFloat(lg).toFixed(5)) {
                $(marker._icon).removeClass('awesome-marker-icon-' + marker.originalColor);
                $(marker._icon).addClass('awesome-marker-icon-red');
            } else {
                $(marker._icon).addClass('awesome-marker-icon-' + marker.originalColor);
                $(marker._icon).removeClass('awesome-marker-icon-red');
            }

        });
        if (panTo) {
            MapFunctions.currentMap.panTo(L.latLng(latlng.latitude, latlng.longitude));
        }
    };

    MapFunctions.unselectAll = function () {
        var marker;
        $(MapFunctions.markers.getLayers()).toEnumerable().ForEach(function (m) {
            marker = m[0];
            $(marker._icon).addClass('awesome-marker-icon-' + marker.originalColor);
            $(marker._icon).removeClass('awesome-marker-icon-red');

        });
    };

    MapFunctions.clearMap = function () {
        MapFunctions.currentMap.removeLayer(MapFunctions.markers);
        MapFunctions.markers = L.featureGroup();
        MapFunctions.markers.on('click', MapFunctions.markerClick).addTo(MapFunctions.currentMap);
        MapFunctions.markersCount = 0;
        MapFunctions.clearPolygons();
    };

    MapFunctions.mapClicked = function (e) {
        $('#' + MapFunctions.divId).trigger('mapclicked', e.latlng);
        if (MapFunctions.panOnClick) {
            MapFunctions.currentMap.panTo(e.latlng);
        }
    };

    MapFunctions.mapMoved = function (e) {
        $('#' + MapFunctions.divId).trigger('mapmoved', e);
    };

    MapFunctions.dragEnd = function (e) {
        $('#' + MapFunctions.divId).trigger('dragend', e);
    };

    MapFunctions.addPolygon = function (coords){
        var polygon = L.polygon(coords);
        MapFunctions.polygons.push(polygon);
        MapFunctions.currentMap.addLayer(polygon);
    };

    MapFunctions.addPolygonFromMarkers = function (){
        var latlng = [];
        $(MapFunctions.markers.getLayers()).each(function (i, m){
            latlng.push(m._latlng);
        });
        MapFunctions.addPolygon(latlng);
    };

    MapFunctions.clearPolygons = function (){
        $(MapFunctions.polygons).each(function (i, obj){
            MapFunctions.currentMap.removeLayer(obj);
        });
    };

    $('body').on('onresize', '#divdetail-view-main', function () {
        if (MapFunctions.currentMap && $.isFunction(MapFunctions.currentMap._onResize)){
            MapFunctions.currentMap._onResize();
        }
    });

}(MapFunctions));