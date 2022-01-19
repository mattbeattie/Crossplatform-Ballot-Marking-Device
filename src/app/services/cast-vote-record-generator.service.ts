import { Injectable } from '@angular/core';

import {
  BallotMeasureBallotSelection,
  Candidate,
  CandidateBallotSelection,
  Contest,
  ContestType,
  Election,
} from './election-model-constructor.service';

export interface CastVoteRecord {
  election: string;
  contests: CvrContest[];
}

interface CvrContest {
  contestName: string;
  contestId: string;
  contestants: CvrContestant[];
}

interface CvrContestant {
  name: string;
  candidateID: string;
  selected: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CastVoteRecordGeneratorService {
  constructor() {}

  /**
   * Creates the CVR based on the status of the election model
   *
   * todo: this model is based directly on Bret's initial implementation
   * we'll want to check and ensure that this model is correct, and make any necessary adjustments
   *
   * @param election
   * @returns
   */
  createCVR(election: Election): CastVoteRecord {
    return {
      election: election.name,
      contests: election.contests.map((contest: Contest) => {
        let candidateContestants = [];
        let ballotMeasureContestants = [];

        if (contest.type === ContestType.candidateContest) {
          candidateContestants = this.getCandidateContestants(contest);
        } else if (contest.type === ContestType.ballotMeasureContest) {
          ballotMeasureContestants = this.getBallotMeasureContestants(contest);
        }

        return {
          contestName: contest.name,
          contestId: contest.id,
          contestants: [...candidateContestants, ...ballotMeasureContestants],
        };
      }),
    };
  }

  /**
   * Generates the "candidate type" contestant array
   *
   * @param contest
   * @returns
   */
  private getCandidateContestants(contest: Contest): CvrContestant[] {
    // todo: this logic doesn't really make sense... maybe it's because the model doesn't make sense?
    // we should revisit to see what the requirements are and update accordingly
    return contest.ballotSelections.map((candidateBallotSelection: CandidateBallotSelection) => {
      const candidateNames: string[] = candidateBallotSelection.candidates.map((candidate: Candidate) => candidate.name);
      const candidateIds: string[] = candidateBallotSelection.candidates.map((candidate: Candidate) => candidate.id);
      return {
        name: candidateNames.join(' and '),
        candidateID: candidateIds.join(' and '),
        selected: candidateBallotSelection.candidates.some((candidate: Candidate) => candidate.isSelected),
      };
    });
  }

  /**
   * Generates the "ballot measure type" contestant array
   *
   * @param contest
   * @returns
   */
  private getBallotMeasureContestants(contest: Contest): CvrContestant[] {
    // todo: implement. also this logic doesn't really make sense because ballot measures don't have names or candidate IDs?
    // perhaps Bret just accounted for candidate contest types in his initial CVR generation logic
    return contest.ballotSelections.map((ballotMeasureBallotSelection: BallotMeasureBallotSelection) => ({
      name: 'todo',
      candidateID: ballotMeasureBallotSelection.id,
      selected: ballotMeasureBallotSelection.isSelected,
    }));
  }
}
