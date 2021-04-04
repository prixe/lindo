import {KeyCode} from './keycode';
import {Component, EventEmitter, Input, Output} from '@angular/core';

/** TODO Remplacer l'utilisation de event.keyCode */

@Component({
    selector: 'component-option-input-shortcuts',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss']
})
export class InputComponent {

    @Input() public name: string;
    @Input() public id: string;
    @Input() public model: any;
    @Output() modelChange: EventEmitter<any> = new EventEmitter();

    public _keys: Array<number> = [];

    keyDown(event: KeyboardEvent) {
        event.preventDefault();

        this._keys.forEach((key: number, index) => {
            if (key == event.keyCode) {
                delete this._keys[index];
            }
        });

        this._keys.push(event.keyCode);

        let first = true;
        let shortcut = '';

        this._keys.forEach((key) => {
            if (this._keys.length > 1 && !first) {
                shortcut += '+';
            }

            shortcut += KeyCode.getKeyCodeValue(key, false);

            first = false;
        });


        this.model = shortcut.toLowerCase();
        this.modelChange.emit(this.model);
    }

    keyUp(event: KeyboardEvent) {
        delete this._keys[this._keys.indexOf(event.keyCode)];
    }

    erase() {
        this.model = '';
        this.modelChange.emit(this.model);
    }

}
