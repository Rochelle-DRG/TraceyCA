/** just a function wrapper so that i can delay code execution until after the JSON loads */
var enableMapControls = function () {

    /** bit of a helper function that Returns a map layer given a layer name (layer1, layer2 etc..) */
    var layerFind = function (layerID) {
        for (var i = 0; i < (map.layers).length; i++) {
            if (map.layers.items[i].name == layerID) {
                // console.log("map.layers.items[i]: " + map.layers.items[i]);
                // console.log("map.layers.items[1]: " + map.layers.items[1]);

                return map.layers.items[i];
            }
        }
    };

    /** Will hide all layers, then only make visible the layers that each slide request
     * This takes a Slide ID as input 
     */
    showmetheLayers = function (someID) {
        // only mess with visibility if we are seeing a map view
        visibleLayers = [];                                         //global variable so it can be accessed in map.js
        // console.log("someID: " + someID);
        if (mapPoints[someID].viewType !== "detailed") {
            // console.log("mapPoints[someID].viewType: "+ mapPoints[someID].viewType);
            // Turning all the layers off
            for (var i = 0; i < (map.layers).length; i++) {
                map.layers.items[i].visible = false;
            }

            /** a way to make things do what i want, hiding all legends then turning on the ones needed */
            $(".legend-item-contain").hide();

            // finding the names we want to see and looping through
            var layerArray = mapPoints[someID].featureArray;
            // console.log("mapPoints[someID].featureArray: "+mapPoints[someID].featureArray);
            for (var lyr in layerArray) {
                var layerName = layerArray[lyr]; // getting a layer name to pass into layer finder
                var showLayer = layerFind(layerName); // "layer1" will return the map layer object with that same name
                // console.log(showLayer);
                showLayer.visible = true;
                visibleLayers.push(showLayer);

                // now we gotta work out what divs are shown in the legend div
                if (showLayer.legendEnabled === true) {
                    var shortName = (showLayer.title).replace(/\s/g, '');
                    // console.log("#" + shortName);
                    $("#" + shortName).toggle("slow");
                }
            }
        }
    };

    /** Takes a layer name as input, and will toggle the layer, and its legends visibility */
    layerToggle = function (layer) {
        var layerID = layer.id;
        // toggle layer object visibility
        var lyrObj = layerFind(layerID);
        if (lyrObj.visible === true) {
            lyrObj.visible = false;
            if (lyrObj.legendEnabled === true) {
                $("#" + mapLayers[layerID].layername).hide();
            }
        } else {
            lyrObj.visible = true;
            if (lyrObj.legendEnabled === true) {
                $("#" + mapLayers[layerID].layername).show();
            }
        }

    };


    /** zooms to the extent of the given layer */
    zoomToExtent = function (someID) {
        //console.log(someID);
        var opts = {
            duration: 1500  // Duration of animation will be 1.5 seconds
        };

        var zoomTarget = mapPoints[someID].searchLayer;
        var zoomFld = mapPoints[someID].searchFld;
        var zoomAttribute = mapPoints[someID].searchAttr;

        if (zoomTarget !== "") {
            var lookAT = layerFind(zoomTarget); // returns a map layer

            if (zoomAttribute !== "") { // only if there is a specific thing to look at
                var subExpression = zoomFld + " = '" + zoomAttribute + "'";
                //console.log(subExpression);
                lookAT.definitionExpression = subExpression;
                lookAT.when(function () { // when layer is loading
                    return lookAT.queryExtent();
                })
                    .then(function (response) {
                        view.goTo((response.extent).expand(1.25), opts);
                        // we have to clear the definition expression right after we zoom to it because
                        // otherwise only the zoomed element will be visible until it is set again
                        subExpression = zoomFld + " <> ''";
                        lookAT.definitionExpression = subExpression;
                    });

            } else { // if there isnt something specific to focus on, we just look at the full extent
                lookAT.when(function () { // when layer is (done?) loading
                    return lookAT.queryExtent();
                })
                    .then(function (response) {
                        view.goTo((response.extent).expand(1.2), opts); // default zoom to extent is a little tight, expand helps that
                    });
            }
        }
    };//end zoomToExtent

    buttonLayerShow = function(buttonLayer){
        layersToTurnOn = [];
        console.log(map.layers);

        //turn off all of the layers
        map.layers.forEach(layer => {
            layer.visible = false
        });

        //get the border layer and button layer
        var turnOnLayers = map.layers.filter(function(layer){
            return (layer.name == "Layer1" || layer.name == buttonLayer)
        });
        
        console.log(turnOnLayers);
        //turn them on
        turnOnLayers.forEach(layer => {
            layer.visible = true;
        });
    }

};