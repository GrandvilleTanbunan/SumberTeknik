import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailSeluruhPesananPage } from './detail-seluruh-pesanan.page';

describe('DetailSeluruhPesananPage', () => {
  let component: DetailSeluruhPesananPage;
  let fixture: ComponentFixture<DetailSeluruhPesananPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailSeluruhPesananPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailSeluruhPesananPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
