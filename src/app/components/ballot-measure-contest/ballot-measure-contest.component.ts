import { Component, Input, OnInit } from '@angular/core';

import { Contest } from '../../services/election-model-constructor.service';

@Component({
  selector: 'app-ballot-measure-contest',
  templateUrl: './ballot-measure-contest.component.html',
  styleUrls: ['./ballot-measure-contest.component.scss'],
})
export class BallotMeasureContestComponent implements OnInit {
  @Input() contest: Contest;
  @Input() launchInVoteReviewMode: boolean;

  constructor() {}

  ngOnInit() {}
}
