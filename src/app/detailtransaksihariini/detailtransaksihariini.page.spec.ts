import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailtransaksihariiniPage } from './detailtransaksihariini.page';

describe('DetailtransaksihariiniPage', () => {
  let component: DetailtransaksihariiniPage;
  let fixture: ComponentFixture<DetailtransaksihariiniPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailtransaksihariiniPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailtransaksihariiniPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
