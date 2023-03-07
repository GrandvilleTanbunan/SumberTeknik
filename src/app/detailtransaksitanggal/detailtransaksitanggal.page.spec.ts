import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailtransaksitanggalPage } from './detailtransaksitanggal.page';

describe('DetailtransaksitanggalPage', () => {
  let component: DetailtransaksitanggalPage;
  let fixture: ComponentFixture<DetailtransaksitanggalPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailtransaksitanggalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailtransaksitanggalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
