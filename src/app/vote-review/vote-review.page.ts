import { ViewChild, Component, Input } from '@angular/core';
import { ModalController, IonContent } from '@ionic/angular';

import { Election } from '../../classes/Election';
import { HomePage } from '../home/home.page';
import { PresentOneContestPage } from '../present-one-contest/present-one-contest.page';
import { CvrGeneratorService } from '../services/cvr-generator.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'page-vote-review',
  templateUrl: 'vote-review.page.html',
  styleUrls: ['vote-review.page.scss'],
  providers: [Election],
})
export class VoteReviewPage {
  @ViewChild(IonContent, { static: false }) content: IonContent;

  @Input() public election: Election;
  @Input() public home: HomePage;
  @Input() public scrollToContest: number;

  constructor(private readonly modalController: ModalController, private readonly cvrGeneratorService: CvrGeneratorService) {}

  ionViewDidEnter() {
    this.maybeScrollToContest();
  }

  // todo: resolve linting error
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterViewInit() {
    this.maybeScrollToContest();
  }

  maybeScrollToContest() {
    if (this.scrollToContest > 0) {
      this.scrollToContestID(this.scrollToContest);
    }
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  async closeModalCastBallot() {
    await this.modalController.dismiss();
    this.cvrGeneratorService.createCVR(this.home.election);
  }

  async oneVoteReview(contestNum: number): Promise<void> {
    this.closeModal();
    const oneContestPopupContent = { contest: this.election.getContestByIndex(contestNum), contestNum, home: this.home };
    const oneContestModal = await this.modalController.create({
      component: PresentOneContestPage,
      componentProps: oneContestPopupContent,
    });

    await oneContestModal.present();
  }

  scrollToContestID(num) {
    const titleELe = document.getElementById(`voteReviewContest#${num}`);
    const contestTop = titleELe.getBoundingClientRect().top;
    this.content.scrollToPoint(0, contestTop - 150, 300);
  }
}
