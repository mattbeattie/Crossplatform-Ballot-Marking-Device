import { OnInit, Component, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonSlides } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { TranslateService } from '@ngx-translate/core';

import { ModalPopupPage } from '../modal-popup/modal-popup.page';
import { VoteReviewPage } from '../vote-review/vote-review.page';
import { SettingsPage } from '../settings/settings.page';
import { WriteinModalPage } from '../writein-modal/writein-modal.page';

import { ElectionModelService, Election } from '../services/election-model.service';

const DEFAULT_ELECTION_FILE = `/assets/data/64K_1Contest.xml`;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('mySlider') slides: IonSlides;

  sliderConfig = {
    effect: 'cube',
    autoHeight: true,
  };

  // todo: better type once you have it, also - private? not sure
  election: Election;
  electionIsLoaded: boolean;
  remainingVotes: number;

  // legacy properties below
  public currentContest = 1;
  public title: string;
  public titleTwo: string;
  public description: string;
  public name: string;

  constructor(
    private readonly modalController: ModalController,
    private readonly translate: TranslateService,
    private readonly electionModelService: ElectionModelService
  ) {
    SplashScreen.show({
      showDuration: 2000,
      autoHide: true,
    });
  }

  ngOnInit() {
    if (window.Intl && typeof window.Intl === 'object') {
      this.translate.setDefaultLang('en');
      this.translate.use(navigator.language);
    }

    this.electionModelService.getElection(DEFAULT_ELECTION_FILE).then((election) => {
      this.election = election;
      this.electionIsLoaded = true;
    });
  }

  // SLIDE TRANSITIONS - are these between... contests?

  slideNext() {
    this.slides.slideNext();
    this.currentContest++;
    const contestCount = this.election.contests.length;
    this.currentContest = this.currentContest >= contestCount ? contestCount : this.currentContest;
  }

  slidePrevious() {
    this.slides.slidePrev();
    this.currentContest--;
    this.currentContest = this.currentContest <= 0 ? 1 : this.currentContest;
  }

  // MODAL LAUNCHERS

  async openVoteReviewModal(): Promise<void> {
    const componentProps = {
      scrollToContest: 0,
      election: this.election,
      title: 'Vote Review',
      body: 'election review goes here',
    };
    const modal = await this.modalController.create({ component: VoteReviewPage, componentProps });
    await modal.present();
  }

  async voteReviewSpecificContest(contestNumber: number): Promise<void> {
    const componentProps = {
      scrollToContest: contestNumber,
      election: this.election,
      title: 'Vote Review',
      body: 'election review goes here',
    };
    const modal = await this.modalController.create({ component: VoteReviewPage, componentProps });
    await modal.present();
  }

  async openSettingsModal(): Promise<void> {
    const componentProps = {};
    const modal = await this.modalController.create({ component: SettingsPage, componentProps });
    await modal.present();
  }

  async maybeOpenWriteInModal(candidate: any): Promise<void> {
    // todo: figure out how to do this now
    if (candidate.isWriteIn()) {
      const componentProps = {
        title: 'Write-In Candidate',
        body: 'write-in election review goes here',
        writeinName: candidate.personName,
      };
      const modal = await this.modalController.create({ component: WriteinModalPage, componentProps });
      await modal.present();
      modal.onDidDismiss().then((data) => {
        // todo: what is data? what is.... data.data? can we use better variable names here?
        if (data.data.trim().length > 0) {
          candidate.personName = data.data;
        } else {
          candidate.personName = candidate.writeInConst;
        }
      });
    }
  }

  // todo: what is this?
  async openIonModal(data: any): Promise<void> {
    const componentProps = {
      title: data.title,
      body: data.body,
    };
    const modal = await this.modalController.create({ component: ModalPopupPage, componentProps });
    await modal.present();
  }
}
