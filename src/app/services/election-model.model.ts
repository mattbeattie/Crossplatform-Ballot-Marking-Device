// todo: what other genders may be provided in the xml?
export enum Gender {
  Male = 'Male',
  Female = 'Female',
}

// todo: what other parties may be provided in the xml?
export enum PartyAbbreviation {
  NonPartisan = 'NP',
  Democratic = 'DEM',
  Republican = 'REP',
  AmericanIndependent = 'AI',
  Green = 'GRN',
  Libertarian = 'LIB',
  PeaceAndFreedom = 'PF',
}

export enum BooleanString {
  True = 'true',
  False = 'false',
}

// top level interfaces

export interface ElectionResponse {
  electionReport: ElectionReport;
}

export interface ElectionReport {
  election: Election;
  format: string;
  generatedDate: string;
  gpUnitCollection: GpUnitCollection;
  issuer: string;
  issuerAbbreviation: string;
  officeCollection: OfficeCollection;
  partyCollection: PartyCollection;
  personCollection: PersonCollection;
  sequenceStart: string;
  sequenceEnd: string;
  status: string;
  vendorApplicationId: string;
}

export interface Election {
  candidateCollection: CandidateCollection;
  contestCollection: ContestCollection;
  electionScopeId: string;
  name: Text;
  startDate: string;
  endDate: string;
  type: string;
}

// candidate interfaces

export interface CandidateCollection {
  candidate: Candidate[];
}

export interface Candidate {
  attributes: XmlAttribute;
  ballotName: Text;
  isIncumbent: BooleanString;
  partyId: string;
  personId: string;
}

export interface XmlAttribute {
  objectId: string;
}

// contest interfaces

export interface ContestCollection {
  contest: Contest[];
}

export interface Contest {
  ballotSelection: BallotSelection[]; // todo: should we implement some logic to ensure this is always an array?
  ballotTitle: Text;
  electoralDistrictId: string;
  name: string;
  officeIds: string;
  subUnitsReported: string;
  summaryCounts: SummaryCount;
  totalSubUnits: string;
  votesAllowed: string;
}

export interface BallotSelection {
  candidateIds: string;
  sequenceOrder: string;
  voteCountsCollection: VoteCountsCollection;
}

export interface VoteCountsCollection {
  voteCounts: VoteCounts[];
}

export interface VoteCounts {
  gpUnitId?: string;
  count: string;
  type: string;
}

export interface SummaryCount {
  ballotsCast: string;
  gpUnitId: string;
  type: string;
}

// gpUnit interfaces

export interface GpUnitCollection {
  gpUnit: GpUnit[];
}

export interface GpUnit {
  name: string;
  type: string;
  number?: string;
  composingGpUnitIds?: string; // this is a space-delimited list of IDs
  externalIdentifiers?: ExternalIdentifiers;
  partyRegistration?: PartyRegistration[];
}

export interface ExternalIdentifiers {
  externalIdentifier: ExternalIdentifier;
}

export interface ExternalIdentifier {
  type: string;
  value: string;
}

export interface PartyRegistration {
  count: string;
  partyId: string;
}

// office interfaces

export interface OfficeCollection {
  office: Office[];
}

export interface Office {
  isPartisan: BooleanString;
  name: Text;
}

// party interfaces

export interface PartyCollection {
  party: Party[];
}

export interface Party {
  abbreviation: PartyAbbreviation;
  name: Text;
}

// person interfaces

export interface PersonCollection {
  person: Person[];
}

export interface Person {
  firstName: string;
  fullName: Text;
  gender: Gender;
  lastName: string;
  middleName: string;
  partyId: string;
  profession: Text;
}

// common interfaces

export interface Text {
  text: string;
}
