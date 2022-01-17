import { ViewChild, Component, Input } from '@angular/core';
import { ModalController, IonContent } from '@ionic/angular';

import { Election } from '../../services/election-model-constructor.service';

@Component({
  selector: 'app-vote-review',
  templateUrl: 'vote-review.page.html',
  styleUrls: ['vote-review.page.scss'],
})
export class VoteReviewPage {
  @ViewChild(IonContent, { static: false }) content: IonContent;

  @Input() election: Election;

  launchInVoteReviewMode = true;

  constructor(private readonly modalController: ModalController) {}

  async closeModal(shouldCastBallot: boolean) {
    await this.modalController.dismiss({ shouldCastBallot });
  }
}
