import { OnInit, Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { IonSlides } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { Parser } from 'xml2js';

import { ModalPopupPage } from '../modal-popup/modal-popup.page';
import { VoteReviewPage } from '../vote-review/vote-review.page';
import { SettingsPage } from '../settings/settings.page';
import { WriteinModalPage } from '../writein-modal/writein-modal.page';
import { ElectionModelService } from '../services/election-model.service';
import { ElectionReport } from '../services/election-model.model';

const DEFAULT_ELECTION_FILE = `/assets/data/64K_1Contest.xml`;

function camelCase(name: string) {
  return `${name[0].toLowerCase()}${name.slice(1)}`;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('mySlider') slides: IonSlides;

  sliderConfig = {
    effect: 'cube',
    autoHeight: true,
  };

  // todo: better type once you have it, also - private? not sure
  public electionReport: ElectionReport;
  public electionIsLoaded: boolean;

  // legacy properties below
  public currentContest: number = 1;
  public title: string;
  public titleTwo: string;
  public description: string;
  public name: string;
  public language: string;

  constructor(
    private readonly modalController: ModalController,
    private readonly electionModelService: ElectionModelService,
    private readonly httpClient: HttpClient,
    private translate: TranslateService
  ) {
    SplashScreen.show({
      showDuration: 2000,
      autoHide: true,
    });
  }

  ngOnInit() {
    this.loadElection(DEFAULT_ELECTION_FILE);
    this.maybeInitTranslate(navigator.language);
  }

  /**
   * Loads the specified (or default) election file, builds the election model, and sets it on the scope
   *
   * @param electionFile
   */
  loadElection(electionFile: string) {
    this.httpClient
      .get(electionFile, { responseType: 'text' })
      .toPromise()
      .then((xmlElection) => {
        const parser = new Parser({
          attrkey: 'attributes',
          charkey: 'characters',
          explicitArray: false,
          normalize: true,
          trim: true,
          tagNameProcessors: [camelCase],
        });
        parser.parseString(xmlElection, (err, electionResponse) => {
          if (err) {
            throw new Error(`Unable to parse election XML file: ${err}`);
          }
          this.electionReport = this.electionModelService.validateElectionModel(electionResponse);
          console.log('🚀 ~ file: home.page.ts ~ line 86 ~ HomePage ~ parser.parseString ~ this.electionReport', this.electionReport);
          this.electionIsLoaded = true;
        });
      })
      // todo: figure out what to do if an error happens
      .catch((err) => console.log('err', err));
  }

  slideNext() {
    this.slides.slideNext();
    this.currentContest++;
    const contestCount = this.electionReport.election.contestCollection.contest.length;
    this.currentContest = this.currentContest >= contestCount ? contestCount : this.currentContest;
  }

  slidePrevious() {
    this.slides.slidePrev();
    this.currentContest--;
    this.currentContest = this.currentContest <= 0 ? 1 : this.currentContest;
  }

  // todo: if passing a language other than english, it sets the default language to english,
  // but uses the passed in language... does this make sense?
  maybeInitTranslate(language) {
    if (window.Intl && typeof window.Intl === 'object') {
      this.translate.setDefaultLang('en');
      this.language = language || 'en';
      this.translate.use(this.language);
    }
  }

  getTranslator() {
    return this.translate;
  }

  // MODEL LAUNCHERS

  async voteReview(): Promise<void> {
    const componentProps = {
      scrollToContest: 0,
      home: this,
      election: this.electionReport,
      title: 'Vote Review',
      body: 'election review goes here',
    };
    const modal = await this.modalController.create({ component: VoteReviewPage, componentProps });
    await modal.present();
  }

  async voteReviewSpecificContest(contestNumber: number): Promise<void> {
    const componentProps = {
      scrollToContest: contestNumber,
      home: this,
      election: this.electionReport.election,
      title: 'Vote Review',
      body: 'election review goes here',
    };
    const modal = await this.modalController.create({ component: VoteReviewPage, componentProps });
    await modal.present();
  }

  async openSettingsModal(): Promise<void> {
    const componentProps = {};
    const modal = await this.modalController.create({ component: SettingsPage, componentProps });
    await modal.present();
  }

  async maybeOpenWriteInModal(candidate: any): Promise<void> {
    // todo: figure out how to do this now
    if (candidate.isWriteIn()) {
      const componentProps = {
        title: 'Write-In Candidate',
        body: 'write-in election review goes here',
        writeinName: candidate.personName,
      };
      const modal = await this.modalController.create({ component: WriteinModalPage, componentProps });
      await modal.present();
      modal.onDidDismiss().then((data) => {
        // todo: what is data? what is.... data.data? can we use better variable names here?
        if (data.data.trim().length > 0) {
          candidate.personName = data.data;
        } else {
          candidate.personName = candidate.writeInConst;
        }
      });
    }
  }

  async openIonModal(data: any): Promise<void> {
    const componentProps = {
      title: data.title,
      body: data.body,
    };
    const modal = await this.modalController.create({ component: ModalPopupPage, componentProps });
    await modal.present();
  }
}
