import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { GetResponseProducts, ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  // templateUrl: './product-list.component.html',
  // templateUrl: './product-list-table.component.html', 
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  //new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  //
  previousKeyword: string = '';


  constructor(private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
  }


  listProducts() {


    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {

      this.handleListProducts();
    }

  }
  handleSearchProducts() {
    const theKeyWord: string = this.route.snapshot.params['keyword'];

    //if we have a different keyword than previous
    //then set thePageNumber to 1

    if (this.previousKeyword != theKeyWord) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyWord;

    console.log(`keyword=${theKeyWord},  thePageNumber=${this.thePageNumber}`);

    this.productService.searchProductsPaginate(this.thePageNumber - 1, this.thePageSize, theKeyWord).subscribe(this.processResult())
  }

  handleListProducts() {
    //check if id param is available

    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      //get the id param string convert to number using the "+" symbol
      // old version is this.route.snapshot.paramMap.get('id');
      this.currentCategoryId = +this.route.snapshot.params['id'];
    } else {

      this.currentCategoryId = 1;

    }

    //check if we have a different category than previous
    //Note : Angular Will reuse a component if it is currently being viewed
    //if we have a different category id than previous
    //the set thePageNumber back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategories=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`)


    //now get the products for the given category id 
    //pagination component:page are 1 based or in Spring data REST: pages are 0 based
    this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId).subscribe(this.processResult())
  }

  processResult() {
    /**{ _embedded: { products: Product[]; }; page: { number: number; size: number; totalElements: number; }; } */

    return (data: GetResponseProducts) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  updatePageSize(pageSize: number) {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();

  }

  addToCart(theProduct: Product) {

    console.log(`Adding to cart ${theProduct.name}, ${theProduct.unitPrice}`);

    //TODO ... do the real work
    const theCartItem = new CartItem(theProduct)

    this.cartService.addToCart(theCartItem);


  }
}
