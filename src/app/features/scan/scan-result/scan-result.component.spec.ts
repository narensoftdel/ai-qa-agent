import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ScanResultComponent } from './scan-result.component';

describe('ScanResultComponent', () => {
  let component: ScanResultComponent;
  let fixture: ComponentFixture<ScanResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScanResultComponent],
      providers: [provideAnimations()]
    }).compileComponents();

    fixture = TestBed.createComponent(ScanResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the report title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Finance Portal Security Report');
  });
});
