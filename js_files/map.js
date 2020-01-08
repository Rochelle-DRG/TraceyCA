
// GLOBAL VARIABLES DECLARED
var map, view;
// function highlightBeaverLakePark() {}; //creates a polygon

//function hideHighlight(){}; //removes all polygons created


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

            // InfoTemplate,           //these for highlighting existing polygon
            // SimpleLineSymbol,
            Query,
            QueryTask,
            // Draw,
            // parser,
            // arrayUtil,
            // Color,

            on,
            dom,
            arrayUtils,
            domStyle                   //this for Hover over map experiment
        ) {

            // $.each(mapLayers, function(k, item){
            //     // this line adds the wms layer source through the cors garbage
            //     esriConfig.request.corsEnabledServers.push(item.url);
            // });



            // Declaration of our map
            map = new Map({
                basemap: basemap || 'satellite',
                ground: "world-elevation"
            });

            // in the 4.6 api the view is a separate decalration, we do that here
            view = new MapView({
                container: containerID || "mapDiv",
                center: center || [-121.448637, 37.724050],
                map: map, // references the map above
                zoom: 12 || zoom,
                viewingMode: "local",
                popup: {
                    autoCloseEnabled: true,
                    dockOptions: { position: "bottom-left" }
                },
                ui: { components: ["attribution", "zoom"] },
                spatialReference: 3857
            });

            // elevationLayer = new ElevationLayer({
            //     url: "https://gis.davey.com/arcgis/rest/services/Sammamish/SAM_dem/ImageServer",
            //     visible: false
            // });

            // map.ground.layers.add(elevationLayer);


            view.then(function () {


                var basemapToggle = new BasemapToggle({
                    view: view,
                    nextBasemap: "streets"
                });

                // LayerList widget declaration
                // var layerList = new LayerList({
                //     view: view
                // });
                // view.ui.add(layerList, {position: "bottom-left"}); // probably only useful for development

                view.ui.add(basemapToggle, "bottom-right");


            }).otherwise(function (err) {
                // A rejected view indicates a fatal error making it unable to display,
                // this usually means that WebGL is not available, or too old.
                console.error("SceneView rejected:", err);
            });


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
                } else if (item.type === "TileLayer"){
                    newLayer = new TileLayer({
                        // name: k,
                        title: item.title,
                        // opacity: item.opacity,
                        visible: false,
                        url: item.url,
                        // popupEnabled: false,
                        legendEnabled: item.legend,
                        // sublayers: [{
                        //     name: item.layername,
                        // }]
                    });
                } else if (item.type === "MapImageLayer"){
                    newLayer = new MapImageLayer ({
                        // name: k,
                        title: item.title,
                        // opacity: item.opacity,
                        visible: false,
                        url: item.url,
                        // popupEnabled: false,
                        legendEnabled: item.legend,
                        // sublayers: [{
                        //     name: item.layername,
                        // }]
                        
                    });
                   


                    /** if not a tiled layer and has a popup*/
                } else if (item.type !== "tiled" && item.popup === true) {              /// Here I am
                    // adding a line break in between every popup item
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
                        popupTemplate: template
                    });

                } else if (item.type === "tiled") {
                    newLayer = new TileLayer({
                        name: k,
                        visible: false,
                        title: item.title,
                        url: item.url,
                        opacity: item.opacity
                    });

                    identURL = item.url;
                    identTitle = item.title;
                    var identArray = item.popupContent;
                    identPopup = "";
                    for (i = 0; i < identArray.length; i++) {
                        identPopup += identArray[i] + "<br>";
                    }


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
                // console.log(newLayer);
                // console.log("item.order is: "+item.order);
                // console.log("map.layers is: "+map.layers);
                // console.log("maplayers is: "+mapLayers);
                // console.log("mapPoints[slide2].featureArray: "+mapPoints[slide2].featureArray);


            });     //end .each
            // the following code handles the popups for the one tile layer
            view.then(function () {
                // executeIdentifyTask() is called each time the view is clicked
                on(view, "click", executeIdentifyTask);

                // Create identify task for the specified map service
                identifyTask = new IdentifyTask(identURL);

            });

            // Executes each time the view is clicked
            // looks 
            function executeIdentifyTask(event) {
                $.each(map.layers.items, function (key, value) {
                    console.log(map.layers.items);
                    var testName = value.title;
                    var testVis = value.visible;
                    // identTitle = "";

                    if ((testName === identTitle) && testVis === true) {

                        popupSet();
                        //ALL THIS  apparently not even needed
                        //     popupSet = function(){
                        //     // Set the parameters for the Identify
                        //     params = new IdentifyParameters();
                        //     params.tolerance = 3;
                        //     params.layerIds = [0];
                        //     params.layerOption = "visible";
                        //     params.width = view.width;
                        //     params.height = view.height;

                        //     // Set the geometry to the location of the view click
                        //     params.geometry = event.mapPoint;
                        //     params.mapExtent = view.extent;
                        //     dom.byId("mapDiv").style.cursor = "wait";

                        //     // This function returns a promise that resolves to an array of features
                        //     // A custom popupTemplate is set for each feature based on the layer it
                        //     // originates from
                        //     identifyTask.execute(params).then(function (response) {
                        //         // console.log(response);  //nothing will console out from within this function
                        //         var results = response.results;
                        //         // console.log(results);
                        //         return arrayUtils.map(results, function (result) {

                        //             var feature = result.feature;
                        //             var layerName = result.layerName;


                        //             feature.popupTemplate = { // autocasts as new PopupTemplate()
                        //                 title: layerName,
                        //                 content: identPopup,
                        //                 actions: [{ id: "zoom-to", visible: false }]
                        //             };
                        //             return feature;
                        //         }); // end "return arrayUtile.map...""


                        //     }).then(showPopup); // Send the array of features to showPopup()  // end "identifyTask.execute(params)."

                        //     // Shows the results of the Identify in a popup once the promise is resolved
                        //     function showPopup(response) {
                        //         if (response.length > 0) {
                        //             view.popup.open({
                        //                 features: response,
                        //                 location: event.mapPoint
                        //             });
                        //         }
                        //         dom.byId("mapDiv").style.cursor = "auto";
                        //     }      // end showPopup
                        // }       //end popupSet
                    }       //end "if"
                });     //end /each
            }           //end executeIdentifyTask







            //Here making a hard-coded polygon that will appear when the park is moused over
            // defineHighlights = function () {
            // highlightBeaverLakePark = function () {
            var beaverLakePolygon = new Polygon({
                rings: [
                    [-122.057488, 47.641673],
                    [-122.054405, 47.641973],
                    [-122.054532, 47.639424],
                    [-122.051513, 47.639574],
                    [-122.047476, 47.637089],
                    [-122.047542, 47.632034],
                    [-122.049290, 47.631370],
                    [-122.050592, 47.633491],
                    [-122.052468, 47.632806],
                    [-122.052659, 47.628950],
                    [-122.054566, 47.628608],
                    [-122.055646, 47.630493],
                    [-122.059873, 47.628351],
                    [-122.061176, 47.629165],
                    [-122.057426, 47.632121],
                    [-122.061430, 47.632742],
                    [-122.061271, 47.633834],
                    [-122.059650, 47.634113],
                    [-122.059682, 47.635205],
                    [-122.062193, 47.635141],
                    [-122.063115, 47.636105],
                    [-122.061716, 47.636683],
                    [-122.061398, 47.640945],
                    [-122.059840, 47.641031],
                    [-122.058633, 47.636897],
                    [-122.057797, 47.636514]
                ]
            });
            //     //create a symbol for rendering the graphic
                var highlightFillSymbol = new SimpleFillSymbol({                // This is only turned on to test the Hover polygon with
                    color: [255, 247, 125, 0.9],
                    outline: {
                        color: [99, 159, 255],
                        width: 2
                    }
                });

                //add the geometry and symbol to a new graphic
                // var highlightedPolygonGraphic = new Graphic({
                //     geometry: beaverLakePolygon,
                //     symbol: highlightFillSymbol,
                //     visible: true
                // });

            //     view.graphics.add(highlightedPolygonGraphic);


            // };      //end highlightBeaverStatePark
            //    };          //end defineHighlightBeav....
            // defineHighlights(); 
            /// End create brand new polygon
            /// Begin highlight existing polygon pulled from REST

            highlightParkOnHover = function (parkNameForHightlight) {
                // map.graphics.clear(); // when active, there are no polygon highlights

                //Define query SQL Expression
                var query = new Query();                      //maybe this is old and nolong supported
                query.where = "NAME like '%" + parkNameForHightlight + "%'"
                query.outFields = ["*"];
                query.returnGeometry = true;
                query.returnCentroid = true;

                // Define the query task
                var queryTask = new QueryTask({
                    url: "https://gis.davey.com/arcgis/rest/services/Sammamish/SammamishFeatures/MapServer/2"
                });           // end queryTask



                //Execute the query when mouseover text
                queryTask.execute(query)

                    .then(function (result) {
                        result.features.forEach(function (item) {

                            var gCentroid = item.geometry.centroid;
                            var g = new Graphic({
                                geometry: item.geometry,
                                attributes: item.attributes,
                                centroid: item.centroid,
                                symbol: {
                                    type: "simple-line",
                                    color: [255, 247, 128],
                                    width: 2,
                                    style: "short-dot"
                                },  //end symbol
                            });     //end new Graphic
                            view.graphics.add(g);
                            zoomToTheData();



                            popupParkOnHover(g.attributes, gCentroid);
                            // console.log(item.geometry);

                        });      //end forEach

                        // Zoom to the data returned
                        // view.when(function () {                     //causes the popups to close, revisit when popups are correct
                        //     view.goTo({
                        //         target: view.graphics.toArray()
                        //     });     //end goTo
                        // });    //end .when

                    })          //end first .then
                    .otherwise(function (e) {
                        console.log(e);
                    });         //end .otherwise




                var theLengthImLookingFor;
                //### Is this Point inside a Park, if so which one?

                var testPointTrue = new Point({ //this point is within the beaverLakePolygon test polygon
                    longitude: -122.056130,
                    latitude: 47.635455
                });

                var testPointFalse = new Point({
                    longitude: -122.083510,
                    latitude: 47.631493
                });

                var testPointCanada = new Point({
                    longitude: -138.178243,
                    latitude: 59.744037
                });

                //Takes a polygon and a point                                   //This is where the Hover function starts
                isThisPointInAPark = function (mousePoint) {
                    // console.log(beaverLakePolygon.contains(testPointTrue)); // this works, true
                    // console.log(beaverLakePolygon.contains(testPointFalse));  // this works, false
                    // console.log(beaverLakePolygon.contains(testPointCanada)); // this works, false

                    var isItInQuery = new Query();
                    isItInQuery.where = "NAME like '%" + '' + "%'"   // change this later
                    isItInQuery.outFields = ["*"];
                    isItInQuery.returnGeometry = true;      //going to use this geometry to view the park we are testing
                    isItInQuery.returnCentroid = true;

                    queryTask.execute(isItInQuery)
                        .then(function (result) {           //result is an all the parks from the query
                            theLengthImLookingFor = result.features.length;

                            // see if the point is inside each park
                            for (i = 0; i < theLengthImLookingFor; i++) {
                                // console.log("The index we are on is: "+i);
                                // console.log("The park we are checking is: "+result.features[i].attributes.name);
                                // console.log("The point we are checking is: lat" + mousePoint.latitude + ", long "+ mousePoint.longitude);
                                // console.log(result.features[i].geometry.rings); //returns an array with 231 rings
                                // console.log(itemRings); //undefined
                                var itemRings = result.features[i].geometry.rings;
                                var itemPolygon = new Polygon({
                                    rings: itemRings
                                    // rings: result.features[i].geometry.rings
                                });
                                // console.log(itemPolygon.rings);// is undefined, but it should be rings
                                // console.log(beaverLakePolygon.rings);

                                var isItIn = itemPolygon.contains(mousePoint);
                                // console.log(isItIn); //returns true or false
                                if (isItIn = true){
                                    // console.log("True: This point is in our polygon?"+ isItIn);

                                    var highlightedPolygonGraphic = new Graphic({
                                        geometry: itemPolygon,
                                        symbol: highlightFillSymbol,
                                        visible: true
                                    });

                                    view.graphics.add(highlightedPolygonGraphic);

                                    break
                                } else {
                                    // console.log("False: This point is not in our polygon" + isItIn)
                                };
            



                                // console.log(result.features);
                                // console.log(result.features[0]);
                                // console.log(result.features[0].geometry);
                                // console.log(result.features[0].geometry.rings); //returns [Array(97)]

                                // console.log(result.features.name);       undefined
                                // console.log(result.features.store);      undefined
                                // console.log(result.features[0].attributes); //returns the attributes need for popup
                                // console.log(result.features[0].attributes.name); //returns that name
                                // // console.log(result.length); //undefined
                                // console.log(result.features.length);    //this is the length we need


                            };                                            //end for loop
                        })                                                          //end .then
                        .otherwise(function (e) {
                            console.log(e);
                        });                                                         //end .otherwise
                };                                                                  //end isThisPointInAPark

                



                //Inside HighlightParkOnHover Function, creating popup
                popupParkOnHover = function (gAttributes, gCentroid) {
                    // console.log(visibleLayers[1].title); //the current layer, global variable from map_controller, 
                    view.popup.autoOpenEnabled = true;
                    view.popup.open({
                        title: "" + visibleLayers[1].title,
                        location: /*graphic.centroid, */ gCentroid, //graphicCentroid,
                        // content: ""+visibleLayers[1].popupContent.join("</br>")
                        content:
                            "<br/>Name: " + gAttributes.name +
                            "<br/>Type: " + gAttributes.type +
                            "<br/>Canopy Acres: " + gAttributes.canopy_acres.toFixed(2) +
                            "<br/>Canopy %: " + gAttributes.canopy_percent.toFixed(2)

                    });  //end "view.popup.open"


                }   // end HighlightParkOnHover
                // popupParkOnHover();


            };      //end HighlightParkOn

            //Here being highlight of polygon pulled from existing layers already loaded
            hideHighlight = function () { //sets the global function to remove the polygon
                view.graphics.removeAll();
            };
            resetZoomAndCenter = function () {
                view.zoom = 13;
                view.goTo({
                    target: [-122.035534, 47.616567]
                })  //end "view.goTo"
            };      //end resetZoomAndCenter


            //Really trying to make a popup/highlight happen when hover over map
            view.on('pointer-move', function (evt) {
                view.hitTest(evt).then(function (r) {
                    // highlightParkOnHover('Sahalee Golf & Country Club');
                    //This is currently using the parkname to run this method (beautifully!)
                    // BUT can we get the parkname from the event???? which contains latidue and longitude?
                    // Try runing a query to search?


                    // console.log(r);
                    // console.log(r.results);
                    // console.log(r.results[0]);
                    // console.log(r.results[0].mapPoint);
                    // console.log(r.results[0].mapPoint.latitude); //success
                    // console.log(r.results[0].mapPoint.store); //undefined
                    // console.log(r.results[0].store); //undefined

                    var mousePoint = new Point({
                        longitude: r.results[0].mapPoint.longitude,
                        latitude: r.results[0].mapPoint.latitude
                    });

                    isThisPointInAPark(mousePoint);
                    

                });
            });












            //                                                          // hitTest: Returns the topmost feature from each layer that intersects the specified screen coordinates.
            //             view.on('pointer-move', function(evt){
            //                console.log("I'm trying!")/
            //                 view.hitTest(evt).then(function(r){
            //                     heyMessage= "here";
            //                     console.log(r);                                  //returns an object
            //                     console.log(r.results);                          //returns an array with 1 object
            //                     console.log(r.results[0]);                       //returns the 1 object with a mapPoint and a null Graphic
            //                     console.log(r.results[0].mapPoint.latitude);
            //                     console.log(r.results.length);
            //  //                   console.log(r.screenPoint); //returns an array with 2 objects, that don't look very useful right now -0.000, 567 screen coordinates?

            //                 console.log(r[0].mapPoint.cache.latitude);
            //                     if(r.results.length > 0 && r.results[0].graphic) {          //I need to replace the .graphic with something that will
            //                         domStyle.set('hover', 'display', 'block');              // actually compare whether or not there is date for that point
            //                         domStyle.set('hover', 'top', evt.y + 'px');             // in the current layer
            //                         domStyle.set('hover', 'left', evt.x + 'px');
            //                         console.log(r.results[0].graphic);
            //                         // heyMessage = r.results.lenth;
            //                         // console.log(heyMessage);
            //                     } else {
            //                         domStyle.set('hover', 'display', 'none');
            //                         // heyMessage = "There is no point!";
            //                         // console.log(heyMessage);
            //                     }
            //                 });     //end hitTest
            //             });         //end view.on('pointer-move', the first hover experiment








        })              /*end require & function*/;
};                      // end createMap
