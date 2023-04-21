/* eslint-disable */
import { Mod } from '@/mods/mod'
import { DofusWindow } from '@/dofus-window'
import { RootStore } from '@/store'
import { TranslationFunctions } from '@lindo/i18n'
//Thanks Moune
export class OffensiveMonsters extends Mod {
  private manager: any
  private grimoireWindow: any
  private oldAddMonster: any
  private damageInfo: any
  private spellWindow: any
  private mobSpells: any

  constructor(wGame: DofusWindow, rootStore: RootStore, LL: TranslationFunctions) {
    super(wGame, rootStore, LL)
    window.lindoAPI.logger.info('- enable Offensive Monsters')()
    this.manager = this.findSingleton('getWindow') as any
    this.grimoireWindow = this.manager.getWindow('grimoire')
    setTimeout(() => {

      this.initSpellUi()

      this.initWindow()

      this.injectButton()
    }, 300)
  }

  findSingleton(singleton: string): any {
    const ret = this.wGame.findSingleton(singleton, this.wGame) as any
    if (Array.isArray(ret))
      return ret
    return ret?.exports
  }

  destroy(): void {

    if (this.oldAddMonster) {
      const x = (this.findSingleton('addMonster') as any)
      x.prototype.addMonster = this.oldAddMonster
      this.oldAddMonster = null
    }
  }

  initWindow() {
    this.createWindow('mouneSpellMobs', 'Hechizos del monstruo')
    this.spellWindow = this.manager.getWindow('mouneSpellMobs')
    this.damageInfo = this.spellWindow.windowBody.createChild('div')
    this.damageInfo.setText('Dommages x nani')
    this.damageInfo.rootElement.style.cssText = `
        text-align: center;
        margin-bottom: 10px;
        color: navajowhite;
        font-size: 20px;
      `
    this.spellWindow.windowBody.appendChild(this.mobSpells)
  }

  initSpellUi() {
    const constr = this.findSingleton('_loadAllSpells') as any
    // eslint-disable-next-line new-cap
    this.mobSpells = new constr()
    this.mobSpells.emit('open')
    this.mobSpells.emit('opened')
    this.mobSpells._spellsStatus = {}
    this.mobSpells._spellCache = {}
    this.mobSpells.spells = {}
    const r = (this.findSingleton('createSpells') as any[])[1].exports.prototype
    this.mobSpells._loadAllSpells = constr.prototype._loadAllSpells.bind(this.mobSpells)

    this.mobSpells._createSpells = r.createSpells.bind(this.mobSpells)
    this.mobSpells.addSpells = (this.findSingleton('addSpells') as any).prototype.addSpells.bind(
      this.mobSpells
    )
  }

  addSpells(ids: any) {
    this.mobSpells._createSpells(ids, () => {
      const w = (this.findSingleton('getWindow') as any)
      w.switch('mouneSpellMobs')
      this.mobSpells._loadAllSpells(this.mobSpells._spellCache)
    })
  }

  finishSpells(ids: any) {
    this.mobSpells._spellCache = {}
    this.addSpells(ids)
  }

  injectButton() {
    function n(e: any, t: any, i: any) {
      ;(void 0 === i.min[e] || i.min[e] > t[e]) && (i.min[e] = t[e]),
      (void 0 === i.max[e] || i.max[e] < t[e]) && (i.max[e] = t[e])
    }

    function o(e: any) {
      for (var t: any = {
          min: {},
          max: {}
        },
             i = [
               'level',
               'lifePoints',
               'actionPoints',
               'movementPoints',
               'earthResistance',
               'airResistance',
               'fireResistance',
               'waterResistance',
               'neutralResistance'
             ],
             o = i.length,
             s = 0,
             a = e.length;
           s < a;
           s += 1
      )
        for (let r = e[s], l = 0; l < o; l += 1) {
          const c = i[l]
          n(c, r, t)
        }
      return t
    }

    const module = this
    const buttonCreator = this.findSingleton('DofusButton') as any
    const m = (this.findSingleton('getWuiName') as any)[2].exports
    const b = (this.findSingleton('getText') as any)[0].exports.getText
    const y = this.findSingleton('createMapLocation') as any
    this.oldAddMonster = (this.findSingleton('addMonster') as any).prototype.addMonster
    ;(this.findSingleton('addMonster') as any).prototype.addMonster = function(e: any, t: any) {
      // eslint-disable-next-line new-cap
      const i = new m('div', {
        className: 'infos'
      })
      const n = i.createChild('div', {
        className: 'gfx'
      })
      n.setStyle('backgroundImage', t)
      const s = i.createChild('div', {
        className: 'infosGroupRight'
      })
      const a = s.createChild('div', {
        className: 'cf'
      })
      const r = ['name']
      e.isBoss && r.push('boss'), e.isMiniBoss && r.push('miniBoss'), e.isQuestMonster && r.push('questMonster')
      const l = true
      let c = e.nameId
      // eslint-disable-next-line no-unused-expressions
      l && (c += ' (' + e.id + ')'),
        a.createChild('div', {
          className: r,
          text: c
        })
      const u = o(e.grades)
      const d = u.min.level
      const h = u.max.level
      let p = b('ui.common.short.level') + ' ' + d
      // eslint-disable-next-line no-unused-expressions
      d !== h && (p += ' ' + b('ui.chat.to') + ' ' + h),
        a.createChild('div', {
          className: 'level',
          text: p
        })

      s.appendChild(y.createMapLocation(e.subareas, this.subAreas, e.favoriteSubareaId))
      const f = this.monsterList.addItem(
        {
          id: e.id,
          element: i,
          data: e
        },
        {
          noRefresh: !0
        }
      )
      // eslint-disable-next-line new-cap
      const spellButton = new buttonCreator({
        tooltip: 'Ver hechizos de los monstruos',
        addIcon: true
      })
      spellButton.rootElement.style.cssText = `
                pointer: cursor;
                background-image: url(../game/assets/ui/banner/menuIconSpell.png);
                background-size: contain;
                background-repeat: no-repeat;
                width: 30px;
                height: 30px;
                display: flex;
                flex-direction: row;
              `
      f.addClassNames('monster'),
        (f.monsterData = e),
        (f.gradeMinMaxInfo = u),
        s._childrenList[1].insertChildBefore(spellButton, s._childrenList[1]._childrenList[1])
      spellButton.on('tap', () => {
        const minWisdom = 1 + e.grades[0].wisdom / 100
        const len = e.grades.length
        const maxWisdom = 1 + e.grades[len - 1].wisdom / 100
        if (minWisdom == maxWisdom) {
          module.damageInfo.setText(`Daños x ${minWisdom}`)
        } else {
          module.damageInfo.setText(`Daños x ${minWisdom} a x ${maxWisdom}`)
        }
        module.mobSpells.spells = {}
        module.finishSpells(e.spells)
      })
    }
  }

  createWindow(id: any, name: any) {
    const windowMaker = (this.findSingleton('startWaitingForContent') as any[])[0].exports
    const superClass = (this.findSingleton('inherits') as any)[0].exports.inherits

    function myWindow(this: any) {
      windowMaker.call(this, {
        className: id,
        title: name,
        plusButton: true,
        minusButton: true,
        positionInfo: {
          left: 'c',
          top: 'c',
          width: '60%',
          height: '70%',
          isDefault: true
        }
      })
      this.status = {
        lastOpenCoords: {},
        lastWindowInfo: {
          x: null,
          y: null,
          w: null,
          h: null
        },
        initialSizeAndPosition: {
          left: 'c',
          bottom: '3%',
          width: '50%',
          height: '90%'
        }
      }
      this.plusButton.hide()
      this.minusButton.hide()
    }


    superClass(myWindow, windowMaker)

    // @ts-ignore
    this.manager.addWindow(id, new myWindow)
  }
}
