import { Injectable } from '@angular/core';

/**
 * There are four types of contest:
 *
 * 1. BallotMeasureContest (not yet handled)
 * 2. CandidateContest, which has 3 different "vote variations"
 *   a. n-of-m (not yet handled, open question here: https://github.com/TrustTheVote-Project/NIST-1500-100-103-examples/issues/23)
 *   b. majority (handled, but need to implement write-ins)
 *   c. presidential (not yet handled)
 */

export enum ContestType {
  candidateContest = 'CandidateContest',
  ballotMeasureContest = 'BallotMeasureContest',
}

export enum VoteVariation {
  nOfM = 'n-of-m',
  majority = 'majority',
  presidential = 'presidential',
}

export enum CandidateType {
  candidate = 'candidate',
  writeIn = 'writeIn',
}

export interface Election {
  name: string;
  contests: Contest[];
}

export interface Contest {
  id: string;
  name: string;
  type: ContestType;
  voteVariation: VoteVariation;
  allowedVotes?: number;
  ballotSelections: (CandidateBallotSelection | BallotMeasureBallotSelection)[];
}

// todo: can we flatten this later?
export interface CandidateBallotSelection {
  candidates: (Candidate | WriteInCandidate)[];
}

export interface Candidate {
  id: string;
  name: string;
  type: CandidateType;
  partyAbbreviation: string;
  isSelected: boolean;
}

export interface WriteInCandidate {
  name: string;
  type: CandidateType;
  isSelected: boolean;
}

export interface BallotMeasureBallotSelection {
  id: string;
  isSelected: boolean;
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

    const nistVersion = electionReport.attributes.xmlns;
    if (nistVersion !== 'http://itl.nist.gov/ns/voting/1500-100/v2') {
      throw new Error(`Found NIST version ${nistVersion}; this application is only configured to use NIST v2`);
    }

    if (electionReport.election.length > 1) {
      throw new Error(`Found ${electionJsonFileContents.election.length} elections, expected no more than 1`);
    }

    if (!electionReport.election[0].contest.length) {
      throw new Error(`Found ${electionReport.election[0].contest.length} contests, expected at least 1`);
    }

    if (!electionReport.election[0].candidate.length) {
      throw new Error(`Found ${electionReport.election[0].candidate.length} candidates, expected at least 1`);
    }

    if (!electionReport.party.length) {
      throw new Error(`Found ${electionReport.party.length} parties, expected at least 1`);
    }

    if (!electionReport.office.length) {
      throw new Error(`Found ${electionReport.office.length} offices, expected at least 1`);
    }

    const name = electionReport.election[0].name[0].text[0].characters;
    if (!name) {
      throw new Error(`Could not find the election name`);
    }

    // todo: remove this once we can handle all types of contests
    console.log(
      // eslint-disable-next-line max-len
      `Found election "${name}" with ${electionReport.election[0].contest.length} contests, ${electionReport.election[0].candidate.length} candidates, ${electionReport.party.length} parties, and ${electionReport.office.length} offices`
    );

    const election: Election = {
      name,
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
    return electionReport.election[0].contest.map((contestResponse: any) => {
      const contest: Contest = {
        id: contestResponse.attributes.ObjectId,
        name: contestResponse.name[0],
        type: contestResponse.attributes['xsi:type'],
        voteVariation: contestResponse.voteVariation[0],
        ballotSelections: [],
      };

      if (contest.type === ContestType.candidateContest) {
        if (contest.voteVariation === VoteVariation.nOfM) {
          // todo: implement
          throw new Error('No support for n-of-m at this time');
        } else if (contest.voteVariation === VoteVariation.majority) {
          // todo: maybe hoist this up assuming allowed votes is relevant for all vote variations
          contest.allowedVotes = contestResponse.votesAllowed[0];
          contest.ballotSelections = this.getCandidateBallotSelectionsForMajority(electionReport, contestResponse);
        } else if (contest.voteVariation === VoteVariation.presidential) {
          // todo: implement
          throw new Error('No support for presidential at this time');
        } else {
          throw new Error(`Found unexpected vote variation ${contest.voteVariation}`);
        }
      } else if (contest.type === ContestType.ballotMeasureContest) {
        contest.ballotSelections = this.getBallotMeasureBallotSelections(electionReport, contestResponse);
      } else {
        throw new Error(`Found unexpected contest type: ${contest.type}`);
      }

      return contest;
    });
  }

  /**
   * Gets the ballot selections for candidate type contests of vote variation majority
   *
   * Note: when parsing candidateIds, we inject a "write in marker,"
   * which allows us to return a candidate whose type is of "write in";
   * otherwise, we get the candidate info and return the candidate of type "candidate"
   *
   * @param electionReport
   * @param contestResponse
   * @returns
   */
  private getCandidateBallotSelectionsForMajority(electionReport: any, contestResponse: any): CandidateBallotSelection[] {
    const writeInMarker = 'WRITE-IN';
    const candidateIds = contestResponse.contestSelection.map((contestSelection: any) =>
      // todo: will we need to handle multiple candidate IDs here? assume "no" for now
      // https://github.com/TrustTheVote-Project/NIST-1500-100-103-examples/issues/24
      !!contestSelection.candidateIds && contestSelection.candidateIds.length ? contestSelection.candidateIds[0] : writeInMarker
    );

    const candidates: Candidate[] = candidateIds.map((candidateId: string) => {
      if (candidateId === writeInMarker) {
        return {
          name: '',
          type: CandidateType.writeIn,
          isSelected: false,
        };
      }
      const candidateInfo = this.getCandidateInfoByCandidateId(electionReport, candidateId);
      const name = candidateInfo.ballotName[0].text[0].characters;
      const partyAbbreviation = this.getPartyAbbreviationByPartyId(electionReport, candidateInfo.partyId[0]);

      return {
        id: candidateId,
        name,
        type: CandidateType.candidate,
        partyAbbreviation,
        isSelected: false,
      };
    });
    return [{ candidates }];
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
      const ballotMeasureId = ballotSelectionResponse.attributes.objectId;
      // todo: determine how to get some text-based information given the ballot measure ID, remove the eslint-disable once that's working
      // initial inspection of the bmsXXXXX IDs in the election definition file didn't match any text describing the measureß
      // for now, we'll just return some placeholder info so that the model will be structurally complete
      return {
        id: ballotMeasureId,
        isSelected: false,
      };
    });
  }

  /**
   * Gets the raw candidate info based on the candidate ID
   *
   * Note that the ballot selections array contains candidates with candidate IDs, but not the candidate information itself;
   * therefore, we need to look within the root-level candidate array to get that info
   *
   * @param electionReport
   * @param candidateId
   * @returns
   */
  private getCandidateInfoByCandidateId(electionReport: any, candidateId: string): any {
    const matchingCandidate = electionReport.election[0].candidate.find(
      (candidateResponse: any) => candidateResponse.attributes.ObjectId === candidateId
    );
    if (!matchingCandidate) {
      throw new Error(`Unable to find a matching candidate for candidateId "${candidateId}"`);
    }
    return matchingCandidate;
  }

  /**
   * Gets the party abbreviation based on the party ID
   *
   * Note: the candidate collections array contains the candidate's party ID, but not the party abbreviation itself;
   * therefore, we need to look within the root-level party array to get that info
   *
   * @param electionReport
   * @param partyId
   * @returns
   */
  private getPartyAbbreviationByPartyId(electionReport: any, partyId: string): string {
    const matchingParty = electionReport.party.find((partyResponse: any) => partyResponse.attributes.ObjectId === partyId);
    if (!matchingParty) {
      throw new Error(`Unable to find a matching party for partyId "${partyId}"`);
    }
    return matchingParty.abbreviation[0].text[0].characters;
  }
}
