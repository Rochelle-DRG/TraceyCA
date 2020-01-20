
// GLOBAL VARIABLES DECLARED
var map, view;

/** Creates the map and the view */
var createMap = function (basemap, zoom, center, containerID) {
    require([
        "esri/Map",
        "esri/views/MapView",
        "esri/views/SceneView",
        "esri/layers/FeatureLayer",
        "esri/layers/ElevationLayer",
        "esri/layers/WMSLayer",
        "esri/layers/TileLayer",
        "esri/layers/MapImageLayer",
        "esri/layers/support/WMSSublayer",
        "esri/widgets/Legend",
        "esri/widgets/LayerList",
        "esri/widgets/BasemapToggle",
        "esri/widgets/Popup",
        "esri/layers/ImageryLayer",
        "esri/tasks/IdentifyTask",
        "esri/tasks/support/IdentifyParameters",
        "esri/config",
        "esri/Graphic",                         //these 3 for making new polygons
        "esri/geometry/Polygon",
        "esri/symbols/SimpleFillSymbol",
        "esri/geometry/Point",                 // for isThisPointInAPark
        "esri/tasks/support/Query",            //these for highlight existing polygon
        "esri/tasks/QueryTask",
        "dojo/dom-style",                       // part of Hover over map experiment
        "dojo/on",
        "dojo/dom",
        "dojo/_base/array",
        "dojo/domReady!",
    ],
        function (
            Map,
            MapView,
            SceneView,
            FeatureLayer,
            ElevationLayer,
            WMSLayer,
            TileLayer,
            MapImageLayer,
            WMSSublayer,
            Legend,
            LayerList,
            BasemapToggle,
            Popup,
            ImageryLayer,
            IdentifyTask,
            IdentifyParameters,
            esriConfig,
            Graphic,                //these for making new polygon
            Polygon,
            SimpleFillSymbol,
            Point,                  // for isThisPointInAPark
            Query,
            QueryTask,
            on,
            dom,
            arrayUtils,
            domStyle                   //this for Hover over map experiment
        ) {

            // Declaration of our map
            map = new Map({
                basemap: basemap || 'satellite',
                ground: "world-elevation"
            });

            // in the 4.14 api the view is a separate decalration, we do that here
            view = new MapView({
                container: containerID || "mapDiv",
                center: center || [-121.448637, 37.724050],
                map: map, // references the map above
                constraints: {
                    minZoom: 13,
                    maxZoom: 19
                },
                // zoom: 12 || zoom,
                viewingMode: "local",
                popup: {
                    autoCloseEnabled: true,
                    dockOptions: { position: "bottom-left" }
                },
                ui: { components: ["attribution", "zoom"] },
                spatialReference: 3857
            });

            var basemapToggle = new BasemapToggle({
                view: view,
                nextBasemap: "streets"
            });

            // LayerList widget declaration
            var layerList = new LayerList({
                view: view
            });
            // view.ui.add(layerList, {position: "bottom-left"}); // probably only useful for development

            view.ui.add(basemapToggle, "bottom-right");
            
            /**adding every layer that is returned from our DB,
             * depending on the layer type we assign it as an imagery layer or featurelayer
             */

            $.each(mapLayers, function (k, item) {
                // this line adds the wms layer source through the cors
                esriConfig.request.corsEnabledServers.push(item.url);
                // console.log("-Adding: " + item.title + ", Legend: " + item.legend);
                // imagery based layers get special treatment
                var newLayer;
                if (item.type === "raster") {
                    newLayer = new WMSLayer({
                        name: k,
                        title: item.title,
                        opacity: item.opacity,
                        visible: false,
                        url: item.url,
                        popupEnabled: false,
                        legendEnabled: item.legend,
                        sublayers: [{
                            name: item.layername,
                        }]
                    });
                    /** if not a tiled layer and has a popup*/
                } else if (item.type !== "tiled" && item.popup === true) {              
                    // Here we are adding a line break in between every popup item
                    var content = item.popupContent.join("</br>");

                    var template = {
                        title: item.title,
                        content: content
                    };

                    newLayer = new FeatureLayer({
                        name: k,
                        title: item.title,
                        url: item.url,
                        spatialReference: 3857,
                        visible: false,
                        labelsVisible: true,
                        legendEnabled: item.legend,
                        outfields: ["*"],
                        popupTemplate: template,
                        definitionExpression: item.filter
                    });

                    /** Finally add a non raster layer with no popup */
                } else {
                    newLayer = new FeatureLayer({
                        name: k,
                        title: item.title,
                        url: item.url,
                        spatialReference: 3857,
                        visible: false,
                        labelsVisible: true,
                        legendEnabled: item.legend,
                        popupEnabled: false
                    });
                }

                map.layers.add(newLayer, item.order);

            });  //end .each

        }) /*end require & function*/;
}; // end createMap
