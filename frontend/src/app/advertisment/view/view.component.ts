import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdvertismentService } from '../advertisent.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  constructor(private service: AdvertismentService, private route: ActivatedRoute) { }
  ad: any;

  ngOnInit(): void {
    debugger;
    var idString = this.route.snapshot.paramMap.get('id');
    if(idString != null){
      var id = Number.parseInt(idString);
      this.loadAdvertisment(idString);
    }
  }

  loadAdvertisment(id: string){
    this.service.get(id).subscribe(data => {
      debugger;
      this.ad = data;
    })
    
  }



}
