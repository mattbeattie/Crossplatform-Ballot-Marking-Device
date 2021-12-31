import { Injectable } from '@angular/core';

import { BallotSelection, Contest, ElectionReport, ElectionResponse } from './election-model.model';

@Injectable({
  providedIn: 'root',
})
export class ElectionModelService {
  /**
   * Using the ElectionResponse interface here will TREAT this object as such; however,
   * we don't actually know if it ACTUALLY respects that interface
   *
   * To do so, we need to write some custom type guards
   *
   * @param electionResponse
   */
  validateElectionModel(electionResponse: any): ElectionReport {
    // todo: implement

    // always ensure ballotSelections is an array
    electionResponse.electionReport.election.contestCollection.contest.forEach((contest: any) => {
      if ('candidateIds' in contest.ballotSelection) {
        const ballotSelection = contest.ballotSelection;
        contest.ballotSelection = [ballotSelection];
      }
    });

    return electionResponse.electionReport as ElectionReport;
  }
}
