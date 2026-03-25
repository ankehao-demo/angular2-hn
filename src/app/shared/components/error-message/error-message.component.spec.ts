import { TestBed, async } from '@angular/core/testing';

import { ErrorMessageComponent } from './error-message.component';

describe('ErrorMessageComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorMessageComponent],
    }).compileComponents();
  }));

  it('should create', () => {
    const fixture = TestBed.createComponent(ErrorMessageComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should store the message input', () => {
    const fixture = TestBed.createComponent(ErrorMessageComponent);
    const component = fixture.componentInstance;
    component.message = 'Test error';
    expect(component.message).toBe('Test error');
  });
});
