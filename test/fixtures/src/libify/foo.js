/* eslint no-unused-vars:0 */
import '@@common/';
import say from '@@plugin/';
import { person } from '@@com';
import { name } from '@@src/src';

class Foobar {}

const foo = 'Bar';

const bar = () => 'Foo';
console.log('Hello');
say();
console.log(person);
console.log(name)
module.exports = `${bar} ${foo}`;
