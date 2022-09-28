import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class DarkService {

    private darkModeListener = new Subject<boolean>();

    getDarkModeListener(): Observable<boolean> {
        return this.darkModeListener.asObservable();
    }

    emitValue(value: boolean) {
        this.darkModeListener.next(value);
    }

}