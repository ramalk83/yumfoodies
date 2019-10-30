import { Component, OnInit ,Inject} from '@angular/core';
import {Leader} from '../shared/leader';
import {LEADERS} from '../shared/leaders';
import {LeaderService} from '../services/leader.service';
import { flyInOut, expand } from '../animations/animation';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  
  leaders :Leader[];
  selectedLeader:Leader;
  errmess:string;

  constructor(private leaderService:LeaderService,
   @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
  this.leaderService.getLeaders()
  .subscribe(leaders=>this.leaders=leaders,
    errmess =>this.errmess =<any> errmess)
  }
 onSelect(leader:Leader){
   this.selectedLeader=leader;
 }
}
