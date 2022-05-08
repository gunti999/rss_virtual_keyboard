import './styles/style.css';
import Keyboard from './js/Keyboard';
import { keyArr } from './js/keyObj';

const body = document.querySelector('body');

const container = document.createElement('div');
container.classList.add('container');
body.append(container);

let keyboardClass = new Keyboard(keyArr);
container.append(keyboardClass.renderKeys());

