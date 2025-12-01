const provinceUrl = new URLSearchParams(window.location.search);
const provinceName = provinceUrl.get('province');

const provinceLonLat = {
  beijing: [116.4074, 39.9042],
  tianjin: [117.2009, 39.0842],
  shanghai: [121.4737, 31.2304],
  chongqing: [106.5120, 29.5780],
  heilongjiang: [126.6390, 45.7680],
  jilin: [125.3210, 43.8900],
  liaoning: [123.4294, 41.8357],
  neimenggu: [111.6719, 40.8232],
  shanxi_w: [108.9423, 34.2530],
  gansu: [103.8321, 36.0599],
  ningxia: [106.2261, 38.4848],
  qinghai: [101.7775, 36.6171],
  xinjiang: [87.6149, 43.8247],
  hebei: [114.4698, 38.0355],
  henan: [113.6197, 34.7461],
  shanxi_e: [112.5453, 37.8678],
  shandong: [117.0000, 36.6512],
  anhui: [117.2849, 31.8612],
  jiangxi: [115.8467, 28.6852],
  xizang: [91.1135, 29.6533],
  sichuan: [104.0633, 30.6608],
  guizhou: [106.7081, 26.5873],
  yunnan: [102.7075, 25.0352],
  hubei: [114.2873, 30.5954],
  hunan: [112.9353, 28.2330],
  jiangsu: [118.7753, 32.0427],
  zhejiang: [120.2055, 30.2481],
  fujian: [119.2912, 26.0769],
  guangdong: [113.2608, 23.1322],
  guangxi: [108.3195, 22.8148],
  hainan: [110.1966, 20.0446],
  hongkong: [114.1694, 22.3193],
  macao: [113.5439, 22.1987],
  taiwan: [121.5610, 25.0377]
};

const centerLonLat = provinceLonLat[provinceName] || [104.1954, 35.8617];
const center = ol.proj.fromLonLat(centerLonLat);

// 创建地图
const map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center: center,
    zoom: 6
  })
});

// 添加省会点标记
const marker = new ol.Feature({
  geometry: new ol.geom.Point(center)
});
const vectorSource = new ol.source.Vector({
  features:[marker]
});
const markerVectorLayer = new ol.layer.Vector({
  source: vectorSource
});

map.addLayer(markerVectorLayer);

// 添加行政区边界geojson并自动缩放
const provinceVectorLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: `data/geojson/${provinceName}.geojson`,
    format: new ol.format.GeoJSON()
  }),
  style: new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'rgba(0, 150, 255, 1)',
      width: 2
    }),
    fill: new ol.style.Fill({
      color: 'rgba(0, 150, 255, 0.2)'
    })
  })
});

map.addLayer(provinceVectorLayer);

provinceVectorLayer.getSource().on('change', function () {
  if (provinceVectorLayer.getSource().getState() === 'ready') {
    const extent = provinceVectorLayer.getSource().getExtent();
    map.getView().fit(extent, { duration: 1000 });
  }
});


// 添加景点点标记
fetch(`data/json/${provinceName}.json`)
  .then(response => response.json())
  .then(attractions => {
    const features = attractions.map(item => {
      return new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat(item.coords)),
        name: item.name
      });
    });

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

    const vectorlayer = new ol.layer.Vector({
      source: new ol.source.Vector({ features }),
      style: starStyle
    });

    map.addLayer(vectorlayer);
  });


// 鼠标悬停 tooltip 
const tooltip = document.getElementById("tooltip");

map.on('pointermove', (evt) => {
  // 找鼠标下的 feature
  const feature = map.forEachFeatureAtPixel(evt.pixel, f => f);

  if (feature && feature.get('name')) {
    // 鼠标变 pointer
    map.getTargetElement().style.cursor = 'pointer';

    // 显示 tooltip
    tooltip.style.display = 'block';
    tooltip.style.left = evt.pixel[0] + 12 + 'px';
    tooltip.style.top = evt.pixel[1] + 12 + 'px';
    tooltip.innerHTML = feature.get('name');  
  } else {
    // 恢复默认鼠标样式
    map.getTargetElement().style.cursor = '';
    tooltip.style.display = 'none';
  }
});

