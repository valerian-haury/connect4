import {Component, OnInit, ViewChild} from '@angular/core';
import {fromEvent, Observable, Subscription} from 'rxjs';
import {ThemePalette} from '@angular/material/core';
import {Position} from '../../models/position';
import {BoardComponent} from '../board/board.component';

const MAX_TURN = 42;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  @ViewChild(BoardComponent) board?: BoardComponent;

  ROW = 6;
  COLUMN = 7;
  currentPlayer = 1;
  finished = false;
  winner = 0;
  turn = 0;
  normalizedTurn = 0;

  /* THEME */
  primary: ThemePalette = 'primary';
  accent: ThemePalette = 'accent';
  warn: ThemePalette = 'warn';

  constructor() { }

  ngOnInit(): void {
    this.newGame();
  }

  newGame(): void {
    this.currentPlayer = 1;
    this.finished = false;
    this.winner = 0;
    this.turn = 1;
    this.normalizedTurn = 0;
    this.board?.newGame();
  }

  nextTurn(): void {
    if (this.turn >= MAX_TURN ) {
      this.win(3); // DRAW
    } else {
      this.turn++;
      this.normalizedTurn = this.turn / MAX_TURN * 100;
      this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    }
  }

  win(player: number): void {
    this.finished = true;
    this.winner = player;
  }
}
