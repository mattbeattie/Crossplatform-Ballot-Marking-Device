import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Parser } from 'xml2js';

@Injectable({
  providedIn: 'root',
})
export class ElectionFileFetcherService {
  constructor(private readonly httpClient: HttpClient) {}

  /**
   * Public method which handles the fetching and parsing of the XML election file into JSON format
   *
   * @param electionFileName
   * @returns
   */
  async fetchElection(electionFileName: string): Promise<any> {
    return this.fetchElectionFile(electionFileName).then((electionXmlFileContents) => this.parseElectionFile(electionXmlFileContents));
  }

  /**
   * Fetches and return the raw election file XML contents from the specified XML filename
   *
   * @param electionFileName
   * @returns
   */
  private async fetchElectionFile(electionFileName: string): Promise<string | void> {
    return this.httpClient
      .get(electionFileName, { responseType: 'text' })
      .toPromise()
      .then((xmlElection) => xmlElection)
      .catch((err) => {
        throw new Error(`Unable to fetch election XML file from ${electionFileName}: ${err}`);
      });
  }

  /**
   * Parses and returns the XML file contents and returns them in JSON format
   *
   * @param electionXmlFileContents
   * @returns
   */
  private parseElectionFile(electionXmlFileContents: string | void): Promise<any> {
    const convertXmlPropertNamesToCamelCase = (name: string) => `${name[0].toLowerCase()}${name.slice(1)}`;
    const parser = new Parser({
      attrkey: 'attributes',
      charkey: 'characters',
      normalize: true,
      trim: true,
      tagNameProcessors: [convertXmlPropertNamesToCamelCase],
    });
    return new Promise((resolve, reject) => {
      parser.parseString(electionXmlFileContents, (err, electionJsonFileContents) => {
        if (err) {
          reject(`Unable to parse election XML file: ${err}`);
        } else {
          resolve(electionJsonFileContents);
        }
      });
    });
  }
}
