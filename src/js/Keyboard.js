export default class Keyboard {

    constructor(keys) {
        this.keys = keys
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
                keyDiv.classList.add(`symbol${keyValaues.key}`);
                keyDiv.textContent = keyValaues.key;
                keyRow.append(keyDiv);
                keyDiv.addEventListener('click', () => {
                    this.buttonPressed(keyValaues);
                })
                document.addEventListener('keydown', (event) => {
                    event.preventDefault();
                    if (event.key === keyValaues.key) {
                        this.buttonPressed(keyValaues);
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
        } else {
            let symb = symbol.key;
            if (symbol.key === 'Tab') {
                symb = '\t';
            }
            this.textarea.value = this.textarea.value.slice(0, start) + symb + this.textarea.value.slice(end);
            start = start + 1;
        }
        this.textarea.selectionStart = this.textarea.selectionEnd = start;
    }
}