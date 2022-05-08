export default class Keyboard {

    constructor(keys) {
        this.keys = keys;
        this.shiftOn = false;
    }

    renderKeys() {

        const virtualKeyboard = document.createElement('div');
        virtualKeyboard.classList.add('virtual-keyboard');

        const h1 = document.createElement('h1');
        h1.textContent = 'RSS Виртуальная клавиатура';
        virtualKeyboard.append(h1);

        const textarea = this.textarea = document.createElement('textarea');
        virtualKeyboard.append(textarea);

        const keyboardArea = document.createElement('div');
        keyboardArea.classList.add('keyboard-area');
        virtualKeyboard.append(keyboardArea);

        this.keys.forEach(el => {
            let keyRow = document.createElement('div');
            keyRow.classList.add('key-row');
            keyboardArea.append(keyRow);
            el.forEach(keyValaues => {

                let keyDiv = document.createElement('div');
                keyDiv.classList.add('key');
                keyDiv.classList.add(keyValaues.code);

                let spanRus = document.createElement('span');
                spanRus.classList.add('span-rus');
                keyDiv.append(spanRus);

                let spanShiftOff = document.createElement('span');
                spanShiftOff.classList.add('shift-off');
                if(keyValaues.ru) {
                    spanShiftOff.textContent = keyValaues.ru.key;
                }
                spanRus.append(spanShiftOff);

                let spanShiftOn = document.createElement('span');
                spanShiftOn.classList.add('shift-on', 'hide');
                spanShiftOn.textContent = keyValaues.shiftKey;
                spanRus.append(spanShiftOn);

                let spanCapsOn = document.createElement('span');
                spanCapsOn.classList.add('caps-on', 'hide');
                spanCapsOn.textContent = keyValaues.shiftKey;
                spanRus.append(spanCapsOn);

                let spanCapsShift = document.createElement('span');
                spanCapsShift.classList.add('caps-shift', 'hide');
                spanCapsShift.textContent = keyValaues.shiftKey;
                spanRus.append(spanCapsShift);   
                
                let spanEn = document.createElement('span');
                spanRus.classList.add('span-en');
                keyDiv.append(spanEn);

                let spanShiftOffEn = document.createElement('span');
                spanShiftOffEn.classList.add('shift-off');
                spanShiftOffEn.textContent = keyValaues.key;
                spanRus.append(spanShiftOffEn);

                let spanShiftOnEn = document.createElement('span');
                spanShiftOnEn.classList.add('shift-on', 'hide');
                spanShiftOnEn.textContent = keyValaues.shiftKey;
                spanRus.append(spanShiftOnEn);

                let spanCapsOnEn = document.createElement('span');
                spanCapsOnEn.classList.add('caps-on', 'hide');
                spanCapsOnEn.textContent = keyValaues.shiftKey;
                spanRus.append(spanCapsOnEn);

                let spanCapsShiftEn = document.createElement('span');
                spanCapsShiftEn.classList.add('caps-shift', 'hide');
                spanCapsShiftEn.textContent = keyValaues.shiftKey;
                spanRus.append(spanCapsShiftEn);   

                keyRow.append(keyDiv);

                keyDiv.addEventListener('click', () => {
                    this.buttonPressed(keyValaues);
                })
                document.addEventListener('keydown', (event) => {
                    event.preventDefault();
                    if (event.code === keyValaues.code) {
                        this.buttonPressed(keyValaues);
                    }
                })
                document.addEventListener('keyup', (event) => {
                    event.preventDefault();
                    if (event.code === keyValaues.code) {
                        this.buttonUnpressed(keyValaues);
                    }
                })
            })
        });
        return virtualKeyboard;
    }

    buttonPressed(symbol) {
        let start = this.textarea.selectionStart;
        let end = this.textarea.selectionEnd;
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
            console.log(this.shiftOn);
        } else {
            let symb = symbol.key;
            if (this.shiftOn) {
                symb = symbol.shiftKey;
            }
            if (symbol.key === 'Tab') {
                symb = '\t';
            }
            this.textarea.value = this.textarea.value.slice(0, start) + symb + this.textarea.value.slice(end);
            start = start + 1;
        }
        this.textarea.selectionStart = this.textarea.selectionEnd = start;
    }

    buttonUnpressed(symbol) {
        if (symbol.key === 'Shift') {
            this.shiftOn = false;
            console.log(this.shiftOn);
        }
    }
}