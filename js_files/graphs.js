var color1, color2
color1='rgb(53,96,45)'
color2='rgb(196,218,174)'
var Municipality = {
    x:[7.4,14.5,15.7,19.2,21.3],
    y:['Tracy CA','Woodland, CA','Roseville, CA','Sacramento, CA','Patterson, CA',],
    type: 'bar',
    orientation: 'h',
    width: .8,
    marker: {
      color: [color2,color1,color1,color1,color1]
    }
  };
  
var data1 = [Municipality];
  
var layout1 = {
    font:{
      family: 'Raleway, sans-serif'
    },
    showlegend: false,
    margin:{l:100,t:0},
    width:420,
    xaxis: {
        title:'Canopy Cover %',
      tickangle: 0,
      ticksuffix:'%',
      tickvals:[0.0,5.0,10.0,15.0,20.0,25.0]
    },
    yaxis: {
        title:{text:'Municipality',standoff:100},
      zeroline: false
    },
    bargap :.5
  };
  
Plotly.newPlot('myDivMun', data1, layout1, {displayModeBar: false,responsive: true});

var dataTC = [{
    values: [37.9,10.6,7.4,.8,43.3],
    labels: ['Impervious Surfaces', 'Grass/Low Vegetation', 'Tree Canopy','Open Water','Bare Soil'],
    type: 'pie',
    textinfo: "label+percent",
    textposition: "auto",
    hoverinfo:"none",
    marker: {
        colors: ['#602d5f','#c4daae','#35602d','#76d2f4','#cea17c']
      }
  }];
  
  var layout2 = {
    margin:{l:100,t:0},
    showlegend: false
  };
  
  Plotly.newPlot('myDivTC', dataTC, layout2,{displayModeBar: false,responsive: true});