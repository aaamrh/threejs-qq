import './index.less';
import { util } from './util';
import ThreeMap from './ThreeMap';


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

xhr.onreadystatechange = function(){
  if(xhr.readyState == 4 && xhr.status == 200){
    // const data =  JSON.parse(xhr.response) ;
    const data = util.decode( JSON.parse(xhr.response) );
    const map = new ThreeMap({}, data);
    map.init(); 
    map.drawMap();
  }
};

xhr.open('GET', './assets/map/china.json');
xhr.send();




console.log('ok~~~');
  