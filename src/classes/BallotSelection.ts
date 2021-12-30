import * as jsonQuery from 'json-query';

import { Candidate } from './Candidate';
import { Contest } from './Contest';

export class BallotSelection {
  readonly candidateQuery = '.CandidateIds[*]';
  readonly sequenceOrderQuery = '.SequenceOrder';
  // todo: what is jsonObj? can we use a beter name?
  public jsonObj = '';
  public sequenceOrder: number;
  public selected: boolean;
  public candidates: Candidate[] = new Array();
  private parent: Contest;
  // todo: given that this same private variable is defined in multiple places, it should be hoisted to a
  // shared scope and used everywhere it's needed. maybe an enum would be better here?
  private writeIn = 'writein';

  // todo: what is aString? can we use a beter name?
  constructor(aString: string, parent: Contest) {
    this.parent = parent;
    // todo: what is jsonObj? why is it the same as aString? what is aString? can we use a beter name for all these things?
    this.jsonObj = aString;
    this.sequenceOrder = jsonQuery(this.sequenceOrderQuery, { data: this.jsonObj }).value;
    this.setCandidates(aString);
    this.selected = false;
  }

  /**
   * @returns candidate(s) that are running in a contest - i.e. Hillary Clinton and Tim Kaine
   */
  getCandidatesString(): string {
    // todo: given that partyString is explicitly given the type string, the last half of this name is redundant.
    // should it instead be named partyAbbreviation, because that's what value it gets?
    let partyString: string;
    const myCandArray: string[] = new Array();
    this.candidates.forEach((element) => {
      myCandArray.push(element.personName);
      // todo: the implementation here looks like it just assigns... the last element's party abbreviation to the partyString
      // why are the others ignored?
      partyString = element.partyAbbreviation;
      if (partyString === undefined) {
        partyString = 'Unknown Party';
      }
    });
    return `${myCandArray.join(' and ')} ${partyString}`;
  }

  // todo: the original implementation used the last element's candidateId
  // that doesn't seem right to me, so we should confirm it's intentional and desired
  getCandidateId(): string {
    return this.candidates[this.candidates.length - 1].candidateId;
  }

  // todo: instead of doing a double for loop here which modifies a scoped variable,
  // it would be better to use map to return the list of candidates (this is from the ballot xml file, right?)
  // which can then be set on the scoped variable in the calling method
  setCandidates(aString: string) {
    // todo: what is aString? can we use a beter name?
    if (aString !== this.writeIn) {
      const values = jsonQuery(this.candidateQuery, { data: this.jsonObj }).value;
      // what is "values"? what is "element"? can we use better names here?
      values.forEach((element) => {
        // what is "myCandidateValue"? can we use a better name here?
        const myCandidateValue: string[] = element.split(' ');
        myCandidateValue.forEach((candidateElement) => {
          const candidate = new Candidate(candidateElement, this);
          this.candidates.push(candidate);
        });
      });
    } else {
      this.addWriteInCandidate();
    }
  }

  addWriteInCandidate() {
    const candidate = new Candidate(this.writeIn, this);
    this.candidates.push(candidate);
  }

  getParent(): Contest {
    return this.parent;
  }
}
