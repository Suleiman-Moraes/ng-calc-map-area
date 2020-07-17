import { Component } from '@angular/core';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import Draw from 'ol/interaction/Draw';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
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
  source = new VectorSource({ wrapX: false });
  vector = new VectorLayer({
    source: this.source
  });
  map = null;
  draw;

  cordenadas: any = [];

  ngOnInit() {
    var mousePositionControl = new ol.control.MousePosition({
      coordinateFormat: ol.coordinate.createStringXY(4),
      projection: 'EPSG:4326',
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
      layers: [this.raster, this.vector],
      target: 'map',
      view: new View({
        center: [-11000000, 4600000],
        zoom: 8
      })
    });
  }

  addInteraction() {
    this.map.removeInteraction(this.draw);
    this.setIteracao();
  }

  teste() {
    console.log(this.draw);
    this.draw.sketchCoords_[0].forEach(c => {
      this.cordenadas.push(ol.proj.transform(c, 'EPSG:3857', 'EPSG:4326'));
    });
    calculateArea(this.cordenadas);
  }

  setIteracao(): void {
    if (this.sel !== 'None') {
      this.draw = new Draw({
        source: this.source,
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