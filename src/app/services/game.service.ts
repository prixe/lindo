import {Game} from '@helpers/game';
import {Injectable} from "@angular/core";

@Injectable()
export class GameService {
    private _games:Game[] = [];

    get games(){
        return this._games;
    }

    getGame(id: number): Game {
        return this._games.filter((game:Game) => {
            return game.id === id;
        })[0];
    }

    addGame(game: Game): void {
        this._games.push(game);
    }

    removeGame(game: Game): void {
        const index = this._games.indexOf(game);

        if(index !== -1){
            this._games.splice(index, 1);
        }
    }

}
