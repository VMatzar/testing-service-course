import { ValueService } from './value.service';
import { TestBed } from '@angular/core/testing'
describe('ValueService', () => {
  let service: ValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValueService], //Acá adjuntamos los servicios, pipes que estamos testeando
    });
    //Ya no tenemos que crear una instancia :), TestBed lo hará por nosotros
    // service = new ValueService();
    //Inyeccion de dependencias:
    service = TestBed.inject(ValueService);
  });

  it('should be create', () => {
    expect(service).toBeTruthy();
  })

  describe('Tests for getValue', () => {
    it('should return "my value"', () => {
      expect(service.getValue()).toBe('my value');
      service.setValue('I am a new value');
      expect(service.getValue()).toBe('I am a new value');
    })
  })

  describe('Tests for getPromiseValue', () => {
    it('should return a "promise value" from promise with then', (doneFn) => {
      service.getPromiseValue().then((value) => {
        //Assert:
        expect(value).toBe('promise value');
        doneFn();
      })
    })
    it('should return a "promise value" from promise using async', async () => {
      const rta = await service.getPromiseValue();
      expect(rta).toBe('promise value');
    })
  })

  describe('Tests for getObservableValue', () => {
    it('should return a "observable value" from observable with subscribe', (doneFn) => {
      service.getObservableValue().subscribe({
        next: (value) => {
          expect(value).toBe('observable value');
          doneFn();
        }
      })
    })
  })
});
