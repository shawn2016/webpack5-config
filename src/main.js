// js打包入口文件
import $ from 'jquery';
// 发布思路：bundle.js 中只存放自己的代码，第三方包的代码，全部都抽离都另外都js中
import './css/index.less';

$(function () {
  $('li:odd')
    .css('backgroundColor', 'pink');
  $('li:even')
    .css('backgroundColor', 'lightblue');
});

class Person {
  static info = { name: 'zs' };
}

function add(x, y) {
  return x + y;
}

console.log(Person.info);
console.log(add(2, 5));
