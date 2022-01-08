import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectedTooManyModalPage } from './selected-too-many-modal.page';

describe('SelectedTooManyModalPage', () => {
  let component: SelectedTooManyModalPage;
  let fixture: ComponentFixture<SelectedTooManyModalPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SelectedTooManyModalPage],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(SelectedTooManyModalPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
