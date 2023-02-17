import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { Auth } from '../models/auth.model';
import { environment } from '../../environments/environment';

fdescribe('AuthService', () => {
    let authService: AuthService;
    let httpController: HttpTestingController;
    let tokenService: TokenService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ],
            providers: [
                AuthService,
                TokenService
            ]
        });
        authService = TestBed.inject(AuthService);
        httpController = TestBed.inject(HttpTestingController);
        tokenService = TestBed.inject(TokenService);
    });

    afterEach(() => {
        httpController.verify();
    });

    it('should be create', () => {
        expect(authService).toBeTruthy();
    });

    describe('test for login', () => {
        it('should return a token', (doneFn) => {
            //Arrange
            const mockData: Auth = {
                access_token: '121212'
            };
            const email = 'cesar@gmail.com';
            const password = '1212';
            //Act
            authService.login(email, password).subscribe((data) => {
                //Assert
                expect(data).toEqual(mockData);
                doneFn();
            });
            //http config
            const url = `${environment.API_URL}/api/v1/auth/login`;
            const req = httpController.expectOne(url);
            req.flush(mockData);
        });
    });

    it('should call to saveToken', (doneFn) => {
        //Arrange
        const mockData: Auth = {
            access_token: '121212'
        }; //Simulación de respuesta del backend
        const email = 'elmatzar123@gmail.com';
        const password = '1212';
        spyOn(tokenService, 'saveToken').and.callThrough();
        //saveToken no tiene return, por ello en lugar de poner return
        //spyOn(tokenService, 'saveToken') seria todo, pero poner esto, en realidad estaria llamando
        //a la función y no espiandola, por ello callThrough permite no llamar a la función, solo espiarla.
        
        //Act
        authService.login(email, password).subscribe((data) => {
            //Assert
            expect(data).toEqual(mockData);
            expect(tokenService.saveToken).toHaveBeenCalledTimes(1);
            expect(tokenService.saveToken).toHaveBeenCalledOnceWith('121212'); //toHaveBeenCalledOnceWith permite preguntar con que argumentos se llamó
            doneFn();
        });
        //http config
        const url = `${environment.API_URL}/api/v1/auth/login`;
        const req = httpController.expectOne(url);
        req.flush(mockData);
    });
});