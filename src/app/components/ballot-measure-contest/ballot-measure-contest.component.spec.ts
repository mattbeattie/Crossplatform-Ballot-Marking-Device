import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BallotMeasureContestComponent } from './ballot-measure-contest.component';

describe('BallotMeasureContestComponent', () => {
  let component: BallotMeasureContestComponent;
  let fixture: ComponentFixture<BallotMeasureContestComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BallotMeasureContestComponent],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(BallotMeasureContestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
