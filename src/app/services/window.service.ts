import {Injectable} from '@angular/core';

@Injectable()
export class WindowService {

    get window() : Window | any {
        return window;
    }
}
