/** Wrapper for the main controller thingys */
var enableMainControls = function() {

/** Will take an input ID and matches it to an entry in the mapPoints dictionary
 *  and display\hide the appropriate divs based on viewType
 */
    function mapOrDetailed(itemID) {
        if(mapPoints[itemID].viewType == "map"){
            $("#mapDiv").show("slow");
            $(".new-wave-legend").show("fast");
            $("#detailDiv").hide("slow");
        } else if (mapPoints[itemID].viewType == "detailed"){
            // making sure the div is empty
            $("#detailDiv").empty();
            // adding data to the clean div
            $("#detailDiv").append(mapPoints[itemID].featureArray[0]);
            // showing new div
            $("#detailDiv").show("slow");
            // hiding the map div
            $("#mapDiv").hide("slow");
            $(".new-wave-legend").hide("fast");
        }
    }

    mobileDetailToggle = function() {
        // get the current height of the page and detail area
        var pageHeight = $(this).height();
        var detailHeight = pageHeight - $("#myCarousel").height();
        
        $('.car-item-container').height(detailHeight);
        // test to see if the window is open
        if($('.carousel-inner').height() < pageHeight) {
            $('.carousel-inner').height(pageHeight);
            $(".car-item-container").slideToggle("slow");
        } else {
            $('.carousel-inner').height($("#myCarousel").height());
            $(".car-item-container").slideToggle("slow");
        }
    };


    /** making the mobile stuff open and close */
    mobileOpener = function() {
        $(".car-item-container").slideToggle("slow");
    };
    /** Another hacky way to get the mobile stuff to start closed */
    mobileOpener();

    // The scrollspy triggers every time you scroll enough to change elements.
    // Using this to our advantage, and triggering fade in and out of elements and map changes.
    $('[data-spy="scroll"]').on('activate.bs.scrollspy', function () {
        // reading the "navDot" list items, scroll spy will mark one of these as active
        // we get the ID of the active one and use it to do fancy fade in and out of our nav elements
        var id = $("a.list-group-item.list-group-item-action.active")[0].hash;
        // console.log("Showing desktop slide: " + id);
        // fade speed and opacity
        $(this).find(".mySlide").fadeTo("slow", 0.4);
        $(this).find(id).fadeTo("fast", 1.0);
        
        // removing the leading #
        id = id.substring(1);
        

        // here is the logic for either showing the map or to show something else
        mapOrDetailed(id);
        showmetheLayers(id);
        zoomToExtent(id);
    });
    

    // Mobile page controlls
    // the only way that seemed to work for killing the auto scroll
    $('#myCarousel').carousel({interval: false});
    
    $('#myCarousel').on('slide.bs.carousel', function (evt) {
        // Every time you scroll the carousel, we check to see if the info panel is currently open
        // if yes then we close the current element and open the next one
        var standardID = "slide" + ((evt.to) + 1);
        var mobileID = "#mobslide" + ((evt.from) + 1);
        var nextMobileID = "#mobslide" + ((evt.to) + 1);
    
        
        // here is the logic for either showing the map or to show something else
        mapOrDetailed(standardID);
        showmetheLayers(standardID);
        zoomToExtent(standardID);
        console.log("Showing mobile slide: " + nextMobileID);
    });


};

