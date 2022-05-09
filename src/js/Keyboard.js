/* global localStorage, document */

function createElment(element, className) {
  const elem = document.createElement(element);
  elem.classList.add(className);
  return elem;
}

export default class Keyboard {
  constructor(keys) {
    this.keys = keys;
    this.shiftOn = false;
    this.capsOn = false;
    this.ctrlOn = false;
    this.altOn = false;
    this.lang = localStorage.getItem('lang') || 'en';
  }

  renderKeys() {
    const virtualKeyboard = createElment('div', 'virtual-keyboard');
    this.virtualKeyboard = virtualKeyboard;

    const h1 = createElment('h1', 'project-name');
    h1.textContent = 'RSS Виртуальная клавиатура';
    virtualKeyboard.append(h1);

    const textarea = createElment('textarea', 'textarea');
    this.textarea = textarea;
    virtualKeyboard.append(textarea);

    const keyboardArea = createElment('div', 'keyboard-area');
    virtualKeyboard.append(keyboardArea);

    this.keys.forEach((el) => {
      const keyRow = createElment('div', 'key-row');
      keyboardArea.append(keyRow);

      el.forEach((keyValues) => {
        const keyDiv = createElment('div', 'key');
        keyDiv.classList.add(keyValues.code);

        const keyEn = keyValues;
        const keyRu = keyValues.ru || keyValues;

        // RU

        const spanRus = createElment('span', 'span-ru');
        if (this.lang === 'ru') {
          spanRus.classList.remove('hide');
        } else {
          spanRus.classList.add('hide');
        }

        keyDiv.append(spanRus);

        const spanShiftOff = createElment('span', 'shift-off');
        spanShiftOff.textContent = keyRu.key;
        spanRus.append(spanShiftOff);

        const spanShiftOn = createElment('span', 'shift-on');
        spanShiftOn.classList.add('hide');
        spanShiftOn.textContent = keyRu.shiftKey;
        spanRus.append(spanShiftOn);

        const spanCapsOn = createElment('span', 'caps-on');
        spanCapsOn.classList.add('hide');
        if (keyRu.notCaps) {
          spanCapsOn.textContent = keyRu.key;
        } else {
          spanCapsOn.textContent = keyRu.shiftKey;
        }
        spanRus.append(spanCapsOn);

        const spanCapsShift = createElment('span', 'caps-shift');
        spanCapsShift.classList.add('hide');
        if (keyRu.notCaps) {
          spanCapsShift.textContent = keyRu.shiftKey;
        } else {
          spanCapsShift.textContent = keyRu.key;
        }
        spanRus.append(spanCapsShift);

        // EN

        const spanEn = createElment('span', 'span-en');
        if (this.lang === 'en') {
          spanEn.classList.remove('hide');
        } else {
          spanEn.classList.add('hide');
        }
        keyDiv.append(spanEn);

        const spanShiftOffEn = createElment('span', 'shift-off');
        spanShiftOffEn.textContent = keyEn.key;
        spanEn.append(spanShiftOffEn);

        const spanShiftOnEn = createElment('span', 'shift-on');
        spanShiftOnEn.classList.add('hide');
        spanShiftOnEn.textContent = keyEn.shiftKey;
        spanEn.append(spanShiftOnEn);

        const spanCapsOnEn = createElment('span', 'caps-on');
        spanCapsOnEn.classList.add('hide');
        if (keyEn.notCaps) {
          spanCapsOnEn.textContent = keyEn.key;
        } else {
          spanCapsOnEn.textContent = keyEn.shiftKey;
        }
        spanEn.append(spanCapsOnEn);

        const spanCapsShiftEn = createElment('span', 'caps-shift');
        spanCapsShiftEn.classList.add('hide');
        if (keyEn.notCaps) {
          spanCapsShiftEn.textContent = keyEn.shiftKey;
        } else {
          spanCapsShiftEn.textContent = keyEn.key;
        }
        spanEn.append(spanCapsShiftEn);

        keyRow.append(keyDiv);

        keyDiv.addEventListener('mousedown', () => {
          this.buttonPressed(keyValues);
        });
        keyDiv.addEventListener('mouseup', () => {
          this.buttonUnpressed(keyValues);
        });
        document.addEventListener('keydown', (event) => {
          event.preventDefault();
          if (event.code === keyValues.code) {
            this.buttonPressed(keyValues);
          }
        });
        document.addEventListener('keyup', (event) => {
          event.preventDefault();
          if (event.code === keyValues.code) {
            this.buttonUnpressed(keyValues);
          }
        });
      });
    });

    const pLang = createElment('p', 'lang-and-ver');
    pLang.textContent = 'Смена языка: Alt + Ctrl. Система: Windows 10';
    virtualKeyboard.append(pLang);

    return virtualKeyboard;
  }

  buttonPressed(symbol) {
    let start = this.textarea.selectionStart;
    const end = this.textarea.selectionEnd;
    const { value } = this.textarea;
    const button = this.virtualKeyboard.querySelector(`.${symbol.code}`);
    button.classList.add('press');
    if (symbol.key === 'Backspace') {
      if (start > 0) {
        this.textarea.value = value.slice(0, start - 1) + value.slice(end);
        this.textarea.focus();
        start -= 1;
      }
    } else if (symbol.key === 'Delete') {
      if (end < this.textarea.value.length) {
        this.textarea.value = value.slice(0, start) + value.slice(end + 1);
        this.textarea.focus();
      }
    } else if (symbol.key === 'Shift') {
      this.shiftOn = true;
      this.chekShiftFlag();
    } else if (symbol.key === 'CapsLock') {
      this.capsOn = !this.capsOn;
      if (this.capsOn) {
        button.classList.add('press');
      } else {
        button.classList.remove('press');
      }
      this.chekShiftFlag();
    } else if (symbol.code === 'ControlLeft' || symbol.code === 'ControlRight') {
      this.ctrlOn = true;
      if (this.altOn) {
        this.switchLang();
      }
    } else if (symbol.code === 'AltLeft' || symbol.code === 'AltRight') {
      this.altOn = true;
      if (this.ctrlOn) {
        this.switchLang();
      }
    } else {
      let symb = this.findKeyChar(symbol);
      if (symbol.key === 'Tab') {
        symb = '\t';
      }
      if (symbol.code === 'Space') {
        symb = ' ';
      }
      if (symbol.code === 'Enter') {
        symb = '\n';
      }
      if (symbol.code === 'Home') {
        symb = '';
      }
      this.textarea.value = value.slice(0, start) + symb + value.slice(end);
      start += 1;
    }
    this.textarea.selectionStart = start;
    this.textarea.selectionEnd = start;
  }

  findKeyChar(symbol) {
    const char = this.virtualKeyboard.querySelector(`.${symbol.code}`);
    const span = char.querySelector('span:not(.hide) span:not(.hide)');
    if (span) {
      return span.textContent;
    }
    return '';
  }

  buttonUnpressed(symbol) {
    const button = this.virtualKeyboard.querySelector(`.${symbol.code}`);
    if (symbol.code !== 'CapsLock') {
      button.classList.remove('press');
    }
    if (symbol.code === 'ShiftLeft' || symbol.code === 'ShiftRight') {
      this.shiftOn = false;
      this.chekShiftFlag();
    }
    if (symbol.code === 'ControlLeft' || symbol.code === 'ControlRight') {
      this.ctrlOn = false;
    }
    if (symbol.code === 'AltLeft' || symbol.code === 'AltRight') {
      this.altOn = false;
    }
  }

  switchLang() {
    if (this.lang === 'en') {
      this.lang = 'ru';
    } else {
      this.lang = 'en';
    }
    localStorage.setItem('lang', this.lang);
    this.checkLangFlag();
  }

  checkLangFlag() {
    const keyLang = this.virtualKeyboard.querySelectorAll('.key .span-en, .key .span-ru');
    keyLang.forEach((el) => {
      if (el.classList.contains(`span-${this.lang}`)) {
        el.classList.remove('hide');
      } else {
        el.classList.add('hide');
      }
    });
  }

  chekShiftFlag() {
    const key = this.virtualKeyboard.querySelectorAll('.key span span');
    let spanClass;

    key.forEach((el) => { el.classList.add('hide'); });

    if (this.shiftOn && this.capsOn) {
      spanClass = 'caps-shift';
    } else if (this.capsOn) {
      spanClass = 'caps-on';
    } else if (this.shiftOn) {
      spanClass = 'shift-on';
    } else {
      spanClass = 'shift-off';
    }

    key.forEach((el) => {
      if (el.classList.contains(spanClass)) {
        el.classList.remove('hide');
      }
    });
  }
}
