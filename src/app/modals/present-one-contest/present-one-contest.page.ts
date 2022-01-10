import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-present-one-contest',
  templateUrl: 'present-one-contest.page.html',
  styleUrls: ['present-one-contest.page.scss'],
})
export class PresentOneContestPage {
  @Input() public contestNum: number;

  constructor(public readonly modalController: ModalController) {}

  closeModal() {
    this.modalController.dismiss();
    // this.home.voteReviewSpecificContest(this.contestNum);
  }
}
