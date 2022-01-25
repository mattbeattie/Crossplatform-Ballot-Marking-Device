import { OnInit, Component, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonSlides } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { TranslateService } from '@ngx-translate/core';

import { ElectionFileFetcherService } from '../services/election-file-fetcher.service';
import { ElectionModelConstructorService, Election } from '../services/election-model-constructor.service';
import { CastVoteRecord, CastVoteRecordGeneratorService } from '../services/cast-vote-record-generator.service';
import { VoteReviewPage } from '../modals/vote-review/vote-review.page';
import { SettingsPage } from '../modals/settings/settings.page';
import { HelpPage } from '../modals/help/help.page';

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
  electionFailedToLoad: boolean;
  currentElectionFile = `/assets/data/single_candidate_contest.xml`;
  currentContest = 1;

  constructor(
    private readonly modalController: ModalController,
    private readonly translate: TranslateService,
    private readonly electionFileFetcherService: ElectionFileFetcherService,
    private readonly electionModelConstructorService: ElectionModelConstructorService,
    private readonly castVoteRecordGeneratorService: CastVoteRecordGeneratorService
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
      const newElectionFile = response.data?.selectedElectionFile;
      if (newElectionFile && this.currentElectionFile !== newElectionFile) {
        this.currentElectionFile = newElectionFile;
        this.fetchAndLoadElection(newElectionFile);
      }
    });
  }

  /**
   * Opens the vote review modal, which allows the user to review their votes and optionally submit
   */
  async openVoteReviewModal(): Promise<void> {
    const componentProps = {
      election: this.election,
    };
    const modal = await this.modalController.create({ component: VoteReviewPage, componentProps });
    await modal.present();
    modal.onDidDismiss().then((response) => {
      const shouldCastBallot = response.data?.shouldCastBallot;
      if (shouldCastBallot) {
        // todo: Bret's initial implementation simply console.logged the CVR value out
        // we should revisit this to see what the requirements are and implement them accordingly
        const castVoteRecord: CastVoteRecord = this.castVoteRecordGeneratorService.createCVR(this.election);
        console.log(castVoteRecord);
      }
    });
  }

  /**
   * Opens the help modal
   */
  async openHelpModal(): Promise<void> {
    const modal = await this.modalController.create({ component: HelpPage });
    await modal.present();
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
    this.electionFailedToLoad = false;
    this.electionFileFetcherService
      .fetchElection(electionFile)
      .then((electionJsonFileContents) => this.electionModelConstructorService.constructElectionModel(electionJsonFileContents))
      .then((election) => {
        this.election = election;
        this.electionIsLoaded = true;
      })
      .catch((error) => {
        this.electionFailedToLoad = true;
        throw error;
      });
  }
}
