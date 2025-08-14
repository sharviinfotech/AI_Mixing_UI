import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaleInventory } from './bale-inventory';

describe('BaleInventory', () => {
  let component: BaleInventory;
  let fixture: ComponentFixture<BaleInventory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaleInventory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaleInventory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
