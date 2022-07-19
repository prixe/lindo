import { DofusWindow } from '@/dofus-window'
import { RootStore } from '@/store'
import { TranslationFunctions } from '@lindo/i18n'
import { observe } from 'mobx'
import { EventManager } from '../helpers'
import { Mod } from '../mod'

export class ZaapSearchFilterMod extends Mod {
  private styleTag?: HTMLStyleElement
  private zaapSearchContainer?: HTMLDivElement
  private zaapSearchInput?: HTMLInputElement

  private readonly eventManager = new EventManager()
  private readonly settingDisposer: () => void

  constructor(wGame: DofusWindow, rootStore: RootStore, LL: TranslationFunctions) {
    super(wGame, rootStore, LL)
    this.settingDisposer = observe(
      this.rootStore.optionStore.gameGeneral,
      'zaapSearchFilter',
      () => {
        if (this.rootStore.optionStore.gameGeneral.zaapSearchFilter) this.start()
        else this.stop()
      },
      true
    )
  }

  private start(): void {
    console.info('- enable ZaapSearchFilter')

    this.eventManager.on(this.wGame.dofus.connectionManager, 'ZaapListMessage', () => {
      this.createSearchFilter()
    })

    this.eventManager.on(this.wGame.dofus.connectionManager, 'TeleportDestinationsListMessage', (arg) => {
      if (arg.teleporterType === 1) {
        this.createSearchFilterZaapi()
      }
    })

    this.eventManager.on(this.wGame.dofus.connectionManager, 'TeleportDestinationsListMessage', (arg) => {
      if (arg.teleporterType === 2) {
        // Merci TonTonJS
        this.createSearchFilterPrisme()
      }
    })

    this.eventManager.on(this.wGame.dofus.connectionManager, 'LeaveDialogMessage', () => {
      this.resetSearchFilter()
    })
    const favorite = localStorage.getItem('zaapFav')
    if (favorite == null || favorite === '') {
      localStorage.setItem('zaapFav', '')
    }
  }

  // Zaap
  private createSearchFilter(): void {
    this.injectInputInDom()
    this.addFavInDom()

    this.zaapSearchInput!.addEventListener('keyup', () => {
      const zaapWanted = this.zaapSearchInput!.value.toLowerCase()

      const zaapList = this.wGame.document
        .getElementsByClassName('lindo_zaapBodyHeight__custom')[0]
        .getElementsByClassName('row') as HTMLCollectionOf<HTMLDivElement>

      for (const currentZaap of zaapList) {
        const destination = currentZaap.getElementsByClassName('destinationName')

        if (!destination.length) {
          continue
        }

        currentZaap.style.display = 'none'

        if (currentZaap.innerText.toLowerCase().includes(zaapWanted)) {
          currentZaap.style.display = 'block'
        }
      }
    })
  }

  private injectInputInDom(): void {
    this.styleTag = this.wGame.document.createElement('style')
    this.wGame.document.getElementsByTagName('head')[0].appendChild(this.styleTag)

    this.styleTag.innerHTML += `
        .lindo_zaapBodyHeight__custom{
            height: 70% !important;
        }

        .lindo_zaapSearch__container{
            padding: 10px;
            width: 100%;
        }

        .lindo_zaapSearch__input{
            text-align: center;
            width: 96%;
            margin-right: 10px;
            background-color: #424242;
            border-radius: 5px;
            color: white;
            border-color: #262626;
            height: 34px;
            font-size: 1em;
        }
        `

    const zaapPanels = this.wGame.document.getElementsByClassName('zaapBody')[0].getElementsByClassName('panels')[0]

    zaapPanels.classList.add('lindo_zaapBodyHeight__custom')

    this.zaapSearchContainer = this.wGame.document.createElement('div')
    this.zaapSearchInput = this.wGame.document.createElement('input')

    this.zaapSearchInput.setAttribute('placeholder', this.LL.mod.zaapSearchFilter.placeholder())
    this.zaapSearchInput.setAttribute('id', 'zaapName')

    this.zaapSearchContainer.classList.add('lindo_zaapSearch__container')
    this.zaapSearchInput.classList.add('lindo_zaapSearch__input')

    this.zaapSearchContainer.append(this.zaapSearchInput)
    this.wGame.document.getElementsByClassName('zaapBody')[0].prepend(this.zaapSearchContainer)
    requestAnimationFrame(() => {
      this.zaapSearchInput!.focus()
      this.zaapSearchInput!.select()
    })
  }

  private addFavInDom() {
    let zaapList = this.wGame.document
      .getElementsByClassName('lindo_zaapBodyHeight__custom')[0]
      .getElementsByClassName('row')

    // Ajout de l'étoile fovori (rempli ou non)
    for (let index = 1; index < zaapList.length - 1; index++) {
      const currentZaap = zaapList[index]

      const divVide = currentZaap.getElementsByClassName('col')[0]
      if (divVide.innerHTML === '') {
        const idZaap = currentZaap.getElementsByClassName('col')[1].getElementsByClassName('destinationName')[0]
        if (idZaap !== undefined) {
          const actionButton = (divButton: HTMLDivElement, zaap: string) => {
            const strFavorites = localStorage.getItem('zaapFav')!
            const favorites = strFavorites.split(',')
            let unfav = 0
            for (let index = 0; index < favorites.length; index++) {
              if (favorites[index] === zaap) {
                unfav = index
              }
            }
            if (unfav !== 0) {
              favorites.splice(unfav, 1)
              divButton.innerHTML = `
                            <img width="25" height="24" src="./assets/ui/icons/greyStar.png">
                            `
            } else {
              divButton.innerHTML = `
                            <img width="25" height="24" src="./assets/ui/icons/goldenStar.png">
                            `
              favorites.push(zaap)
            }
            localStorage.setItem('zaapFav', favorites.toString())
          }

          const divButton = document.createElement('div')
          divButton.onclick = () => {
            actionButton(divButton, idZaap.innerHTML)
          }

          const strFavorites = localStorage.getItem('zaapFav')!
          const favorites = strFavorites.split(',')
          let found = false
          for (let index = 0; index < favorites.length; index++) {
            if (favorites[index] === idZaap.innerHTML) {
              found = true
            }
          }

          if (found) {
            divButton.innerHTML = `
                        <img width="25" height="24" src="./assets/ui/icons/goldenStar.png">
                        `
          } else {
            divButton.innerHTML = `
                        <img width="25" height="24" src="./assets/ui/icons/greyStar.png">
                        `
          }

          divVide.appendChild(divButton)
        }
      }
    }

    // on met les favori "en haut"
    zaapList = this.wGame.document
      .getElementsByClassName('lindo_zaapBodyHeight__custom')[0]
      .getElementsByClassName('row')
    let saveIndex = 1
    for (let index = 1; index < zaapList.length - 1; index++) {
      const currentZaap = zaapList[index]
      const idZaap = currentZaap.getElementsByClassName('col')[1].getElementsByClassName('destinationName')[0]
      const strFavorites = localStorage.getItem('zaapFav')!
      const favorites = strFavorites.split(',')
      let found = false
      for (let index = 0; index < favorites.length; index++) {
        if (idZaap !== undefined)
          if (favorites[index] === idZaap.innerHTML) {
            found = true
          }
      }
      if (found) {
        currentZaap.parentNode!.prepend(currentZaap)
        saveIndex++
        index = saveIndex
      }
    }
  }

  // Prisme
  private createSearchFilterPrisme(): void {
    this.injectInputInDomPrisme()
    this.addFavInDomPrism() // Fav Prisme

    this.zaapSearchInput!.addEventListener('keyup', () => {
      const zaapWanted = this.zaapSearchInput!.value.toLowerCase()

      const zaapList = this.wGame.document
        .getElementsByClassName('lindo_prismeBodyHeight__custom')[0]
        .getElementsByClassName('row') as HTMLCollectionOf<HTMLDivElement>

      for (const currentZaap of zaapList) {
        const destination = currentZaap.getElementsByClassName('destinationName')

        if (!destination.length) {
          continue
        }

        currentZaap.style.display = 'none'
        if (currentZaap.innerText.toLowerCase().includes(zaapWanted)) {
          currentZaap.style.display = 'block'
        }
      }
    })
  }

  private injectInputInDomPrisme(): void {
    this.styleTag = this.wGame.document.createElement('style')
    this.wGame.document.getElementsByTagName('head')[0].appendChild(this.styleTag)

    this.styleTag.innerHTML += `
        .lindo_prismeBodyHeight__custom{
            height: 70% !important;
        }

        .lindo_zaapSearch__container{
            padding: 10px;
            width: 100%;
        }

        .lindo_zaapSearch__input{
            text-align: center;
            width: 96%;
            margin-right: 10px;
            background-color: #424242;
            border-radius: 5px;
            color: white;
            border-color: #262626;
            height: 34px;
            font-size: 1em;
        }
        `

    const zaapPanels = this.wGame.document.getElementsByClassName('zaapBody')[0].getElementsByClassName('panels')[0]

    zaapPanels.classList.add('lindo_prismeBodyHeight__custom')

    this.zaapSearchContainer = this.wGame.document.createElement('div')
    this.zaapSearchInput = this.wGame.document.createElement('input')

    this.zaapSearchInput.setAttribute('placeholder', this.LL.mod.zaapSearchFilter.placeholderPrisme())
    this.zaapSearchInput.setAttribute('id', 'zaapName')

    this.zaapSearchContainer.classList.add('lindo_zaapSearch__container')
    this.zaapSearchInput.classList.add('lindo_zaapSearch__input')

    this.zaapSearchContainer.append(this.zaapSearchInput)
    this.wGame.document.getElementsByClassName('zaapBody')[0].prepend(this.zaapSearchContainer)
    requestAnimationFrame(() => {
      this.zaapSearchInput!.focus()
      this.zaapSearchInput!.select()
    })
  }

  private addFavInDomPrism() {
    let zaapList = this.wGame.document
      .getElementsByClassName('lindo_prismeBodyHeight__custom')[0]
      .getElementsByClassName('row')

    // Ajout de l'étoile fovori (rempli ou non)
    for (let index = 1; index < zaapList.length - 1; index++) {
      const currentZaap = zaapList[index]

      const divVide = currentZaap.getElementsByClassName('col')[0]
      if (divVide.innerHTML === '') {
        const idZaap = currentZaap.getElementsByClassName('col')[1].getElementsByClassName('destinationName')[0]
        if (idZaap !== undefined) {
          const actionButton = (divButton: HTMLDivElement, zaap: string) => {
            const strFavorites = localStorage.getItem('zaapFav')!
            const favorites = strFavorites.split(',')
            let unfav = 0
            for (let index = 0; index < favorites.length; index++) {
              if (favorites[index] === zaap) {
                unfav = index
              }
            }
            if (unfav !== 0) {
              favorites.splice(unfav, 1)
              divButton.innerHTML = `
                            <img width="25" height="24" src="./assets/ui/icons/greyStar.png">
                            `
            } else {
              divButton.innerHTML = `
                            <img width="25" height="24" src="./assets/ui/icons/goldenStar.png">
                            `
              favorites.push(zaap)
            }
            localStorage.setItem('zaapFav', favorites.toString())
          }

          const divButton = document.createElement('div')
          divButton.onclick = () => {
            actionButton(divButton, idZaap.innerHTML)
          }

          const strFavorites = localStorage.getItem('zaapFav')!
          const favorites = strFavorites.split(',')
          let found = false
          for (let index = 0; index < favorites.length; index++) {
            if (favorites[index] === idZaap.innerHTML) {
              found = true
            }
          }

          if (found) {
            divButton.innerHTML = `
                        <img width="25" height="24" src="./assets/ui/icons/goldenStar.png">
                        `
          } else {
            divButton.innerHTML = `
                        <img width="25" height="24" src="./assets/ui/icons/greyStar.png">
                        `
          }

          divVide.appendChild(divButton)
        }
      }
    }

    // on met les favori "en haut"
    zaapList = this.wGame.document
      .getElementsByClassName('lindo_prismeBodyHeight__custom')[0]
      .getElementsByClassName('row')
    let saveIndex = 1
    for (let index = 1; index < zaapList.length - 1; index++) {
      const currentZaap = zaapList[index]
      const idZaap = currentZaap.getElementsByClassName('col')[1].getElementsByClassName('destinationName')[0]
      const strFavorites = localStorage.getItem('zaapFav')!
      const favorites = strFavorites.split(',')
      let found = false
      for (let index = 0; index < favorites.length; index++) {
        if (idZaap !== undefined)
          if (favorites[index] === idZaap.innerHTML) {
            found = true
          }
      }
      if (found) {
        currentZaap.parentNode!.prepend(currentZaap)
        saveIndex++
        index = saveIndex
      }
    }
  }

  // Zaapi
  private createSearchFilterZaapi(): void {
    this.injectInputInDomZaapi()
    this.addFavInDomZaapi() // Fav Zaapi

    this.zaapSearchInput!.addEventListener('keyup', () => {
      const zaapWanted = this.zaapSearchInput!.value.toLowerCase()

      const zaapList = this.wGame.document
        .getElementsByClassName('lindo_subwayBodyHeight__custom')[0]
        .getElementsByClassName('row') as HTMLCollectionOf<HTMLDivElement>

      for (const currentZaap of zaapList) {
        const destination = currentZaap.getElementsByClassName('destinationName')

        if (!destination.length) {
          continue
        }

        currentZaap.style.display = 'none'
        if (currentZaap.innerText.toLowerCase().includes(zaapWanted)) {
          currentZaap.style.display = 'block'
        }
      }
    })
  }

  private injectInputInDomZaapi(): void {
    this.styleTag = this.wGame.document.createElement('style')
    this.wGame.document.getElementsByTagName('head')[0].appendChild(this.styleTag)

    this.styleTag.innerHTML += `
        .lindo_subwayBodyHeight__custom{
            height: 70% !important;
        }

        .lindo_zaapSearch__container{
            padding: 10px;
            width: 100%;
        }

        .lindo_zaapSearch__input{
            text-align: center;
            width: 96%;
            margin-right: 10px;
            background-color: #424242;
            border-radius: 5px;
            color: white;
            border-color: #262626;
            height: 34px;
            font-size: 1em;
        }
        `

    const zaapPanels = this.wGame.document.getElementsByClassName('subwayBody')[0].getElementsByClassName('panels')[0]

    zaapPanels.classList.add('lindo_subwayBodyHeight__custom')

    this.zaapSearchContainer = this.wGame.document.createElement('div')
    this.zaapSearchInput = this.wGame.document.createElement('input')

    this.zaapSearchInput.setAttribute('placeholder', this.LL.mod.zaapSearchFilter.placeholderZaapi())
    this.zaapSearchInput.setAttribute('id', 'zaapName')

    this.zaapSearchContainer.classList.add('lindo_zaapSearch__container')
    this.zaapSearchInput.classList.add('lindo_zaapSearch__input')

    this.zaapSearchContainer.append(this.zaapSearchInput)
    this.wGame.document.getElementsByClassName('subwayBody')[0].prepend(this.zaapSearchContainer)
    requestAnimationFrame(() => {
      this.zaapSearchInput!.focus()
      this.zaapSearchInput!.select()
    })
  }

  // Zaapi Favoris
  private addFavInDomZaapi() {
    let zaapList = this.wGame.document
      .getElementsByClassName('lindo_subwayBodyHeight__custom')[0]
      .getElementsByClassName('row')

    // Ajout de l'étoile fovori (rempli ou non)
    for (let index = 1; index < zaapList.length - 1; index++) {
      const currentZaap = zaapList[index]

      const divVide = currentZaap.getElementsByClassName('col')[0]
      if (divVide.innerHTML === '') {
        const idZaap = currentZaap.getElementsByClassName('col')[1].getElementsByClassName('destinationName')[0]
        if (idZaap !== undefined) {
          const actionButton = (divButton: HTMLDivElement, zaap: string) => {
            const strFavorites = localStorage.getItem('zaapFav')!
            const favorites = strFavorites.split(',')
            let unfav = 0
            for (let index = 0; index < favorites.length; index++) {
              if (favorites[index] === zaap) {
                unfav = index
              }
            }
            if (unfav !== 0) {
              favorites.splice(unfav, 1)
              divButton.innerHTML = `
                            <img width="25" height="24" src="./assets/ui/icons/greyStar.png">
                            `
            } else {
              divButton.innerHTML = `
                            <img width="25" height="24" src="./assets/ui/icons/goldenStar.png">
                            `
              favorites.push(zaap)
            }
            localStorage.setItem('zaapFav', favorites.toString())
          }

          const divButton = document.createElement('div')
          divButton.onclick = () => {
            actionButton(divButton, idZaap.innerHTML)
          }

          const strFavorites = localStorage.getItem('zaapFav')!
          const favorites = strFavorites.split(',')
          let found = false
          for (let index = 0; index < favorites.length; index++) {
            if (favorites[index] === idZaap.innerHTML) {
              found = true
            }
          }

          if (found) {
            divButton.innerHTML = `
                        <img width="25" height="24" src="./assets/ui/icons/goldenStar.png">
                        `
          } else {
            divButton.innerHTML = `
                        <img width="25" height="24" src="./assets/ui/icons/greyStar.png">
                        `
          }

          divVide.appendChild(divButton)
        }
      }
    }

    // On met les favori "en haut"
    zaapList = this.wGame.document
      .getElementsByClassName('lindo_subwayBodyHeight__custom')[0]
      .getElementsByClassName('row')
    let saveIndex = 1
    for (let index = 1; index < zaapList.length - 1; index++) {
      const currentZaap = zaapList[index]
      const idZaap = currentZaap.getElementsByClassName('col')[1].getElementsByClassName('destinationName')[0]
      const strFavorites = localStorage.getItem('zaapFav')!
      const favorites = strFavorites.split(',')
      let found = false
      for (let index = 0; index < favorites.length; index++) {
        if (idZaap !== undefined)
          if (favorites[index] === idZaap.innerHTML) {
            found = true
          }
      }
      if (found) {
        currentZaap.parentNode!.prepend(currentZaap)
        saveIndex++
        index = saveIndex
      }
    }
  }

  private resetSearchFilter(): void {
    if (this.styleTag) {
      this.styleTag.remove()
      this.zaapSearchInput!.remove()
      this.zaapSearchContainer!.remove()
    }
  }

  private stop() {
    this.eventManager.close()
    this.resetSearchFilter()
  }

  destroy(): void {
    this.stop()
    this.settingDisposer()
  }
}
