import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdvertismentService } from '../advertisent.service';
import { Advertisment } from '../advertisment';
import { Product } from '../product';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  Advertisment: Advertisment = {
    clicks: 0,
    description: "",
    price: 0,
    product: 0,
    id: 2
  };

  products: Product[] = new Array<Product>();

  selectedProduct: number = 0;

  constructor(private service: AdvertismentService, private router: Router) { }

  ngOnInit(): void {
    debugger;
    this.service.getProducts().subscribe((data: any[]) => {
      data.forEach(element => {
        var product: Product = {
          id: element[0],
          title: element[1],
          lastModified: element[2],
          avgPrice: element[3],
          maxPrice: element[4],
          minPrice: element[5],
          category: element[6]
        };
        this.products.push(product);
      })
    })
  }

  createAdvertisment(){
    if(this.Advertisment != null){
      debugger;
      this.Advertisment.product = this.selectedProduct;
      this.service.create(this.Advertisment).subscribe(response => {
        console.log(response);
        this.router.navigate(['/advertisment/index']);
      })
    }
  }

}
