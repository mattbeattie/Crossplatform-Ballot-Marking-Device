import { Injectable } from '@angular/core';
import { Parser } from 'xml2js';
import { HttpClient } from '@angular/common/http';

// todo: what other parties may be provided in the xml?
export enum PartyAbbreviation {
  nonPartisan = 'NP',
  democratic = 'DEM',
  republican = 'REP',
  americanIndependent = 'AI',
  green = 'GRN',
  libertarian = 'LIB',
  peaceAndFreedom = 'PF',
}

export interface Election {
  contests: Contest[];
}

interface Contest {
  name: string;
  allowedVotes: number;
  remainingVotes: number;
  ballotSelections: BallotSelection[];
}

interface BallotSelection {
  candidates: Candidate[];
}

interface Candidate {
  name: string;
  partyAbbreviation: PartyAbbreviation;
}

@Injectable({
  providedIn: 'root',
})
export class ElectionModelService {
  constructor(private readonly httpClient: HttpClient) {}

  async getElection(electionFileName: string): Promise<Election> {
    return this.fetchElectionFile(electionFileName)
      .then((electionXmlFileContents) => this.parseElectionFile(electionXmlFileContents))
      .then((electionJsonFileContents) => this.constructElectionModel(electionJsonFileContents));
  }

  private async fetchElectionFile(electionFileName: string): Promise<string | void> {
    return this.httpClient
      .get(electionFileName, { responseType: 'text' })
      .toPromise()
      .then((xmlElection) => xmlElection)
      .catch((err) => {
        throw new Error(`Unable to fetch election XML file from ${electionFileName}: ${err}`);
      });
  }

  private parseElectionFile(electionXmlFileContents: string | void): Promise<any> {
    const convertXmlPropertNamesToCamelCase = (name: string) => `${name[0].toLowerCase()}${name.slice(1)}`;
    const parser = new Parser({
      attrkey: 'attributes',
      charkey: 'characters',
      normalize: true,
      trim: true,
      tagNameProcessors: [convertXmlPropertNamesToCamelCase],
    });
    return parser.parseString(electionXmlFileContents, (err, electionJsonFileContents) => {
      if (err) {
        throw new Error(`Unable to parse election XML file: ${err}`);
      }
      return electionJsonFileContents;
    });
  }

  private constructElectionModel(electionJsonFileContents: any): Election {
    console.log(
      '🚀 ~ file: election-model.service.ts ~ line 76 ~ ElectionModelService ~ constructElectionModel ~ electionJsonFileContents',
      electionJsonFileContents
    );
    const election: Election = {
      contests: [
        {
          name: 'contest 1',
          allowedVotes: 4,
          remainingVotes: 4,
          ballotSelections: [
            {
              candidates: [
                {
                  name: 'foo',
                  partyAbbreviation: PartyAbbreviation.americanIndependent,
                },
              ],
            },
          ],
        },
      ],
    };
    return election;
  }
}
