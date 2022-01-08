import { OnInit, Component, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonSlides } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { TranslateService } from '@ngx-translate/core';

import { SelectedTooManyModalPage } from '../selected-too-many-modal/selected-too-many-modal.page';
import { VoteReviewPage } from '../vote-review/vote-review.page';
import { SettingsPage } from '../settings/settings.page';
import { WriteinModalPage } from '../writein-modal/writein-modal.page';

import { ElectionFileFetcherService } from '../services/election-model-fetcher.service';
import {
  ElectionModelConstructorService,
  Election,
  Contest,
  CandidateBallotSelection,
  Candidate,
} from '../services/election-model-constructor.service';

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

  /**
   * Any time a candidate is selected, we need to check to see if the user selected too many candidates.
   * If so, display the "too many selected" modal and automatically deselect their most recent selection.
   *
   * @param event
   * @param candidateId
   */
  async deselectAndDisplayModalIfTooManySelected(event: any, contest: Contest, candidateId: string) {
    const wasCheckAction: boolean = event.detail.checked;
    const remainingCandidateVotes = this.getRemainingCandidateVotes(contest);
    if (wasCheckAction && remainingCandidateVotes < 0) {
      const modal = await this.modalController.create({ component: SelectedTooManyModalPage });
      await modal.present();
      contest.ballotSelections.forEach((ballotSelection: CandidateBallotSelection) => {
        const matchingCandidate = ballotSelection.candidates.find((candidate: Candidate) => candidate.id === candidateId);
        if (!!matchingCandidate) {
          matchingCandidate.isSelected = false;
        }
      });
    }
  }

  /**
   * Gets the remaining available votes for a candidate type contest
   *
   * @param contest
   * @returns
   */
  getRemainingCandidateVotes(contest: Contest): number {
    const allowedVotes = contest.allowedVotes;
    const totalSelectedCandidates: number = contest.ballotSelections.reduce(
      (selectedCandidatesAccumulator: number, currentBallotSelection: CandidateBallotSelection) => {
        const selectedCandidatesForCurrentBallotSelection: number = currentBallotSelection.candidates.reduce(
          (ballotSelectionAccumulator: number, candidate: Candidate) =>
            candidate.isSelected ? ballotSelectionAccumulator + 1 : ballotSelectionAccumulator,
          0
        );
        return selectedCandidatesAccumulator + selectedCandidatesForCurrentBallotSelection;
      },
      0
    );
    return allowedVotes - totalSelectedCandidates;
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
