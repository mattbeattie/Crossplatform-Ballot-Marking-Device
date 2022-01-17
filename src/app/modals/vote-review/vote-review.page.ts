import { ViewChild, Component, Input } from '@angular/core';
import { ModalController, IonContent } from '@ionic/angular';

@Component({
  selector: 'app-vote-review',
  templateUrl: 'vote-review.page.html',
  styleUrls: ['vote-review.page.scss'],
})
export class VoteReviewPage {
  @ViewChild(IonContent, { static: false }) content: IonContent;
  @Input() public scrollToContest: number;

  constructor(private readonly modalController: ModalController) {}

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

  async closeModal(shouldCastBallot: boolean) {
    await this.modalController.dismiss({ shouldCastBallot });
  }

  async oneVoteReview(contestNum: number): Promise<void> {
    console.log('🚀 ~ file: vote-review.page.ts ~ line 45 ~ VoteReviewPage ~ oneVoteReview ~ contestNum', contestNum);
    this.closeModal(false);
    // const oneContestPopupContent = { contest: this.election.getContestByIndex(contestNum), contestNum, home: this.home };
    // const oneContestModal = await this.modalController.create({
    //   component: PresentOneContestPage,
    //   componentProps: oneContestPopupContent,
    // });

    // await oneContestModal.present();
  }

  scrollToContestID(num) {
    const titleELe = document.getElementById(`voteReviewContest#${num}`);
    const contestTop = titleELe.getBoundingClientRect().top;
    this.content.scrollToPoint(0, contestTop - 150, 300);
  }
}
