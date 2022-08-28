import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, VirtualTimeScheduler } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {




  private baseUrl: string = 'http://localhost:2023/api/products';

  private categoryUrl: string = 'http://localhost:2023/api/product-category';

  constructor(private httpClient: HttpClient) { }


  getProductListPaginate(thePage: number, thePageSize: number, theCategoryId: number): Observable<GetResponseProducts> {
    //need to build URL based on category id,page and size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}` + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);

  }


  getProductList(theCategoryId: number): Observable<Product[]> {
    //TODO need to build URL based on category id ... will come back to this
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchUrl);

  }


  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(map(response => response._embedded.productCategory));
  }

  searchProducts(theKeyWord: string): Observable<Product[]> {
    //need to build URL based on the keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyWord}`;
    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thePage: number, thePageSize: number, theKeyWord: string): Observable<GetResponseProducts> {
    //need to build URL based on keyword,page and size
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyWord}` + `&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);

  }

  getProducts(url: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(url).pipe(map(response => response._embedded.products));
  }


  getProduct(theProductId: number): Observable<Product> {
    //need to build URL based on product id
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }


}



export interface GetResponseProducts {

  _embedded: {
    products: Product[];
  },

  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }

}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
