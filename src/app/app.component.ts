import {Component, OnInit} from '@angular/core';
import {ReachService} from './services/reach.service';
import {Supporter} from './models/supporter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'mission-life-video-messaging';

  public supporters: Supporter[];

  constructor(private reachService: ReachService) { }

  public ngOnInit() {
    this.reachService.getAllSupporters()
      .subscribe(supporters => this.supporters = supporters);
  }
}
