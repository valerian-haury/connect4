import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameComponent } from './game.component';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Next turn test', () => {
    expect(component.currentPlayer).toEqual(1);
    expect(component.turn).toEqual(1);
    component.nextTurn();
    expect(component.currentPlayer).toEqual(2);
    expect(component.turn).toEqual(2);
    component.nextTurn();
    expect(component.currentPlayer).toEqual(1);
    expect(component.turn).toEqual(3);
  });

  it('Draw test', () => {
    while(!component.finished) {
      component.nextTurn();
    }

    expect(component.turn).toEqual(42);
    expect(component.finished).toBeTrue();
    expect(component.winner).toEqual(3);
  });

  it('Win & replay test', () => {
    component.win(1);
    expect(component.finished).toBeTrue();
    expect(component.winner).toEqual(1);

    component.newGame();
    expect(component.finished).toBeFalse();
    expect(component.winner).toEqual(0);
    expect(component.turn).toEqual(1);

    component.win(2);
    expect(component.finished).toBeTrue();
    expect(component.winner).toEqual(2);
  });
});
