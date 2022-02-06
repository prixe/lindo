import {Mod} from "../mod";

export class MoveWindows extends Mod {

  startMod(): void {

    this.wGame.addEventListener('storage', (e) => {
      if(e.key === 'WindowMoved') {
        const windowMoved = JSON.parse(localStorage.getItem('WindowMoved'));
        this.moveWindow(windowMoved);
      }
    });

    this.wGame.gui.windowsContainer.getChildren().forEach(
      (window) => {
        this.on(window, 'positioned', () => {
          const windowMoved = { id: window.id, positionInfo: window.positionInfo, position: window.position, accountId: this.wGame.actorManager.userActor.data.accountId };
          localStorage.setItem("WindowMoved", JSON.stringify(windowMoved));
        });
      });
  }

  private moveWindow(window) {
    if(window.accountId != this.wGame.actorManager.userActor.data.accountId) {
      const movedWindow = this.wGame.gui.windowsContainer.getChildren().find(w => w.id == window.id)
      if (movedWindow && movedWindow.isReadyForUserInteraction && window.positionInfo && window.position) {
        movedWindow.position.x = window.position.x;
        movedWindow.position.y = window.position.y;

        movedWindow.rootElement.style.transform = 'translate3d(' + window.position.x + 'px, ' + window.position.y + 'px, 0px) scale(1)';
      }
    }
  }

  reset() {
    localStorage.removeItem("WindowMoved");
    super.reset();
  }
}
