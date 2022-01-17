import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { VoteReviewPage } from './vote-review.page';

describe('VoteReviewPage', () => {
  let component: VoteReviewPage;
  let fixture: ComponentFixture<VoteReviewPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [VoteReviewPage],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(VoteReviewPage);
      component = fixture.componentInstance;
      component.election = { contests: [] } as any;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
