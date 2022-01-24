import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { WriteInPage } from 'src/app/modals/write-in/write-in.page';

import { SelectedTooManyPage } from '../../modals/selected-too-many/selected-too-many.page';
import {
  Contest,
  CandidateBallotSelection,
  Candidate,
  WriteInCandidate,
  CandidateType,
} from '../../services/election-model-constructor.service';

@Component({
  selector: 'app-candidate-contest',
  templateUrl: './candidate-contest.component.html',
  styleUrls: ['./candidate-contest.component.scss'],
})
export class CandidateContestComponent implements OnInit {
  @Input() contest: Contest;
  @Input() launchInVoteReviewMode: boolean;

  constructor(private readonly modalController: ModalController) {}

  ngOnInit() {}

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
      const modal = await this.modalController.create({ component: SelectedTooManyPage });
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

  /**
   * Launches the writein modal and persists the data back to the model when complete
   *
   * todo: this implementation assumes that there will only ever be one write-in per contest.
   * the following issue confirms if this is true: https://github.com/TrustTheVote-Project/NIST-1500-100-103-examples/issues/26
   * if this is NOT true, then we'll need to use some identifier rather than looking up the write-in candidate
   */
  async openWriteInModal(): Promise<void> {
    const componentProps = { writeInName: this.getWriteInName() };
    const modal = await this.modalController.create({ component: WriteInPage, componentProps });
    await modal.present();
    modal.onDidDismiss().then((response) => {
      const newWriteInName = response.data?.writeInName;
      if (newWriteInName === undefined) {
        // if the user clicks outside of the modal, it will send back the value of undefined - we do not update the value here
        // we preserve the "selectedness" to what it was before the modal was launched (i.e., the opposite of whatever it is now)
        this.selectWriteIn(!this.getWriteInIsSelected());
      } else if (newWriteInName.trim() === '') {
        // if the user clears out the field or adds empty spaces, we deselect it and set back to the default (empty string)
        this.setWriteInName('');
        this.selectWriteIn(false);
      } else {
        // else, we can take whatever the input was and set it, and will always ensure it's selected
        this.setWriteInName(newWriteInName);
        this.selectWriteIn(true);
      }
    });
  }

  /**
   * Gets the value of the write-in candidate's name
   *
   * @returns
   */
  private getWriteInName(): string {
    return this.contest.ballotSelections.map((ballotSelection: CandidateBallotSelection) =>
      ballotSelection.candidates.find((candidate: Candidate | WriteInCandidate) => candidate.type === CandidateType.writeIn)
    )[0].name;
  }

  /**
   * Sets the value of the write-in candidate's name
   *
   * @param newWriteInName
   */
  private setWriteInName(newWriteInName: string): void {
    this.contest.ballotSelections.map((ballotSelection: CandidateBallotSelection) =>
      ballotSelection.candidates.find((candidate: Candidate | WriteInCandidate) => candidate.type === CandidateType.writeIn)
    )[0].name = newWriteInName;
  }

  /**
   * Gets the value of the write-in candidate's isSelected value
   *
   * @returns
   */
  private getWriteInIsSelected(): boolean {
    return this.contest.ballotSelections.map((ballotSelection: CandidateBallotSelection) =>
      ballotSelection.candidates.find((candidate: Candidate | WriteInCandidate) => candidate.type === CandidateType.writeIn)
    )[0].isSelected;
  }

  /**
   * Sets the value of the write-in candidate's isSelected value
   *
   * @param selected
   */
  private selectWriteIn(selected: boolean): void {
    this.contest.ballotSelections.map((ballotSelection: CandidateBallotSelection) =>
      ballotSelection.candidates.find((candidate: Candidate | WriteInCandidate) => candidate.type === CandidateType.writeIn)
    )[0].isSelected = selected;
  }
}
