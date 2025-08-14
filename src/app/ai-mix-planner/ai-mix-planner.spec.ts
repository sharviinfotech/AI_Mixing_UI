import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiMixPlanner } from './ai-mix-planner';

describe('AiMixPlanner', () => {
  let component: AiMixPlanner;
  let fixture: ComponentFixture<AiMixPlanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiMixPlanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiMixPlanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
