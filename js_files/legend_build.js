
// Ideally i dpnt want this hardcoded here, and want to add in a thing to the main thing to send this to this thing, 
// thing.
var legendURL = "https://gis.davey.com/arcgis/rest/services/TracyCA/TracyCA_2020/MapServer/legend?f=pjson";

    console.log("legend builder called");

    var buildLegend = function() {
        $.getJSON( legendURL, function( data ) {
            // console.log(data);
            var legends = [];
            legends.push("<div class='legend-wrapper'>");
            $.each(data.layers, function(key, value) {
                // console.log(value);
                var shortName = value.layerName.replace(/\s/g,'');
                var legendTitle = shortName.split('_').join(' ');
                // console.log(value.layerName);
                legends.push(
                    "<div id='" + shortName + "' class='legend-item-contain'><span class='legend_head'>"+  value.layerName +"</span><ul>"
                );
                
                $.each(value.legend, function(key2, value2){
                    // console.log(value2);
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
            legends.push("</div>");

            // adding the new legend div to the main body of the page
            $( "<div/>", {
                "class": "new-wave-legend",
                html: legends.join( "" )
            }).appendTo( "body" );

            $( "<div/>", {
                "class": "legend-control",
                html: "<div><button onclick='legendToggle()' type='button' class='btn btn-small btn-block legendBttn'>Legend</button></div>"
            }).appendTo( ".new-wave-legend" );
        });

        legendToggle = function(){
            $(".legend-wrapper").toggle("slow");
            $(".legendBttn").toggleClass("open");
        };
    
};
