import { TestBed, async } from '@angular/core/testing';

import { LoaderComponent } from './loader.component';

describe('LoaderComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoaderComponent],
    }).compileComponents();
  }));

  it('should create', () => {
    const fixture = TestBed.createComponent(LoaderComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
