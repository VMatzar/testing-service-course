import { ProductsService } from './products.service';
import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CreateProductDTO, Product, UpdateProductDTO } from '../models/product.model';
import { environment } from 'src/environments/environment';
import { generateManyProducts, generateOneProduct } from '../models/product.mock';
import { HttpStatusCode, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { TokenService } from './token.service';

describe('ProductsService', () => {
    let productService: ProductsService;
    let httpController: HttpTestingController;
    let tokenService: TokenService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                ProductsService,
                TokenService,
                {
                    provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true
                }
            ]
        });
        //Inyeccion de dependencias:
        productService = TestBed.inject(ProductsService);
        httpController = TestBed.inject(HttpTestingController);
        tokenService = TestBed.inject(TokenService);
    });

    afterEach(() => {
        httpController.verify();
    });

    it('should be create', () => {
        expect(productService).toBeTruthy();
    })


    describe('Test for getAllSimple', () => {
        it('should return a product list', (doneFn) => {
            //arrange:
            const mockData: Product[] = generateManyProducts(3);
            spyOn(tokenService, 'getToken').and.returnValue('123')
            //Act
            productService.getAll().subscribe((data) => {
                expect(data.length).toEqual(mockData.length);
                // expect(data).toEqual(mockData);
                doneFn();
            })

            //http config
            const url = `${environment.API_URL}/api/v1/products`
            const req = httpController.expectOne(url);
            const headers = req.request.headers;
            expect(headers.get('Authorization')).toEqual(`Bearer 123`);
            req.flush(mockData);
            // httpController.verify();
        });

        it('should return a product list with taxes', (doneFn) => {
            //arrange:
            const mockData: Product[] = [
                {
                    ...generateOneProduct(),
                    price: 100, //100 * 0.19 = 19
                },
                {
                    ...generateOneProduct(),
                    price: 200, //200 * 0.19 = 38
                },
                {
                    ...generateOneProduct(),
                    price: 0, //0 * .19 = 0
                },
                {
                    ...generateOneProduct(),
                    price: -100, // = -10 Sin embargo queremos un 0
                },
            ];
            productService.getAll().subscribe((data) => {
                expect(data.length).toEqual(mockData.length);
                expect(data[0].taxes).toEqual(19);
                expect(data[1].taxes).toEqual(38);
                expect(data[2].taxes).toEqual(0);
                expect(data[3].taxes).toEqual(0);
                doneFn();
            })

            //http config
            const url = `${environment.API_URL}/api/v1/products`
            const req = httpController.expectOne(url);
            req.flush(mockData);
            // httpController.verify();
        })

        it('should send query params width limit 10 offset 3', (doneFn) => {
            //Arrange
            const mockData: Product[] = generateManyProducts(3);
            const limit = 10;
            const offset = 3;
            //Act
            productService.getAll(limit, offset)
                .subscribe((data) => {
                    //Assert
                    expect(data.length).toEqual(mockData.length);
                    doneFn();
                });
            //http config
            const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
            const req = httpController.expectOne(url);
            req.flush(mockData);
            const params = req.request.params;
            expect(params.get('limit')).toEqual(`${limit}`);
            expect(params.get('offset')).toEqual(`${offset}`);
            // httpController.verify();
        });
    });

    describe('Test for create', () => {
        it('Should return a new product', (doneFn) => {
            //Arrange
            const mockData = generateOneProduct();
            const dto: CreateProductDTO = {
                title: 'new Product',
                price: 100,
                images: ['img'],
                description: 'bla bla bla',
                categoryId: 12
            }
            //Act
            // productService.create(dto) //Imaginemos que en este método, cambiamos el valor de dto, por mutación el valor de este en la prueba tambien cambiará
            productService.create({ ...dto }) //Mejor enviemoslo de forma de que no pueda mutar, para que el valor de esta variable se conserve en esta prueba.
                .subscribe(data => {
                    expect(data).toEqual(mockData);
                    doneFn();
                });
            //Assert //http config
            const url = `${environment.API_URL}/api/v1/products`;
            const req = httpController.expectOne(url);
            req.flush(mockData); //Simulamos que este sea la respuesta
            expect(req.request.body).toEqual(dto);
            expect(req.request.method).toEqual('POST');
            // httpController.verify();
        })
    })


    describe('Test for put', () => {
        it('Should return a new product', (doneFn) => {
            //Arrange
            const mockData = generateOneProduct();
            const dto: UpdateProductDTO = {
                title: 'new Product tile',
            }
            const idRandom = String(Math.random() * 10);
            //Act
            productService.update(idRandom, { ...dto })
                .subscribe(data => {
                    expect(data).toEqual(mockData);
                    doneFn();
                });
            //Assert //http config
            const url = `${environment.API_URL}/api/v1/products/${idRandom}`;
            const req = httpController.expectOne(url);
            req.flush(mockData); //Simulamos que este sea la respuesta
            expect(req.request.body).toEqual(dto);
            expect(req.request.method).toEqual('PUT');
        })
    })


    describe('Test for delete', () => {
        it('Should return true', (doneFn) => {
            //Arrange
            const mockData = true;
            const idRandom = String(Math.random() * 10);
            //Act
            productService.delete(idRandom)
                .subscribe(dataBoolean => {
                    expect(dataBoolean).toBeTrue();
                    doneFn();
                });
            //Assert 
            const url = `${environment.API_URL}/api/v1/products/${idRandom}`;
            const req = httpController.expectOne(url);
            req.flush(mockData); //Simulamos que la respuesta sea true
            expect(req.request.method).toEqual('DELETE');
        })
    })


    describe('Test for getOne', () => {
        it('Should return a new product', (doneFn) => {
            //Arrange
            const mockData = generateOneProduct();
            const idRandom = String(Math.random() * 10);
            //Act
            productService.getOne(idRandom)
                .subscribe(data => {
                    expect(data).toEqual(mockData);
                    doneFn();
                });
            //Assert //http config
            const url = `${environment.API_URL}/api/v1/products/${idRandom}`;
            const req = httpController.expectOne(url);
            req.flush(mockData); //Simulamos que este sea la respuesta
            expect(req.request.method).toEqual('GET');
        })


        it('Should return the message when the status code is 404', (doneFn) => {
            //Arrange
            const idRandom = String(Math.random() * 10);
            const msgError = '404 message';
            const mockError = {
                status: HttpStatusCode.NotFound, //Code error 404
                statusText: msgError
            }
            //Act
            productService.getOne(idRandom)
                .subscribe({
                    error: (err) => {
                        //Assert
                        expect(err).toEqual('El producto no existe');
                        doneFn();
                    },
                });
            //Assert //http config
            const url = `${environment.API_URL}/api/v1/products/${idRandom}`;
            const req = httpController.expectOne(url);
            req.flush(msgError, mockError); //Simulamos que este sea la respuesta, mockError seria como el header
            expect(req.request.method).toEqual('GET');
        })
    })
});

