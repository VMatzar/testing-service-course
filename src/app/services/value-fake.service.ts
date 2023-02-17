export class FakeValueService {
  constructor() { }
  getValue(): string {
    return 'fake value';
  }
  setValue(value: string): void {}
  getPromiseValue(){
    return Promise.resolve('fake promise value');
  }
}
