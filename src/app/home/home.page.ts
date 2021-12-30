import { OnInit, Component, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { IonSlides } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { TranslateService } from '@ngx-translate/core';

import { ModalPopupPage } from '../modal-popup/modal-popup.page';
import { VoteReviewPage } from '../vote-review/vote-review.page';
import { SettingsPage } from '../settings/settings.page';
import { Candidate } from '../../classes/Candidate';
import { Election } from '../../classes/Election';
import { WriteinPopupPage } from '../writein-popup/writein-popup.page';

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

  public xmlFile = '/assets/data/results-06037-2017-03-07.xml';
  public electionContestNames: string[];
  public currentContest: number;
  public title: string;
  public titleTwo: string;
  public description: string;
  public name: string;
  public language: string;
  private election: Election;
  private edFiles: string[];

  constructor(public modalController: ModalController, private readonly http: HttpClient, private translate: TranslateService) {
    SplashScreen.show({
      showDuration: 2000,
      autoHide: true,
    });
  }

  ngOnInit() {
    this.initializeApp();
    this.currentContest = 1;
  }

  initializeApp() {
    if (window.Intl && typeof window.Intl === 'object') {
      this.initTranslate(navigator.language);
    }
    this.getEDFiles();
    this.election = new Election(this.http, this.xmlFile, this);
  }

  async openIonModal(data: any) {
    const modal = await this.modalController.create({
      component: ModalPopupPage,
      componentProps: {
        title: data.title,
        body: data.body,
      },
    });
    return await modal.present();
  }

  async voteReview(): Promise<void> {
    const voteReviewPopupContent = {
      scrollToContest: 0,
      home: this,
      election: this.election,
      title: 'Vote Review',
      body: 'election review goes here',
    };

    const voteReviewModal = await this.modalController.create({
      component: VoteReviewPage,
      componentProps: voteReviewPopupContent,
    });
    await voteReviewModal.present();
    voteReviewModal.onDidDismiss();
  }

  public async voteReviewSpecificContest(contestNum: number): Promise<void> {
    const voteReviewPopupContent = {
      scrollToContest: contestNum,
      home: this,
      election: this.election,
      title: 'Vote Review',
      body: 'election review goes here',
    };

    const voteReviewModal = await this.modalController.create({
      component: VoteReviewPage,
      componentProps: voteReviewPopupContent,
    });
    await voteReviewModal.present();

    voteReviewModal.onDidDismiss();
  }

  slideNext() {
    this.slides.slideNext();
    this.currentContest++;
    this.currentContest = this.currentContest >= this.election.contests.length ? this.election.contests.length : this.currentContest;
  }

  slidePrevious() {
    this.slides.slidePrev();
    this.currentContest--;
    this.currentContest = this.currentContest <= 0 ? 1 : this.currentContest;
  }

  // todo: can this method name be updated to use an action verb? i'm not sure what "settings" means here
  async settings(): Promise<void> {
    const settingsPopupContent = { edFiles: this.edFiles, home: this };
    const settingsModal = await this.modalController.create({
      component: SettingsPage,
      componentProps: settingsPopupContent,
    });
    await settingsModal.present();
    settingsModal.onDidDismiss();
  }

  // todo: if passing a language other than english, it sets the default language to english,
  // but uses the passed in language... does this make sense?
  initTranslate(language) {
    this.translate.setDefaultLang('en');
    this.language = language || 'en';
    this.translate.use(this.language);
  }

  getTranslator() {
    return this.translate;
  }

  // todo: this looks more like it's.... setting edFiles? what's actually going on here?
  getEDFiles() {
    try {
      const xmlFiles = '/assets/data/index.txt';

      // todo: this operation is repeated in multiple classes. instead of implementing it several times,
      // a better implementation would be to have a service which handles this operation for you
      this.http
        .get(xmlFiles, {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/json ')
            .append('Access-Control-Allow-Methods', 'GET')
            .append('Access-Control-Allow-Origin', '*')
            .append(
              'Access-Control-Allow-Headers',
              'Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method'
            ),
          responseType: 'text',
        })
        .subscribe((jsonData) => {
          this.edFiles = jsonData.split('\n');
        });
    } catch (e) {
      // todo: under what circumstances would this fail? why are we ignoring any failures that would happen here?
      console.log('Error:', e);
    }
  }

  // todo: this isn't actually setting an EDF is it? it's setting the election?
  setEDF(xmlFile: string) {
    this.xmlFile = xmlFile;
    this.election = new Election(this.http, this.xmlFile, this);
  }

  itemClicked(event: Event, candidate: Candidate) {
    if (candidate.isWriteIn()) {
      this.writeInPopup(candidate);
    }
  }

  async writeInPopup(candidate: Candidate): Promise<void> {
    const writeinPopupContent = {
      title: 'Write-In Candidate',
      body: 'write-in election review goes here',
      writeinName: candidate.personName,
    };

    const writeinPopupModal = await this.modalController.create({
      component: WriteinPopupPage,
      componentProps: writeinPopupContent,
    });

    await writeinPopupModal.present();

    writeinPopupModal.onDidDismiss().then((data) => {
      // todo: what is data? what is.... data.data? can we use better variable names here?
      if (data.data.trim().length > 0) {
        candidate.personName = data.data;
      } else {
        candidate.personName = candidate.writeInConst;
      }
    });
  }
}
