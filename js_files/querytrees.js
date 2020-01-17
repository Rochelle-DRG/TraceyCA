require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/geometry/geometryEngine",
    "esri/Graphic",
    "esri/widgets/Slider"
  ], function(
    Map,
    MapView,
    FeatureLayer,
    GraphicsLayer,
    geometryEngine,
    Graphic,
    Slider
  ) {
    var quakesUrl =
      "https://gis.davey.com/arcgis/rest/services/TracyCA/TracyCA_2020/MapServer/8";

    var wellBuffer, wellsGeometries, magnitude;

    var wellTypeSelect = document.getElementById("well-type");

    var magSlider = new Slider({
      container: "mag",
      min: 0,
      max: 5,
      steps: 0.1,
      values: [2],
      rangeLabelsVisible: true,
      labelsVisible: true
    });

    var distanceSlider = new Slider({
      container: "distance",
      min: 100,
      max: 10000,
      steps: 100,
      labelFormatFunction: function(value, type) {
        if (type === "value") {
          return parseInt(value);
        }
        return value;
      },
      values: [5000],
      rangeLabelsVisible: true,
      labelsVisible: true
    });

    var queryQuakes = document.getElementById("query-quakes");

    // oil and gas wells
    var wellsLayer = new FeatureLayer({
      portalItem: {
        // autocasts as new PortalItem()
        id: "8af8dc98e75049bda6811b0cdf9450ee"
      },
      outFields: ["*"],
      visible: false
    });

    // historic earthquakes
    var quakesLayer = new FeatureLayer({
      url: quakesUrl,
      outFields: ["*"],
      visible: false
    });

    // GraphicsLayer for displaying results
    var resultsLayer = new GraphicsLayer();

    var map = new Map({
      basemap: "dark-gray",
      layers: [wellsLayer, quakesLayer, resultsLayer]
    });

    var view = new MapView({
      container: "viewDiv",
      map: map,
      center: [-97.75188, 37.23308],
      zoom: 10
    });
    view.ui.add("infoDiv", "top-right");

    // query all features from the wells layer
    view
      .when(function() {
        return wellsLayer.when(function() {
          var query = wellsLayer.createQuery();
          return wellsLayer.queryFeatures(query);
        });
      })
      .then(getValues)
      .then(getUniqueValues)
      .then(addToSelect)
      .then(createBuffer);

    // return an array of all the values in the
    // STATUS2 field of the wells layer
    function getValues(response) {
      var features = response.features;
      var values = features.map(function(feature) {
        return feature.attributes.STATUS2;
      });
      return values;
    }

    // return an array of unique values in
    // the STATUS2 field of the wells layer
    function getUniqueValues(values) {
      var uniqueValues = [];

      values.forEach(function(item, i) {
        if (
          (uniqueValues.length < 1 || uniqueValues.indexOf(item) === -1) &&
          item !== ""
        ) {
          uniqueValues.push(item);
        }
      });
      return uniqueValues;
    }

    // Add the unique values to the wells type
    // select element. This will allow the user
    // to filter wells by type.
    function addToSelect(values) {
      values.sort();
      values.forEach(function(value) {
        var option = document.createElement("option");
        option.text = value;
        wellTypeSelect.add(option);
      });

      return setWellsDefinitionExpression(wellTypeSelect.value);
    }

    // set the definition expression on the wells
    // layer to reflect the selection of the user
    function setWellsDefinitionExpression(newValue) {
      wellsLayer.definitionExpression = "STATUS2 = '" + newValue + "'";

      if (!wellsLayer.visible) {
        wellsLayer.visible = true;
      }

      return queryForWellGeometries();
    }

    // Get all the geometries of the wells layer
    // the createQuery() method creates a query
    // object that respects the definitionExpression
    // of the layer
    function queryForWellGeometries() {
      var wellsQuery = wellsLayer.createQuery();

      return wellsLayer.queryFeatures(wellsQuery).then(function(response) {
        wellsGeometries = response.features.map(function(feature) {
          return feature.geometry;
        });

        return wellsGeometries;
      });
    }

    // creates a single buffer polygon around
    // the well geometries

    var bufferGraphic = null;
    function createBuffer(wellPoints) {
      var bufferDistance = distanceSlider.values[0];
      var wellBuffers = geometryEngine.geodesicBuffer(
        wellPoints,
        [bufferDistance],
        "meters",
        true
      );
      wellBuffer = wellBuffers[0];

      if (bufferGraphic) {
        bufferGraphic.geometry = wellBuffer;
      } else {
        // add the buffer to the view as a graphic
        bufferGraphic = new Graphic({
          geometry: wellBuffer,
          symbol: {
            type: "simple-fill", // autocasts as new SimpleFillSymbol()
            outline: {
              width: 1.5,
              color: [255, 128, 0, 0.5]
            },
            style: "none"
          }
        });
        view.graphics.add(bufferGraphic);
      }
    }

    // Get the magnitude value set by the user
    magSlider.on("thumb-drag", function(event) {
      magnitude = event.value;
    });
    // create a buffer around the queried geometries
    distanceSlider.on("thumb-drag", function(event) {
      if (event.state === "stop") {
        createBuffer(wellsGeometries);
      }
    });
    // set a new definitionExpression on the wells layer
    // and create a new buffer around the new wells
    wellTypeSelect.addEventListener("change", function() {
      var type = event.target.value;
      setWellsDefinitionExpression(type).then(createBuffer);
    });

    // query for earthquakes with the specified magnitude
    // within the buffer geometry when the query button
    // is clicked
    queryQuakes.addEventListener("click", function() {
      queryEarthquakes().then(displayResults);
    });

    function queryEarthquakes() {
      var query = quakesLayer.createQuery();
      query.where = "mag >= " + magSlider.values[0];
      query.geometry = wellBuffer;
      query.spatialRelationship = "intersects";

      return quakesLayer.queryFeatures(query);
    }

    // display the earthquake query results in the
    // view and print the number of results to the DOM
    function displayResults(results) {
      resultsLayer.removeAll();
      var features = results.features.map(function(graphic) {
        graphic.symbol = {
          type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
          style: "diamond",
          size: 6.5,
          color: "darkorange"
        };
        return graphic;
      });
      var numQuakes = features.length;
      document.getElementById("results").innerHTML =
        numQuakes + " earthquakes found";
      resultsLayer.addMany(features);
    }
  });