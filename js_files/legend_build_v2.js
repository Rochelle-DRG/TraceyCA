
// Ideally i dpnt want this hardcoded here, and want to add in a thing to the main thing to send this to this thing, 
// thing.
var legendURL = "https://gis.davey.com/arcgis/rest/services/Sammamish/SammamishFeatures/MapServer/legend?f=pjson";
var wmsLegendURLs = ["https://gis.davey.com/arcgis/rest/services/Sammamish/SAM_PriorityPlanting/MapServer/legend?f=pjson"];

var buildLegend = function() {

    var jsonToLegend = function(jsonData) {

        var legends = [];
        $.each(jsonData.layers, function(key, value) {
            
            var shortName = value.layerName.replace(/\s/g,'');
            legends.push(
                "<div id='" + shortName + "' class='legend-item-contain'><span class='legend_head'>"+ value.layerName +"</span><ul>"
            );
            
            $.each(value.legend, function(key2, value2){
                //list item begin
                legends.push("<li>");

                // legend item color picture thing
                legends.push("<img alt='"+ value2.label +"' src='data:" + value2.contentType + ";base64," + value2.imageData + "'>");
                // legend item detail
                legends.push("<span>"+ value2.label +"</span>");

                // list item end
                legends.push("</li>");
            });
            legends.push("</ul></div>");
            
        });
        return legends;
        
    };

    // THIS DOESNT WORK V

    var built_legends = [];
    built_legends.push("<div class='legend-wrapper'>");
    
    $.getJSON( legendURL, function( data ) {
        
        built_legends.push(jsonToLegend(data));

    });

    $.each(wmsLegendURLs, function(my_url){

        $.getJSON( my_url, function( data ) {
            
            built_legends.push(jsonToLegend(data));

        });
    });

    built_legends.push("</div>");

    console.log(built_legends);

    // adding the new legend div to the main body of the page
    $( "<div/>", {
        "class": "new-wave-legend",
        html: built_legends.join( "" )
    }).appendTo( "body" );

    $( "<div/>", {
        "class": "legend-control",
        html: "<div><button onclick='legendToggle()' type='button' class='btn btn-small btn-block legendBttn'>Legend</button></div>"
    }).appendTo( ".new-wave-legend" );
    
    legendToggle = function(){
        $(".legend-wrapper").toggle("slow");
        $(".legendBttn").toggleClass("open");
    };

};
