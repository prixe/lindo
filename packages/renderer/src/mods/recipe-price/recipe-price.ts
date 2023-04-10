/* eslint-disable prefer-rest-params */
import { Mod } from '@/mods/mod'
import { DofusWindow } from '@/dofus-window'
import { RootStore } from '@/store'
import { TranslationFunctions } from '@lindo/i18n'

export class RecipePrice extends Mod {
  constructor(wGame: DofusWindow, rootStore: RootStore, LL: TranslationFunctions) {
    super(wGame, rootStore, LL)
    window.lindoAPI.logger.info('- enable Recipe Prices helper')()
    const itemRecipes = this.getWindowById('itemRecipes')
    this.hookFunction(itemRecipes, '_displayItem', () => {
      setTimeout(() => {
        const itemRecipes = this.getWindowById('itemRecipes') as any
        const singleton = this.wGame.findSingleton('getAveragePrice', this.wGame) as any
        const func = singleton.exports.getAveragePrice
        const recipe = itemRecipes?.recipeBox?.rawRecipe
        const slots = itemRecipes?.itemBox?.item?.recipeSlots
        let res = 0
        let resCost = func(itemRecipes?.recipeBox?.rawRecipe?.resultId)
        for (let i = recipe?.ingredientIds?.length - 1; i >= 0; i--) {
          const id = recipe.ingredientIds[i]
          const cost = func(id)
          const quantity = recipe.quantities[i]
          if (cost >= 0) res += cost * quantity
        }
        if (slots === 0) {
          res = 0
          resCost = 0
        }
        this.injectCost(res, resCost)
      }, 100)
    })
  }

  destroy(): void {
    console.log('destroyed')
  }

  private getKamaDiv() {
    return "<div style='background: url(./assets/ui/icons/kama.png) no-repeat;width: 20px;display: inline-block;height: 16px;background-size: 18px;'></div>"
  }

  private injectCost(cost: number, resultCost: number) {
    const el = this.wGame.document.querySelector('.itemRecipeBox .title')
    if (!el) {
      throw new Error('')
    }
    let text = el.innerHTML
    const ind = text.indexOf('<element')
    if (ind >= 0) text = el.innerHTML.substring(0, ind)
    if (cost > 0)
      el.innerHTML = `${text}<element style='color:${
        cost < resultCost ? 'green' : 'red'
      }'> [${cost}]${this.getKamaDiv()}</element> - <element style='color: yellow'>[${resultCost}]${this.getKamaDiv()}</element>`
    else el.innerHTML = text
  }

  private hookFunction(object: any, functionName: string, callback: any) {
    ;(function (originalFunction) {
      object[functionName] = function () {
        const returnValue = originalFunction.apply(this, arguments)
        callback.apply(this, [returnValue, originalFunction, arguments])
        return returnValue
      }
    })(object[functionName])
  }

  private getWindowById(id: string) {
    const window = this.wGame.gui.windowsContainer.getChildren().find((e) => e.id === id)
    if (!window) {
      throw new Error(`Can't find the window id ${id}`)
    }
    return window
  }
}
