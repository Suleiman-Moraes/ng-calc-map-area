import { Component } from '@angular/core';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import Draw from 'ol/interaction/Draw';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import Polygon from 'ol/geom/Polygon';
import Feature from 'ol/Feature';
import * as olProj from 'ol/proj';

declare var ol: any;
declare var turf: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'teste-mapa-dois';

  sel = 'None';
  raster = new TileLayer({
    source: new OSM()
  });
  vectorSource = null;
  vectorLayer = null;
  map = null;
  draw;

  geojsonObject = {
    'type': 'FeatureCollection',
    'crs': {
      'type': 'name',
      'properties': {
        'name': 'EPSG:3857'
      }
    },
    'features': [
      {
        'type': 'Feature',
        'geometry': {
          'type': 'Polygon',
          'coordinates': [
            [
              [
                -7627324.701343225,
                -855320.2592228485
              ],
              [
                -4840255.576187443,
                -816789.3496584828
              ],
              [
                -5482437.402260205,
                -2640585.7357051237
              ]
            ]
          ]
        }
      }
    ]
  };

  cordenadas: any = [];
  cordenadasPad: any = [];
  cords;

  ngOnInit() {
    this.vectorSource = new VectorSource({});
    this.vectorSource.addFeature(new Feature(new Polygon([
      [
        [
          -7647520.889497653,
          -644729.8240535646
        ],
        [
          -4908017.795756936,
          -605594.0655715545
        ],
        [
          -5710300.844638145,
          861996.8775038298
        ],
        [
          -7921471.198871724,
          98849.58710463019
        ]
      ]
    ])));
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource
    });
    var mousePositionControl = new ol.control.MousePosition({
      coordinateFormat: ol.coordinate.createStringXY(4),
      projection: 'EPSG:3857',
      // comment the following two lines to have the mouse position
      // be placed within the map.
      className: 'custom-mouse-position',
      target: document.getElementById('mouse-position'),
      undefinedHTML: '&nbsp;'
    });
    this.setIteracao();
    this.map = new Map({
      controls: ol.control.defaults({
        attributionOptions: {
          collapsible: false
        }
      }).extend([mousePositionControl]),
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        this.vectorLayer
      ],
      target: 'map',
      view: new View({
        center: [-6724854.270331181, -55818.672631822934],
        zoom: 4
      })
    });

    this.map.on('click', (args) => {
      console.log(args.coordinate);
      this.pegarPos(args.coordinate);
    });
  }

  addInteraction() {
    this.map.removeInteraction(this.draw);
    this.setIteracao();
  }

  teste() {
    console.log(this.draw);
    console.log(this.map);
    this.draw.sketchCoords_[0].forEach(c => {
      this.cordenadas.push(ol.proj.transform(c, 'EPSG:3857', 'EPSG:4326'));
      this.cordenadasPad.push(c);
    });
    calculateArea(this.cordenadas);
  }

  clean(): void {
    this.vectorSource.clear();
  }

  pegarPos(pos): void {
    if (pos) {
      console.log(this.vectorSource.getFeaturesAtCoordinate(pos)[0].getGeometry().flatCoordinates);
    }
  }

  setIteracao(): void {
    if (this.sel !== 'None') {
      this.draw = new Draw({
        source: this.vectorSource,
        type: this.sel
      });
      this.map.addInteraction(this.draw);
    }
  }
}

var shellArr = [];
function calculateArea(markers) {
  var k = markers.length;
  var h = [];
  var m, o;
  var polyPoints = [];
  for (var g = 0; g < k; g++) {
    m = markers[g][1];
    o = markers[g][0];
    h.push([o, m]);
    polyPoints.push([m, o]);
  }
  var b = h[0];
  h.push(b);
  shellArr.length = 0;
  shellArr.push(h);
  var f;
  var c;
  var a;
  var l;
  var j;
  var n;
  var d;

  if (k > 2) {
    printResult();
  }
}

function printResult() {

  var polygon = turf.polygon(shellArr);
  var area = turf.area(polygon);
  area = Math.ceil(area);

  console.log(area);
}