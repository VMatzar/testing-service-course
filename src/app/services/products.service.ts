import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { retry, catchError, map } from 'rxjs/operators';
import { throwError, zip, Observable } from 'rxjs';

import { Product, CreateProductDTO, UpdateProductDTO } from './../models/product.model';
// import { checkTime } from './../interceptors/time.interceptor';
import { environment } from './../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {

    private apiUrl = `${environment.API_URL}/api/v1`;

    constructor(
        private http: HttpClient
    ) { }
    getAllSimple() {
        return this.http.get<Product[]>(`${this.apiUrl}/products`);
    }
    getByCategory(categoryId: string, limit?: number, offset?: number) {
        let params = new HttpParams();
        if (limit && offset != null) {
            params = params.set('limit', limit);
            params = params.set('offset', offset);
        }
        return this.http.get<Product[]>(`${this.apiUrl}/categories/${categoryId}/products`, { params })
    }

    getAll(limit?: number, offset?: number): Observable<Product[]> {
        let params = new HttpParams();
        if (limit && offset != null) {
            params = params.set('limit', limit);
            params = params.set('offset', offset);
        }
        return this.http.get<Product[]>(`${this.apiUrl}/products`, { params })
            .pipe(
                retry(3),
                map(products => products.map(item => {
                    return {
                        ...item,
                        taxes: item.price > 0 ? .19 * item.price : 0
                    }
                }))
            );
    }

    fetchReadAndUpdate(id: string, dto: UpdateProductDTO) {
        return zip(
            this.getOne(id),
            this.update(id, dto)
        );
    }

    getOne(id: string) {
        return this.http.get<Product>(`${this.apiUrl}/products/${id}`)
            .pipe(catchError((error: HttpErrorResponse) => {
                if (error.status === HttpStatusCode.Conflict) { //Error 409
                    return throwError(() => 'Algo esta fallando en el server');
                }
                if (error.status === HttpStatusCode.NotFound) { //Error 404
                    return throwError(() => 'El producto no existe');
                }
                if (error.status === HttpStatusCode.Unauthorized) { //Error 401
                    return throwError(() => 'No estas permitido');
                }
                return throwError(() => 'Ups algo salio mal');
            })
            )
    }

    create(dto: CreateProductDTO): Observable<Product> {
        return this.http.post<Product>(`${this.apiUrl}/products`, dto);
    }

    update(id: string, dto: UpdateProductDTO): Observable<Product> {
        return this.http.put<Product>(`${this.apiUrl}/products/${id}`, dto);
    }

    delete(id: string): Observable<boolean> {
        return this.http.delete<boolean>(`${this.apiUrl}/products/${id}`);
    }
}