import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdvertismentService } from '../advertisent.service';
import { Advertisment } from '../advertisment';

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
    product: {},
    id: 2
  };

  constructor(private service: AdvertismentService, private router: Router) { }

  ngOnInit(): void {

  }

  createAdvertisment(){
    if(this.Advertisment != null){
      this.service.create(this.Advertisment).subscribe(response => {
        console.log(response);
        this.router.navigate(['/advertisment/index']);
      })
    }
  }

}
