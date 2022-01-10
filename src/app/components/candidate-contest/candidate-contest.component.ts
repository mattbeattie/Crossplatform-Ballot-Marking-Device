import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { SelectedTooManyModalPage } from '../../modals/selected-too-many-modal/selected-too-many-modal.page';
import { Contest, CandidateBallotSelection, Candidate } from '../../services/election-model-constructor.service';

@Component({
  selector: 'app-candidate-contest',
  templateUrl: './candidate-contest.component.html',
  styleUrls: ['./candidate-contest.component.scss'],
})
export class CandidateContestComponent implements OnInit {
  @Input() contest: Contest;

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
}
