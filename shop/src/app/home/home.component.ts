import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Products, Product } from '../../types';
import { ProductComponent } from '../components/product/product.component';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { EditPopupComponent } from '../components/edit-popup/edit-popup.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ProductComponent,
    CommonModule,
    PaginatorModule,
    EditPopupComponent,
    ButtonModule,
  ],

  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  products: Product[] = [];

  totalRecords: number = 0;
  rows: number = 5;
  actualPage: number = 0;

  displayEditPopup: boolean = false;
  displayAddPopup: boolean = false;

  toggleEditPopup(product: Product) {
    this.selectedProduct = product;
    this.displayEditPopup = true;
  }

  toggleDeletePopup(product: Product) {
    if (!product.id) {
      return;
    }
    this.deleteProduct(product.id);
  }

  toggleAddPopup() {
    this.displayAddPopup = true;
  }

  selectedProduct: Product = {
    id: 0,
    name: '',
    image: '',
    price: '',
    rating: 0,
  };

  constructor(private productsService: ProductsService) {}

  onPageChange(event: any) {
    this.actualPage = event.page;
    this.fetchProducts(event.page, event.rows);
  }

  onConfirmAdd(product: Product) {
    console.log(product);

    this.addProduct(product);
    this.displayAddPopup = false;
  }

  onConfirmEdit(product: Product) {
    if (!this.selectedProduct.id) {
      return;
    }
    this.editProduct(product, this.selectedProduct.id);
    this.displayEditPopup = false;
  }

  fetchProducts(page: number, perPage: number) {
    this.productsService
      .getProducts('http://localhost:3000/clothes', { page, perPage })
      .subscribe({
        next: (products: Products) => {
          this.products = products.items;
          this.totalRecords = products.total;
        },
        error: (err) => console.log(err),
      });
  }

  editProduct(product: Product, id: number) {
    this.productsService
      .editProduct(`http://localhost:3000/clothes/${id}`, product)
      .subscribe({
        next: (product: Product) => {
          this.fetchProducts(this.actualPage, this.rows);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  deleteProduct(id: number) {
    this.productsService
      .deleteProduct(`http://localhost:3000/clothes/${id}`)
      .subscribe({
        next: (product: Product) => {
          this.fetchProducts(this.actualPage, this.rows);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  addProduct(product: Product) {
    this.productsService
      .addProduct(`http://localhost:3000/clothes`, product)
      .subscribe({
        next: (val) => {
          this.fetchProducts(this.actualPage, this.rows);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  ngOnInit(): void {
    this.fetchProducts(0, this.rows);
  }
}
