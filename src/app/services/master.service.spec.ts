import { MasterService } from './master.service';
import { ValueService } from './value.service';
import { TestBed } from '@angular/core/testing'
describe('MasterService', () => {
  let masterService: MasterService;
  let valueServiceSpy: jasmine.SpyObj<ValueService>;
  beforeEach(() => {
    const spy = jasmine.createSpyObj('ValueService', ['getValue']);
    TestBed.configureTestingModule({
      providers: [
        //Acá adjuntamos los servicios, pipes, etc... que estamos testeando
        MasterService,
        {
          provide: ValueService, useValue: spy
        }],
        //Ya que valueService tendra una instancia de spy, podriamos hacerlo acá directamente 
    });
    //Inyeccion de dependencias:
    masterService = TestBed.inject(MasterService);
    valueServiceSpy = TestBed.inject(ValueService) as jasmine.SpyObj<ValueService>;
  });

  it('should be create', () => {
    expect(masterService).toBeTruthy();
  })

  it('should call getValue from spy of ValueService', () => {
    valueServiceSpy.getValue.and.returnValue('fake value');
    expect(valueServiceSpy.getValue).toHaveBeenCalled();
    expect(valueServiceSpy.getValue).toHaveBeenCalledTimes(1);
  });

});
