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

  Advertisments : any;

  constructor(private service: AdvertismentService, private router: Router) { }

  ngOnInit(): void {
    this.retrieveAdvertisments();
  }

  retrieveAdvertisments(){
    this.service.getAll()
      .subscribe(data => {
        debugger;
        this.Advertisments = data;
      })
  }
  navigate(id: number){
      this.router.navigateByUrl(`advertisment/${id}/view`);
      return false;
  }

}
