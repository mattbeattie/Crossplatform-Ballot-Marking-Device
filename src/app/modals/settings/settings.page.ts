import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  @Input() currentElectionFile: string;

  availableElectionFileNames: string[];
  selectedElectionFileName: string;

  constructor(public readonly modalController: ModalController, private readonly httpClient: HttpClient) {}

  /**
   * On modal load, sets the current election file and fetches the full list of election files to populate the dropdown
   */
  ngOnInit() {
    const currentElectionFileName = this.currentElectionFile.split('/')[this.currentElectionFile.split('/').length - 1];
    this.selectedElectionFileName = currentElectionFileName;
    this.fetchAvailableElectionFiles();
  }

  /**
   * Returns the newly selected election file to the caller, so that it can handle loading it accordingly
   */
  async closeModal() {
    const selectedElectionFile = `/assets/data/${this.selectedElectionFileName}`;
    await this.modalController.dismiss(selectedElectionFile);
  }

  /**
   * Fetches the list of available election files and sets them on the modal scope,
   * so that they can be presented to the user
   */
  private fetchAvailableElectionFiles() {
    const electionFileList = `/assets/data/index.txt`;
    this.httpClient
      .get(electionFileList, { responseType: 'text' })
      .toPromise()
      .then((availableElectionFileNames) => (this.availableElectionFileNames = availableElectionFileNames.split('\n')))
      .catch((err) => {
        throw new Error(`Unable to fetch available election files from ${electionFileList}: ${err}`);
      });
  }
}
