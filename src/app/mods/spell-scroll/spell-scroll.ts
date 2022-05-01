import {Mod} from "../mod";

export class SpellScroll extends Mod {
  private stylesheet: HTMLStyleElement;
  private spellScrollUsedText: string;
  private scrollPointsContainer: HTMLDivElement;
  private spellWindow;
  private grimoire;
  private injectCode;
  private evOpen;
  private update;

  startMod(): void {

    this.spellScrollUsedText = this.translate.instant("app.option.vip.spellscroll.spellScrollUsed");
    this.grimoire = this.wGame.gui.windowsContainer.getChildren().find(w => w.id === 'grimoire');
    this.spellWindow = this.grimoire.tabs.tabsMap.spells.target;

    this.injectCode = () => {
      const spellsCol = this.wGame.document.querySelector('.SpellsWindow .col1');

      if (!spellsCol) {
        return;
      }

      this.scrollPointsContainer = this.wGame.document.createElement('div');
      this.scrollPointsContainer.className = 'SpellScrollPoints';

      const scrollPointsLabel = this.wGame.document.createElement('div');
      scrollPointsLabel.className = 'label';
      scrollPointsLabel.innerText = this.spellScrollUsedText;

      const usedScrolls = this.wGame.document.createElement('div');
      usedScrolls.className = 'usedScrolls';

      this.scrollPointsContainer.appendChild(scrollPointsLabel);
      this.scrollPointsContainer.appendChild(usedScrolls);

      spellsCol.appendChild(this.scrollPointsContainer);
    }

    this.evOpen = () => {
      if (!this.scrollPointsContainer) {
        this.injectCode();
      }
      if (this.spellWindow._elementIsVisible) {
        this.update();
      }
    }

    this.update = () => {
      const usedScrolls = this.wGame.document.querySelector('.SpellScrollPoints .usedScrolls');
      let pointsUsed = 0;

      if (usedScrolls) {
        const points = [0, 0, 1, 3, 6, 10, 15];
        let pointsUsed = Object.values(this.spellWindow.spellMap).reduce((acc: number, curr: any) => {
          return acc + points[curr.level];
        }, 0);

        usedScrolls.innerHTML = Math.abs(this.maxSpellPoints - +pointsUsed - this.remainingSpellsPoints);
      }
    }

    this.stylesheet = this.wGame.document.createElement('style');
    this.stylesheet.id = "SpellScroll";
    this.stylesheet.innerHTML = `
      .window .SpellsWindow .col1 .SpellScrollPoints {
        min-height: 22px;
        line-height: 26px;
        display: -webkit-flex;
        display: flex;
        -webkit-flex-direction: row;
        flex-direction: row;
      }

      .window .SpellsWindow .col1 .SpellScrollPoints .label {
        -webkit-flex: 1;
        flex: 1;
        min-height: 1px;
        text-align: right;
      }

      .window .SpellsWindow .col1 .SpellScrollPoints .usedScrolls {
        text-align: center;
        min-width: 100px;
      }
    `;

    this.wGame.document.head.appendChild(this.stylesheet);

    const evCharacterStatsListMessage = () => {
      if (this.spellWindow._elementIsVisible) {
        if (!this.scrollPointsContainer) {
          this.injectCode();
        }
        this.update();
      }
    }

    this.grimoire?.on('open', this.evOpen);
    this.grimoire?.tabs?.on('openTab', this.evOpen);

    this.on(this.wGame.dofus.connectionManager, "CharacterStatsListMessage", evCharacterStatsListMessage);

    if (this.spellWindow._elementIsVisible) {
      if (!this.scrollPointsContainer) {
        this.injectCode();
      }
      this.update();
    }
  }

  get maxSpellPoints() {
    return this.wGame.gui.playerData?.characterBaseInformations?.level - 1;
  }

  get remainingSpellsPoints() {
    return this.wGame.gui.playerData?.characters?.mainCharacter?.characteristics?.spellsPoints;
  }

  reset(): void {
    this.stylesheet?.remove?.();
    this.scrollPointsContainer?.remove?.();
    this.grimoire?.removeListener('open', this.evOpen);
    this.grimoire?.tabs?.removeListener('openTab', this.evOpen);
    super.reset();
  }
}
