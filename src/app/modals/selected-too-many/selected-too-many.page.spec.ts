import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { SelectedTooManyPage } from './selected-too-many.page';

describe('SelectedTooManyPage', () => {
  let component: SelectedTooManyPage;
  let fixture: ComponentFixture<SelectedTooManyPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SelectedTooManyPage],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(SelectedTooManyPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
