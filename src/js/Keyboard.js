export default class Keyboard {

    constructor(keys) {
        this.keys = keys;
        this.shiftOn = false;
        this.capsOn = false;
        this.ctrlOn = false;
        this.altOn = false;
        this.lang = localStorage.getItem('lang') || 'en';
    }

    createElment(element, className) {
        let elem = document.createElement(element);
        elem.classList.add(className);
        return elem;
    }

    renderKeys() {

        const virtualKeyboard = this.createElment('div', 'virtual-keyboard');

        const h1 = this.createElment('h1', 'project-name');
        h1.textContent = "RSS Виртуальная клавиатура";
        virtualKeyboard.append(h1);

        const textarea = this.textarea = this.createElment('textarea', 'textarea');
        virtualKeyboard.append(textarea);

        const keyboardArea = this.createElment('div', 'keyboard-area');
        virtualKeyboard.append(keyboardArea);

        this.keys.forEach(el => {

            const keyRow = this.createElment('div', 'key-row');
            keyboardArea.append(keyRow);

            el.forEach(keyValues => {

                const keyDiv = this.createElment('div', 'key');
                keyDiv.classList.add(keyValues.code);

                const keyEn = keyValues;
                const keyRu = keyValues.ru || keyValues;

                // RU

                const spanRus = this.createElment('span', 'span-ru');
                if (this.lang === 'ru') {
                    spanRus.classList.remove('hide');
                } else {
                    spanRus.classList.add('hide');
                }
                
                keyDiv.append(spanRus);

                let spanShiftOff = this.createElment('span', 'shift-off');
                spanShiftOff.textContent = keyRu.key;
                spanRus.append(spanShiftOff);

                let spanShiftOn = this.createElment('span', 'shift-on');
                spanShiftOn.classList.add('hide');
                spanShiftOn.textContent = keyRu.shiftKey;
                spanRus.append(spanShiftOn);

                let spanCapsOn = this.createElment('span', 'caps-on');
                spanCapsOn.classList.add('hide');
                if (keyRu.notCaps) {
                    spanCapsOn.textContent = keyRu.key;
                } else {
                    spanCapsOn.textContent = keyRu.shiftKey;
                }
                spanRus.append(spanCapsOn);

                let spanCapsShift = this.createElment('span', 'caps-shift');
                spanCapsShift.classList.add('hide');
                if (keyRu.notCaps) {
                    spanCapsShift.textContent = keyRu.shiftKey;
                } else {
                    spanCapsShift.textContent = keyRu.key;
                }
                spanRus.append(spanCapsShift);

                // EN

                const spanEn = this.createElment('span', 'span-en');
                if (this.lang === 'en') {
                    spanEn.classList.remove('hide');
                } else {
                    spanEn.classList.add('hide');
                }
                keyDiv.append(spanEn);

                let spanShiftOffEn = this.createElment('span', 'shift-off');
                spanShiftOffEn.textContent = keyEn.key;
                spanEn.append(spanShiftOffEn);

                let spanShiftOnEn = this.createElment('span', 'shift-on');
                spanShiftOnEn.classList.add('hide');
                spanShiftOnEn.textContent = keyEn.shiftKey;
                spanEn.append(spanShiftOnEn);

                let spanCapsOnEn = this.createElment('span', 'caps-on');
                spanCapsOnEn.classList.add('hide');
                if (keyEn.notCaps) {
                    spanCapsOnEn.textContent = keyEn.key;
                } else {
                    spanCapsOnEn.textContent = keyEn.shiftKey;
                }
                spanEn.append(spanCapsOnEn);

                let spanCapsShiftEn = this.createElment('span', 'caps-shift');
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
                })
                keyDiv.addEventListener('mouseup', () => {
                    this.buttonUnpressed(keyValues);
                })
                document.addEventListener('keydown', (event) => {
                    event.preventDefault();
                    if (event.code === keyValues.code) {
                        this.buttonPressed(keyValues);
                    }
                })
                document.addEventListener('keyup', (event) => {
                    event.preventDefault();
                    if (event.code === keyValues.code) {
                        this.buttonUnpressed(keyValues);
                    }
                })
            })
        });
        return virtualKeyboard;
    }

    buttonPressed(symbol) {
        let start = this.textarea.selectionStart;
        let end = this.textarea.selectionEnd;
        const button = document.querySelector(`.${symbol.code}`);
        button.classList.add('press');
        if (symbol.key === 'Backspace') {
            if (start > 0) {
                this.textarea.value = this.textarea.value.slice(0, start - 1) + this.textarea.value.slice(end);
                this.textarea.focus();
                start = start - 1;
            }
        } else if (symbol.key === 'Delete') {
            if (end < this.textarea.value.length) {
                this.textarea.value = this.textarea.value.slice(0, start) + this.textarea.value.slice(end + 1);
                this.textarea.focus();
            }
        } else if (symbol.key === 'Shift') {
            this.shiftOn = true;
            this.chekShiftFlag();
        } else if (symbol.key === 'CapsLock') {
            this.capsOn = !this.capsOn;
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
            this.textarea.value = this.textarea.value.slice(0, start) + symb + this.textarea.value.slice(end);
            start = start + 1;
        }
        this.textarea.selectionStart = this.textarea.selectionEnd = start;
    }

    findKeyChar(symbol) {
        let char = document.querySelector(`.${symbol.code}`);
        let span = char.querySelector('span:not(.hide) span:not(.hide)');
        if (span) {
            return span.textContent;
        } else {
            return '';
        }
    }

    buttonUnpressed(symbol) {
        const button = document.querySelector(`.${symbol.code}`);
        button.classList.remove('press');
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
            this.lang = 'en'
        }
        localStorage.setItem('lang', this.lang);
        this.checkLangFlag();
    }

    checkLangFlag() {
        const keyLang = document.querySelectorAll('.key .span-en, .key .span-ru');
        keyLang.forEach(el => {
            if (el.classList.contains(`span-${this.lang}`)) {
                el.classList.remove('hide');
            } else {
                el.classList.add('hide');
            }
        })
    }

    chekShiftFlag() {
        const key = document.querySelectorAll(`.key .span-${this.lang} span`);
        let spanClass;

        key.forEach(el => { el.classList.add('hide') });

        if (this.shiftOn && this.capsOn) {
            spanClass = 'caps-shift';
        } else if (this.capsOn) {
            spanClass = 'caps-on';
        } else if (this.shiftOn) {
            spanClass = 'shift-on';
        } else {
            spanClass = 'shift-off';
        }

        key.forEach(el => {
            if (el.classList.contains(spanClass)) {
                el.classList.remove('hide');
            }
        })
    }
}