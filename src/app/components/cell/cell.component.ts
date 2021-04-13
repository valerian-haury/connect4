import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss'],
})
export class CellComponent implements OnInit {

  @Input() infos?: string;
  @Input() position: {x: number, y: number};
  @Input() owned?: number;
  @Output() cellClickHandle = new EventEmitter<number>();
  clicked = false;

  constructor() {
    this.position = {x: -1, y: -1};
  }

  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef
  calculateClasses() {
    return {
      empty: this.owned == 0,
      red: this.owned == 1,
      yellow: this.owned == 2,
    };
  }

  cellClicked(): void {
    this.cellClickHandle.emit(this.position.y);
    this.clicked = true;

  }
}
