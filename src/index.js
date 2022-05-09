import './styles/style.css';
import Keyboard from './js/Keyboard';
import keyArr from './js/keyObj';

/* global document */

const body = document.querySelector('body');
const container = document.createElement('div');

container.classList.add('container');
body.append(container);

const keyboardClass = new Keyboard(keyArr);
container.append(keyboardClass.renderKeys());
