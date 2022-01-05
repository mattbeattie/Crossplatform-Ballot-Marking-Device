import { Injectable } from '@angular/core';

export enum ContestType {
  candidateContest = 'CandidateContest',
  ballotMeasureContest = 'BallotMeasureContest',
}

export interface Election {
  contests: Contest[];
}

export interface Contest {
  id: string;
  name: string;
  type: ContestType;
  allowedVotes?: number;
  ballotSelections: (CandidateBallotSelection | BallotMeasureBallotSelection)[];
}

export interface CandidateBallotSelection {
  candidates: Candidate[];
}

export interface Candidate {
  id: string;
  name: string;
  partyAbbreviation: string;
}

export interface BallotMeasureBallotSelection {
  ballotMeasures: BallotMeasure[];
}

export interface BallotMeasure {
  id: string;
  sequenceOrder: number;
}

@Injectable({
  providedIn: 'root',
})
export class ElectionModelConstructorService {
  constructor() {}

  /**
   * Given the election JSON file contents, constructs an Election model
   *
   * Note that because there's no way of knowing if properties will have one or more values, the parser treats all
   * all values as arrays - this requires some unique logic to handle and defend against potential edge cases
   *
   * @param electionJsonFileContents
   * @returns
   */
  constructElectionModel(electionJsonFileContents: any): Election {
    const electionReport = electionJsonFileContents.electionReport;
    if (electionReport.election.length > 1) {
      throw new Error(`Found ${electionJsonFileContents.election.length} elections, expected no more than 1`);
    }

    if (electionReport.election[0].contestCollection.length > 1) {
      throw new Error(`Found ${electionReport.election[0].contestCollection.length} contest collections, expected no more than 1`);
    }

    if (!electionReport.election[0].contestCollection[0].contest.length) {
      throw new Error(`Found ${electionReport.election[0].contestCollection[0].contest.length} contests, expected at least 1`);
    }

    if (electionReport.election[0].candidateCollection.length > 1) {
      throw new Error(`Found ${electionReport.election[0].candidateCollection.length} candidate collections, expected no more than 1`);
    }

    if (!electionReport.election[0].candidateCollection[0].candidate.length) {
      throw new Error(`Found ${electionReport.election[0].candidateCollection[0].length} candidates, expected at least 1`);
    }

    if (electionReport.partyCollection.length > 1) {
      throw new Error(`Found ${electionReport.partyCollection.length} party collections, expected no more than 1`);
    }

    if (!electionReport.partyCollection[0].party.length) {
      throw new Error(`Found ${electionReport.partyCollection[0].party.length} parties, expected at least 1`);
    }

    const election: Election = {
      contests: this.getContests(electionReport),
    };
    return election;
  }

  /**
   * Creates the contest array based on the JSON election file
   *
   * Note that because a contest can be either a candidate contest or a ballot measure contest,
   * we'll need to have some corresponding switching logic
   *
   * @param electionReport
   * @returns
   */
  private getContests(electionReport: any): Contest[] {
    return electionReport.election[0].contestCollection[0].contest.map((contestResponse: any) => {
      const contest: Contest = {
        id: contestResponse.attributes.objectId,
        name: contestResponse.name[0],
        type: contestResponse.attributes['xsi:type'],
        ballotSelections: [],
      };

      if (contest.type === ContestType.candidateContest) {
        contest.allowedVotes = contestResponse.votesAllowed[0];
        contest.ballotSelections = this.getCandidateBallotSelections(electionReport, contestResponse);
      } else if (contest.type === ContestType.ballotMeasureContest) {
        contest.ballotSelections = this.getBallotMeasureBallotSelections(electionReport, contestResponse);
      } else {
        throw new Error(`Found unexpected contest type: ${contest.type}`);
      }

      return contest;
    });
  }

  /**
   * Gets the ballot selections for candidate type contests
   *
   * @param electionReport
   * @param contestResponse
   * @returns
   */
  private getCandidateBallotSelections(electionReport: any, contestResponse: any): CandidateBallotSelection[] {
    return contestResponse.ballotSelection.map((ballotSelectionResponse: any) => {
      const candidates: Candidate[] = ballotSelectionResponse.candidateIds.map((candidateId: string) => {
        const candidateInfo = this.getCandidateInfoByCandidateId(electionReport, candidateId);
        const name = candidateInfo.ballotName[0].text[0].characters;
        const partyAbbreviation = this.getPartyAbbreviationByPartyId(electionReport, candidateInfo.partyId[0]);
        return {
          id: candidateId,
          name,
          partyAbbreviation,
        };
      });
      return { candidates };
    });
  }

  /**
   * Gets the ballot selections for ballot measure type contests
   *
   * @param electionReport
   * @param contestResponse
   * @returns
   */
  private getBallotMeasureBallotSelections(electionReport: any, contestResponse: any): BallotMeasureBallotSelection[] {
    return contestResponse.ballotSelection.map((ballotSelectionResponse: any) => {
      // eslint-disable-next-line unused-imports/no-unused-vars
      const ballotMeasureId = ballotSelectionResponse.attributes.objectId;
      // todo: determine how to get some text-based information given the ballot measure ID, remove the eslint-disable once that's working
      // initial inspection of the bmsXXXXX IDs in the election definition file didn't match any text describing the measureß
    });
  }

  /**
   * Gets the raw candidate info based on the candidate ID
   *
   * Note that the ballot selections array contains candidates with candidate IDs, but not the candidate information itself;
   * therefore, we need to look within the root-level candidate collections array to get that info
   *
   * @param electionReport
   * @param candidateId
   * @returns
   */
  private getCandidateInfoByCandidateId(electionReport: any, candidateId: string): any {
    return electionReport.election[0].candidateCollection[0].candidate.find(
      (candidateResponse: any) => candidateResponse.attributes.objectId === candidateId
    );
  }

  /**
   * Gets the party abbreviation based on the party ID
   *
   * Note: the candidate collections array contains the candidate's party ID, but not the party abbreviation itself;
   * therefore, we need to look within the root-level party collections array to get that info
   *
   * @param electionReport
   * @param partyId
   * @returns
   */
  private getPartyAbbreviationByPartyId(electionReport: any, partyId: string): string {
    return electionReport.partyCollection[0].party.find((partyResponse: any) => partyResponse.attributes.objectId === partyId)
      .abbreviation[0];
  }
}
