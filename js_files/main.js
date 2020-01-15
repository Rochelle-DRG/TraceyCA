/** This controller request the Json data from our data source, the data is then parsed and used to generate the page
 * only after this data is returned and delt with do the remaining controllers get called.
 */
"use strict";

$.ajax({ crossDomain: true });

var mapPoints = {};
var mapLayers = {};


// Returning info from our "DB"
$.getJSON("ajax/page.json", function (data) {
    var slides = [];
    var buttons = [];
    var mob_car_ind = [];
    var mob_car_slides = [];

    // forming a dict of layers to populate the map with in the next step
    $.each(data.Layers, function (k, layer) {
        mapLayers[k] = layer;
    });

    // Loop each slide
    $.each(data.slides, function (k, json_slide) {
        // THe index is used for the mobile slides somehow
        var index = Object.keys(data.slides).indexOf(k);

        // Non local variable for doing things with map points
        mapPoints[k] = json_slide.MapAttributes;

        // here we get real fancy like, SO for each "slide" we have THREE title options (this could be reduced to 2 if i really wanted)
        // so when the first title option is not empty, we use that to trigger the bootstrap scrollspy
        // otherwise we use a paragraph title for the scrollspy
        if (json_slide.Title !== "") {
            // show big title

            // for each slide in the DB, we make a dot indicator thing with a fancy title for hover stuff
            buttons.push(
                "<a class='list-group-item list-group-item-action' title='" + json_slide.Title + " " + json_slide.Subtitle + "' href=#" + k + "><i class='fas fa-square'></i></a>"
            );

            slides.push(
                "<div class='mySlide' id=" + k + ">"
            );

            // adding in a "title slide" that kinda separates sections
            slides.push(
                "<div class='navTitle'><div class='navTitleBubble'>" + json_slide.Title + "<br>" + json_slide.Subtitle + "</div></div>"
            );
            slides.push(
                "<div class='pTitle'>" + json_slide.paragraphTitle + "</div>"
            );

        } else if (json_slide.Title === "") {
            // for each slide in the DB, we make a dot indicator thing with a fancy title for hover stuff
            buttons.push(
                "<a class='list-group-item list-group-item-action' title='" + json_slide.paragraphTitle + "' href=#" + k + "><i class='fas fa-square'></i></a>"
            );
            // for each slide in the DB we start a div, and assign it a title and link
            slides.push(
                "<div class='mySlide' id=" + k + ">"
            );
            slides.push(
                "<div class='pTitle'>" + json_slide.paragraphTitle + "</div>"
            );

        }

        // we add each paragraph to its current slide.
        $.each(json_slide.navPanelContent, function (sub_key, sub_value) {
            slides.push("<p class='navParagraph'>" + sub_value + "</p>");
        });
        // closing the myslide div
        slides.push("</div>");

        /////////// Mobile Site Carousel Arrays

        // indicator array
        mob_car_ind.push(
            "<li data-target='#myCarousel' data-slide-to='" + index + "'></li>"
        );
        // slide title array
        // again checking for which title we should use
        if (json_slide.Title !== "") {
            mob_car_slides.push(
                "<div class='carousel-item'><div class='mob_title_click' onclick='mobileDetailToggle()'>" + json_slide.Title + "</div><div class='car-item-container'>"
            );
        } else {
            mob_car_slides.push(
                "<div class='carousel-item'><div class='mob_title_click' onclick='mobileDetailToggle()'>" + json_slide.paragraphTitle + "</div><div class='car-item-container'>"
            );
        }
        // we add each paragraph to its current slide.
        $.each(json_slide.navPanelContent, function (sub_key, sub_value) {
            mob_car_slides.push("<p class='navParagraph'>" + sub_value + "</p>");
        });
        // closing the car-item-conteiner and carousel-item div
        mob_car_slides.push("</div></div>");

    });

    // generates a list of "slides"
    $("<div/>", {
        "class": "my-slide-list",
        html: slides.join("")
    }).appendTo(".navPanel");

    // generates the list of nav dot things, one for each slide
    $("<div/>", {
        "class": "my-nav-list list-group",
        "id": "list-example",
        html: buttons.join("")
    }).appendTo(".navDots-contain");

    // mobile carousel controls
    $(".carousel-inner").append(mob_car_slides.join(""));
    // making the first item have the active class
    $('.carousel-inner div:first').addClass('active');

    //this will give me intdicators
    $("<ol/>", {
        "class": "carousel-indicators",
        html: mob_car_ind.join("")
    }).appendTo(".carousel");
    $('.carousel-indicators li:first').addClass('active');

    // adding the title to the page
    $("title").replaceWith("<title>" + data.page_info.page_title + "</title>");

    // inject the header info
    $(".title").replaceWith("<span class='title'>" + data.page_info.nav_header_text + "</span>");
    $(".subtitle").replaceWith("<span class='subtitle'>" + data.page_info.nav_header_subtext + "</span>");
    $(".header_img").replaceWith("<img class='header_img' src='" + data.page_info.nav_header_img + "' alt='" + data.page_info.page_title + "' width='75' height='75'>");

    var legendjson = data.rest_legend_json_url;
    //console.log(mapPoints);
    //console.log(mapLayers);



}).always(function () {
    console.log("Data Loaded, Generating page...");
    createMap();
    enableMapControls();
    enableMainControls();
    buildLegend();
    setGraphicViews();

    // nudging the page in the direction of triggering the first slide and its actions
    $('body').scrollspy({ target: '#slide1' });

}).fail(function () {
    var alert;
    alert("Sorry the page database failed to load, Please try again later");
});

function setGraphicViews() {
    $(".graphic").click(function (e) {
        e.stopPropagation(); //without this line, the body/second click event will fire too
        var clickedGraphic = $(this);
        var imageURL = $(this).attr("src");
        console.log($(this).attr("src"));
        //set img in viewdiv
        $("#graphic-large").prop("src", imageURL);
        // console.log($("#graphic-large").attr("src"));
        //unhide viewdiv
        $("#graphic-large-view").removeClass("hidden");
        //remove click event from graphic (otherwise clicking it again will not close the view)
        $(".graphic").off();
        $("body").click(function () {
            //hide viewdiv
            $("#graphic-large-view").addClass("hidden");
            $("#graphic-large").prop("src", "");
            //reset the click event on the graphics
            setGraphicViews();
        })
    })// end graphic.click
}; // end setGraphicViews()

function showGraphic(imageURL) {
    event.stopPropagation(); //without this line, the body/second click event will fire too

    //set img in viewdiv
    $("#graphic-large").prop("src", imageURL);
    //unhide viewdiv
    $("#graphic-large-view").removeClass("hidden");
    $("body").click(function () {
        //hide viewdiv
        $("#graphic-large-view").addClass("hidden");
        $("#graphic-large").prop("src", "");
    })


}; //end showGraphic