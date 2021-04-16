import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BoardComponent} from './components/board/board.component';
import {GameComponent} from './components/game/game.component';

const routes: Routes = [
  { path: 'play', component: GameComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
