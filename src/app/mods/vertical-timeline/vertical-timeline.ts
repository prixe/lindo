import { SettingsService } from "@services/settings.service";
import {Mod} from "../mod";

export class VerticalTimeline extends Mod {

  private stylesheet: HTMLStyleElement;

  startMod(): void {
    this.params = this.settings.option.vip.general.verticaltimeline;

    if (this.params) {
      Logger.info('- enable VerticalTimeline');
      this.stylesheet = window.document.createElement('style');
      this.stylesheet.id = 'VerticalTimeline';
      this.stylesheet.innerHTML = `
      .Timeline.vertical:not(.collapsed) .fighterListContainer {
        max-width: 75px;
        display: block;
        height: auto;
        margin: 0 auto;
      }

      .Timeline.vertical:not(.collapsed) .Scroller .iScrollIndicator {
        right: -10px;
      }

      .Timeline.vertical:not(.collapsed) .fighterListContainer .fighterList {
        height: 100%;
        max-height: 45vh;
      }

      .Timeline.vertical:not(.collapsed) .fighterListContainer .fighterList  .scrollerContent {
        flex-direction: column;
        margin-right: 0;
        margin-left: 5px;
        height: auto;
        position: relative;
        padding-bottom: 10px;
      }

      .Timeline.vertical:not(.collapsed) .fighterListContainer .fighter.current {
        margin-top: 0;
        margin-left: 8px;
      }

      .Timeline.vertical:not(.collapsed) .fighterListContainer .fighter {
        width: 51px;
      }

      .Timeline.vertical:not(.collapsed) .fighterListContainer .fighter.current:after {
        transform: rotate(90deg);
        left: -24px;
        bottom: 15px;
      }

      .Timeline.vertical:not(.collapsed) .fighterListContainer .fighter.summoned {
        max-width: 41px;
        margin-left: 12px;
      }

      .Timeline.vertical:not(.collapsed) .fighterListContainer .fighter.summoned.current {
        margin-left: 20px;
      }

      .Timeline.vertical:not(.collapsed) .FightBuffs {
        margin-top: 0;
        position: absolute;
        left: -45px;
        width: 43px;
        top: 25px;
      }

      .Timeline.vertical:not(.collapsed).magnetLeft .FightBuffs {
        left: auto;
        right: -45px;
      }
      `;

      this.wGame.document.head.appendChild(this.stylesheet);

      // Custom class vertical pour mise en forme
      this.wGame.document.querySelector('.Timeline').classList.add('vertical');

      // Suppression du mode horizontal de iScroll
      this.wGame.gui.timeline.fighterList.rootElement.classList.remove('horizontal');
      this.wGame.gui.timeline.fighterListScroller.iScroll.options.scrollX = false;
      this.wGame.gui.timeline.fighterListScroller.iScroll.options.scrollY = true;

      // Changement de la scrollbar
      this.wGame.gui.timeline.fighterListScroller.iScroll.indicators[0].options.listenX = false;
      this.wGame.gui.timeline.fighterListScroller.iScroll.indicators[0].options.listenY = true;
      this.wGame.gui.timeline.fighterListScroller.iScroll.indicators[0].wrapper.classList.remove('iScrollHorizontalScrollbar');
      this.wGame.gui.timeline.fighterListScroller.iScroll.indicators[0].wrapper.classList.add('iScrollVerticalScrollbar');

      // Refresh pour prendre en compte mes changements
      this.wGame.gui.timeline.fighterListScroller.iScroll.refresh();
    }
  }

  public reset() {
    if (this.params) {
      this.stylesheet?.remove?.();

      if (this.wGame.gui.timeline) {
        this.wGame.document.querySelector?.('.Timeline')?.classList.remove('vertical');

        this.wGame.gui.timeline.fighterList.rootElement.classList.add('horizontal');
        this.wGame.gui.timeline.fighterListScroller.iScroll.options.scrollX = true;
        this.wGame.gui.timeline.fighterListScroller.iScroll.options.scrollY = false;

        this.wGame.gui.timeline.fighterListScroller.iScroll.indicators[0].options.listenX = true;
        this.wGame.gui.timeline.fighterListScroller.iScroll.indicators[0].options.listenY = false;
        this.wGame.gui.timeline.fighterListScroller.iScroll.indicators[0].wrapper.classList.add('iScrollHorizontalScrollbar');
        this.wGame.gui.timeline.fighterListScroller.iScroll.indicators[0].wrapper.classList.remove('iScrollVerticalScrollbar');

        this.wGame.gui.timeline.fighterListScroller.iScroll.refresh();
      }

    }
    super.reset();
  }
}
