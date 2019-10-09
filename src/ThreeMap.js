import * as d3 from 'd3-geo';

const THREE = window.THREE;

// 绘制地图的类
export default class ThreeMap{
  constructor(set, geojson){
    this.set = set;
    this.geojson = geojson;
  }

  init(){
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.setCamera({ x:10, y: 0, z:100 });
    this.setLight();
    this. ();
    this.setHelper();

    this.drawMap();
    this.animate();
  }
  
  setLight(){
    const light = new THREE.AmbientLight(0x40404);
    this.scene.add(light);
  }

  setCamera(data){
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    this.camera.up.x = 0;
    this.camera.up.y = 0;
    this.camera.up.z = 1;

    const {x,y,z}= data;
    this.camera.position.set(x,y,z);
    this.camera.lookAt(0,0,0);
    this.scene.add(this.camera);
  }

  setHelper(){
    this.scene.add(new THREE.AxisHelper(50));
  }

  setControl(){
    this.controls = new THREE.OrbitControls( this.camera );
    this.controls.update();
  }

  // 绘制滴入模型
  drawMap(){
    this.vector3json = [];
    this.geojson.features.forEach( (data, i)=>{
      // data 是每个省份的数据, 遍历存储到一个新的数据 areasData
      const areas = data.geometry.coordinates[0]; // 多面坐标数组
      const areasData = {
        ...data.properties,
        coordinates: []
      };
      areas.forEach((point, i) => {
        // console.log(point);
        if(point[0] instanceof Array){
          areasData.coordinates[i] = [];
          point.forEach(pointInner => {
            areasData.coordinates[i].push(this.longlatToVictor3(pointInner));
          });
        }else{
          areasData.coordinates.push(this.longlatToVictor3(point));
        }
      });
      this.vector3json.push(areasData);
    });

    // 绘制模块
    const group = new THREE.Group();
    const lineGroup = new THREE.Group();
    this.vector3json.forEach(province=>{
      // 如果是多面
      if(province.coordinates[0][0] instanceof Array){
        province.coordinates.forEach(area=>{
          const mesh = this.getAreaMesh(area);
          const line = this.getAreaOutlineMesh(area);
          
          group.add(mesh);
          group.add(line);
        });
      }else{ // 单面
        const mesh = this.getAreaMesh(province.coordinates);
        const line = this.getAreaOutlineMesh(province.coordinates);
        group.add(mesh);
        group.add(line);
      }
    });

    this.scene.add(group);
    const lineGroup2 = lineGroup.clone();
    lineGroup2.position.z = -2;
    this.scene.add(lineGroup);
    this.scene.add(lineGroup2);

    console.log('vector3json', this.vector3json);
  }

  /**
   * 绘制area
   */
  getAreaMesh(points){
    console.log(points);
    const shape = new THREE.Shape();
    // const [x0, y0] = points[0];

    points.forEach((p, i)=>{
      const [x, y] = p;
      if(i==0){
        shape.moveTo(x, y);
      }else if(i===points.length-1){
          shape.quadraticCurveTo(x,y,x,y);
      }else{
        shape.lineTo(x, y, x, y);
      }
    });
    
    const extrudeSettings = {
      depth: 2,
      bevelEnabled: false,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const material = new THREE.MeshBasicMaterial({color:0x007cff, opacity:.5, transparent: true});
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  }

  /**
   * 绘制area的轮廓
   */
  getAreaOutlineMesh(points){
    const material = new THREE.LineBasicMaterial({color: 0xffffff});
    const geometry = new THREE.Geometry();
    geometry.vertices = [...points].map( d =>{
      const [x, y, z] = d;
      return new THREE.Vector3(x, y, z+2);
    } );

    return  new THREE.Line(geometry, material);
  }


  /**
   * 经纬度转化为三维向量 Vector3
   * @param { Array } longlat
   * @memberof ThreeMap
   */
  longlatToVictor3(longlat){
    // console.log(longlat)
    if(!this.projection){
      this.projection = d3.geoMercator().center([108.754443, 33.944037]).scale(80).translate([0,0]);
    }
    const [x,y] = this.projection([...longlat]);
    const z = 0;
    return [y, x, z];
  }

  animate(){
    requestAnimationFrame(this.animate.bind(this));
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

}