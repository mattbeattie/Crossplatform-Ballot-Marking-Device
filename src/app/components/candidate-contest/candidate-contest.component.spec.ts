import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { CandidateContestComponent } from './candidate-contest.component';

describe('CandidateContestComponent', () => {
  let component: CandidateContestComponent;
  let fixture: ComponentFixture<CandidateContestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CandidateContestComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(CandidateContestComponent);
      component = fixture.componentInstance;
      component.contest = { ballotSelections: [] } as any;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
