import { OnInit, Component, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonSlides } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { TranslateService } from '@ngx-translate/core';

import { VoteReviewPage } from '../modals/vote-review/vote-review.page';
import { SettingsPage } from '../modals/settings/settings.page';
import { WriteInPage } from '../modals/write-in/write-in.page';

import { ElectionFileFetcherService } from '../services/election-model-fetcher.service';
import { ElectionModelConstructorService, Election } from '../services/election-model-constructor.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('contestSlider') contestSlides: IonSlides;

  sliderConfig = {
    effect: 'cube',
    autoHeight: true,
  };

  election: Election;
  electionIsLoaded: boolean;
  currentElectionFile = `/assets/data/64K_1Contest.xml`;
  currentContest = 1;

  constructor(
    private readonly modalController: ModalController,
    private readonly translate: TranslateService,
    private readonly electionFileFetcherService: ElectionFileFetcherService,
    private readonly electionModelConstructorService: ElectionModelConstructorService
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
    this.fetchAndLoadElection(this.currentElectionFile);
  }

  // EVENT HANDLERS

  /**
   * Navigates to the next contest
   */
  goToNextContest() {
    this.contestSlides.slideNext();
    this.currentContest++;
    const contestCount = this.election.contests.length;
    this.currentContest = this.currentContest >= contestCount ? contestCount : this.currentContest;
  }

  /**
   * Navigates to the previous contest
   */
  goToPreviousContest() {
    this.contestSlides.slidePrev();
    this.currentContest--;
    this.currentContest = this.currentContest <= 0 ? 1 : this.currentContest;
  }

  // MODAL LAUNCHERS

  /**
   * Opens the settings modal, which allows the user to change between election files
   */
  async openSettingsModal(): Promise<void> {
    const componentProps = {
      currentElectionFile: this.currentElectionFile,
    };
    const modal = await this.modalController.create({ component: SettingsPage, componentProps });
    await modal.present();
    modal.onDidDismiss().then((response) => {
      const newElectionFile = response.data;
      if (this.currentElectionFile !== newElectionFile) {
        this.currentElectionFile = newElectionFile;
        this.fetchAndLoadElection(newElectionFile);
      }
    });
  }

  // MODAL LAUNCHERS THAT STILL NEED WORK

  async openVoteReviewModal(): Promise<void> {
    const componentProps = {
      scrollToContest: 0,
      election: this.election,
    };
    const modal = await this.modalController.create({ component: VoteReviewPage, componentProps });
    await modal.present();
  }

  // thy do we have two vote review modals?
  async voteReviewSpecificContest(contestNumber: number): Promise<void> {
    const componentProps = {
      scrollToContest: contestNumber,
      election: this.election,
    };
    const modal = await this.modalController.create({ component: VoteReviewPage, componentProps });
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
      const modal = await this.modalController.create({ component: WriteInPage, componentProps });
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

  // PRIVATE METHODS

  /**
   * Handles fetching and loading the election file,
   * either on initial load or when changing election files using the settings modal
   *
   * @param electionFile
   */
  private fetchAndLoadElection(electionFile: string) {
    this.electionIsLoaded = false;
    this.electionFileFetcherService
      .fetchElection(electionFile)
      .then((electionJsonFileContents) => this.electionModelConstructorService.constructElectionModel(electionJsonFileContents))
      .then((election) => {
        this.election = election;
        this.electionIsLoaded = true;
      });
  }
}
