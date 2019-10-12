import ThreeMap from './ThreeMap';
import pic1 from './assets/images/lightray.jpg';
import pic2 from './assets/images/lightray_yellow.jpg';


export default class ThreeMapBar extends ThreeMap{
  constructor(set, geojson){
    super(set, geojson);
    this.textures = [ new THREE.TextureLoader().load(pic1),  new THREE.TextureLoader().load(pic2)];
    this.colors = [0xffffff, 0xffeb3b];
    
  }

  // 添加6边形
  addHexagon(p, i){
    var geo = new THREE.CircleGeometry(.5, 6);
    var mat = new THREE.MeshBasicMaterial({color: this.colors[i%2]});
    var circle = new THREE.Mesh(geo, mat);
    const [x,y,z] = p;
    circle.position.set(x, y, z+2.1);
    return circle;
  }
   
  // 画曲线
  drawFlyLine(data){
    data.forEach(d=>{
      const {source, target} = d;
      const start = this.vector3object[source.name].cp;
      const end = this.vector3object[target.name].cp;
    });

    const curve = new THREE.QuadraticBezierCurve(
      new THREE.Vector2(-10, 0),
      new THREE.Vector2(20, 15),
      new THREE.Vector2(10, 0),
    );

    var points = curve.getPoints(50);
    var geo = new THREE.BufferGeometry().setFromPoints(points)


  }


  drawLightBar(data){
    const group = new THREE.Group();
    const texture = new THREE.TextureLoader().load(pic1); 

    data.forEach( (d, i)=>{
      const { cp } = this.vector3object[ d.name ];
      const [x, y, z] = this.longlatToVictor3( cp );
      const geo = new THREE.PlaneGeometry(1, d.value/10, 32);
      const mat = new THREE.MeshBasicMaterial({
        map: this.textures[1 % 2],
        transparent: true,
        opacity: .5,
        blending: THREE.AdditiveBlending,  // 光柱变透明，颜色叠加 参考： materials/blending
        depthTest: false,                  // 去掉另一面黑色
        color: 0xffff00,
        side: THREE.DoubleSide
      });
      const plane = new THREE.Mesh(geo, mat);
      plane.position.set(x, y, z+d.value/10/2+2);
      plane.rotation.x = -Math.PI/2;
      const plane2 = plane.clone();
      plane2.rotation.y = Math.PI/2;

      group.add(plane);  
      group.add(plane2); 
      group.add(this.addHexagon([x, y, z], i));
    } );

    this.scene.add(group);
  }
}