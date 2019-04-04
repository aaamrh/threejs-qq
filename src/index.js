import './index.less';

// 打包的时候，此代码不载入
if (process.env.NODE_ENV === 'development') {
  import('./index.html');
}

console.log('ok~~~');
