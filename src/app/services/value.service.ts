import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValueService {
  private value = 'my value';
  constructor() { }
  getValue(): string {
    //a lot of code
    //10 lines of code
    //request to a GOOGLE-MAPS with a key
    return this.value;
  }
  setValue(value: string): void {
    this.value = value;
  }
  getPromiseValue(){
    return Promise.resolve('promise value');
  }
  getObservableValue(): Observable<string>{
    return of('observable value');
  }
}
