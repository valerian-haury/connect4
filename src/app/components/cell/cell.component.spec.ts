import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellComponent } from './cell.component';
import {NotImplementedError} from '../../exceptions/not-implemented-error';

describe('CellComponent', () => {
  let component: CellComponent;
  let fixture: ComponentFixture<CellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /********* CUSTOM TESTS ******************/

  it('Cell click test', () => {

    component.position = {x: 10, y: 19};
    spyOn(component.cellClickHandle, 'emit');

    const nativeElement = fixture.nativeElement;
    const container = nativeElement.querySelector('.cell-container');
    container.dispatchEvent(new Event('click'));

    fixture.detectChanges();
    expect(component.cellClickHandle.emit).toHaveBeenCalledWith(19);
    expect(component.clicked).toBeTrue();
  });

});
