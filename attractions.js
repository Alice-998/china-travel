// 添加景点点标记
const starStyle = new ol.style.Style({
  image: new ol.style.RegularShape({
    points: 5,             // 五角星
    radius1: 10,           // 外半径
    radius2: 5,            // 内半径
    fill: new ol.style.Fill({
      color: 'rgba(255, 215, 0, 1)'  
    }),
    stroke: new ol.style.Stroke({
      color: '#ffcc00',
      width: 2
    })
  })
});

const beijingAttractions = [
  { name: '故宫博物院', coords: [116.403963, 39.915119] },
  { name: '天坛公园', coords: [116.412222, 39.888056] },
  { name: '颐和园', coords: [116.272, 39.999] },
  { name: '圆明园', coords: [116.310, 40.008] },
  { name: '北海公园', coords: [116.387, 39.928] }
];

const beijingFeatures = beijingAttractions.map(item => {
  const feature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat(item.coords)),
    name: item.name
  });
  return feature;
});

const beijingAttractionLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    features: beijingFeatures
  }),
  style: starStyle
});

map.addLayer(beijingAttractionLayer);