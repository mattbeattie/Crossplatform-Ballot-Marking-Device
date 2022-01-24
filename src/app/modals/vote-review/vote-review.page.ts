import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Election } from '../../services/election-model-constructor.service';

@Component({
  selector: 'app-vote-review',
  templateUrl: 'vote-review.page.html',
  styleUrls: ['vote-review.page.scss'],
})
export class VoteReviewPage {
  @Input() election: Election;

  launchInVoteReviewMode = true;

  constructor(private readonly modalController: ModalController) {}

  async closeModal(shouldCastBallot: boolean) {
    await this.modalController.dismiss({ shouldCastBallot });
  }
}
