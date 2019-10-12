import './index.less';
import { util } from './util';
// import ThreeMap from './ThreeMap';
import ThreeMapBar from './ThreeMapBar';


// 打包的时候，此代码不载入
if (process.env.NODE_ENV === 'development') {
  import('./index.html');
}

let xhr;
if(window.XMLHttpRequest){
  xhr = new XMLHttpRequest();
}else{
  xhr = new ActiveXObject('Microsoft.XMLHTTP');
}


const lightBarData = [
  {name:'海南省', value: 60},
  {name:'北京市', value: 100},
  {name:'山东省', value: 80},
  {name:'山西省', value: 83}
];


const flyLineData = [
  { source:{ name: '海南省' }, target:{ name:'四川省' } },
  { source:{ name: '北京市' }, target:{ name:'山西省' } },
  { source:{ name: '山东省' }, target:{ name:'北京市' } },
];


xhr.onreadystatechange = function(){
  if(xhr.readyState == 4 && xhr.status == 200){
    // const data =  JSON.parse(xhr.response) ;
    const data = util.decode( JSON.parse(xhr.response) );
    const map = new ThreeMapBar({}, data);
    map.init(); 
    map.drawMap();

    // 光柱


    map.drawLightBar(lightBarData);
    map.drawFlyLine(flyLineData);
  }
};

xhr.open('GET', './assets/map/china.json');
xhr.send();




console.log('ok~~~');
  