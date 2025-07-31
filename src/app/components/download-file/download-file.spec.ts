import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadFile } from './download-file';

describe('DownloadFile', () => {
  let component: DownloadFile;
  let fixture: ComponentFixture<DownloadFile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadFile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadFile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
