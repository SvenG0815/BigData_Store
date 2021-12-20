import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AdvertismentService } from '../advertisent.service';
import { Advertisment } from '../advertisment';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  Advertisments: any;

  constructor(private service: AdvertismentService, private router: Router) {  }

  ngOnInit(): void {
    this.retrieveAdvertisments();
  }

  retrieveAdvertisments() {
    this.service.getAll()
      .subscribe((data: []) => {
        this.Advertisments = [];
        console.log(data)
        data.forEach(element => {
          var ad: Advertisment = {
            id: element[0],
            product: element[1],
            price: element[3],
            description: element[4],
            clicks: element[5]
          };
          ad.price = Math.round(ad.price * 100) / 100;
          this.Advertisments.push(ad)
        })
      })
  }
  navigate(id: number) {
    this.router.navigateByUrl(`advertisment/${id}/view`);
    return false;
  }

}
