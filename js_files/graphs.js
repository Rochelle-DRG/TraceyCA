//Graphs for slide 2
var dataMun = [{
    x:[7.4,14.5,15.7,19.2,21.3],
    y:['Tracy CA  ','Woodland, CA  ','Roseville, CA  ','Sacramento, CA  ','Patterson, CA  ',],
    type: 'bar',
    orientation: 'h',
    width: .8,
    marker: {
      color: ['rgb(196,218,174)','rgb(53,96,45)','rgb(53,96,45)','rgb(53,96,45)','rgb(53,96,45)']
    }
  }];
  
  
var bar1 = {
    font:{
      family: 'Raleway, sans-serif'
    },
    showlegend: false,
    margin:{l:120,t:0,r:50},
    width:400,
    xaxis: {
      title:'Canopy Cover %',
      tickangle: 0,
      ticksuffix:'%',
      tickvals:[0.0,5.0,10.0,15.0,20.0,25.0],
      range:[0,25]
    },
    yaxis: {
        title:{text:'Municipality',standoff:100},
      zeroline: false
    },
    bargap :.5
  };
  
Plotly.newPlot('barMun', dataMun, bar1, {displayModeBar: false,responsive: true});

var dataTC = [{
    values: [37.9,10.6,7.4,.8,43.3],
    labels: ['<b>Impervious Surfaces</b>', '<b>Grass/Low <br>Vegetation</b>', '<b>Tree Canopy</b>','<b>Open Water</b>','<b>Bare Soil</b>'],
    type: 'pie',
    textinfo: "label",
    textposition: "auto",
    hoverinfo:"label+percent",
    marker: {
        colors: ['#602d5f','#c4daae','#35602d','#76d2f4','#cea17c']
      },
    rotation: 90,
    direction:'clockwise',
    pull:.02
  }];
  
  var pie1 = {
    margin:{l:0,t:20},
    showlegend: false,
    width:400
  };
  
  Plotly.newPlot('pieTC', dataTC, pie1,{displayModeBar: false,responsive: true});

  var dataCO2 = [{
    values: [81.8,15.4,1.6,1.2,.01],
    labels: ['<b>CO<sub>2</sub> Sequestered</b>', '<b>Stormwater Runoff</b>', '<b>O<sub>3</sub></b>','<b>PM<sub>10</sub></b>','<b>CO,NO<sub>2</sub>,SO<sub>2</sub></b>'],
    type: 'pie',
    textinfo: "label",
    textposition: "auto",
    hoverinfo:"label+percent",
    marker: {
        colors: ['#827030','#301e54','#35602d','#c3d9ac','#ffffff']
      },
    rotation: 110,
    direction:'clockwise',
    pull:.02
  }];
  
  
  Plotly.newPlot('pieCO2', dataCO2, pie1,{displayModeBar: false,responsive: true});

//slide 3

var pop = {
  x: [1993,2010,2016],
  y: [41584,83569,89290],
  name: 'Population',
  type: 'scatter',
  marker: {
    symbol:'square',
    color:'#ff7f0e'
  },
};

var tree = {
  x: [1993,2010,2016],
  y: [4.2,6.2,7.4],
  name: 'Canopy Cover',
  yaxis: 'y2',
  type: 'scatter',
  marker: {
    symbol:'circle',
    color:'#006940',
    size:[21,31,37]
  },
  line:{width:0}
};

var imper = {
  x: [1993,2010,2016],
  y: [27.5,38.1,37.8],
  name: 'Impervious Surfaces',
  yaxis: 'y2',
  type: 'scatter',
  marker: {
    symbol:'triangle-up',
    color:'black',
    size:0,
    opacity:0
  },
  line:{width:1}
};


var tripledata = [pop, imper, tree];

var layout1 = {
  showlegend:true,
  legend:{
    orientation:'h',
    x:0,
    y:1.2,
    bgcolor:'#fffffe00'
  },
  width: 400,
  height:300,
  margin:{l:50,t:20,b:50},
  xaxis: {
    title:'Sample Year',
    range:[1990,2020],
    tickvals:[1993,2010,2016]
  },
  yaxis: {
    title: 'Population',
    titlefont: {color: '#1f77b4'},
    tickfont: {color: '#1f77b4'},
    side:'right',
    range:[0,100000]
  },
  yaxis2: {
    title: 'Percentage',
    titlefont: {color: '#ff7f0e'},
    tickfont: {color: '#ff7f0e'},
    overlaying: 'y',
    side: 'left',
    range:[0,50],
    ticksuffix:'%'
  },
};

Plotly.newPlot('HisCha', tripledata, layout1,{displayModeBar: false,responsive: true});

//slide 4

var dataTreeInv = [{
    x:[22.0,1.0,1.1,1.2,1.2,1.4,1.8,1.8,2.3,2.4,2.6,3.0,3.0,3.7,4.4,5.3,6.3,7.8,8.1,9.3,10.1],
    y:['all other species  ','red maple  ','tallowtree  ','northern red oak  ','white ash  ','ash spp  ', 'evergreen pear  ','Modesto ash  ','fruitless mulberry  ','Japanese zelkova  ','camphor tree  ','Japanese flowering crabapple  ','coast redwood  ','cherry plum  ','Chinese hackberry  ','sweetgum  ','crape myrtle  ','london planetree  ','Raywood ash  ','Chinese pistache  ','flowering pear  '],
    type: 'bar',
    orientation: 'h',
    width: .8,
    marker: {
      color: '#35602d'
    }
}];
var bar2 = {
  title:{text:'Percent of Inventory'},
  font:{
    family: 'Raleway, sans-serif'
  },
  showlegend: false,
  margin:{l:175,t:30,r:50},
  width:400,
  height:600,
  xaxis: {
    title:'',
    tickangle: 0,
    ticksuffix:'%',
    tickvals:[0.0,5.0,10.0,15.0,20.0,25.0]
  },
  yaxis: {
      title:'',
    zeroline: false
  },
  bargap :.5
};

Plotly.newPlot('treeInv', dataTreeInv, bar2, {displayModeBar: false,responsive: true});

//slide 5

var dataEB = [{
  values: [71.28,16.56,8.20,3.17,0.78],
  labels: ['<b>Aesthetic/Other</b>', '<b>Energy</b>', '<b>Air Quality</b>','<b>Stormwater Runoff</b>','<b>CO<sub>2</sub> Sequestered</b>'],
  text:['$4,078,117','$947,243','$469,360','$181,658','$16,171'],
  type: 'pie',
  textinfo: "label+text",
  textposition: "auto",
  hoverinfo:"label+percent",
  marker: {
      colors: ['#35602d','#c11a38','#74d0f4','#301e54','#cfa27d']
    },
  rotation: 90,
  direction:'clockwise',
  pull:.02
}];


Plotly.newPlot('pieEB', dataEB, pie1,{displayModeBar: false,responsive: true});

//Slide 6

var dataFP = [{
  values: [87.57,5.24,3.19,2.28,1.72],
  labels: ['<b>Very Low</b>', '<b>Low</b>', '<b>Moderate</b>','<b>High</b>','<b>Very High</b>'],
  text:['5,435.3 acres','325.2 acres','197.7 acres','141.6 acres','107.0 acres'],
  type: 'pie',
  textinfo: "label+text",
  textposition: "auto",
  hoverinfo:"label+percent",
  marker: {
      colors: ['#9900cc','#cc00ff','#ffff00','#ffbe01','#ff0000']
    },
  rotation: 90,
  direction:'clockwise',
  pull:.09
}];


Plotly.newPlot('pieFP', dataFP, pie1,{displayModeBar: false,responsive: true});
