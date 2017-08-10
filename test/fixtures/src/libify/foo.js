/* eslint no-unused-vars:0 */
import 'common/';
import say from 'plugin/';
import { person } from 'com';
class Foobar {}

const foo = 'Bar';

const bar = () => 'Foo';
console.log('Hello');
say();
console.log(person);

module.exports = `${bar} ${foo}`;
