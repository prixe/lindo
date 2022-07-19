import { ConnectionManagerEvents, DofusWindow, Job } from '@/dofus-window'
import { RootStore } from '@/store'
import { TranslationFunctions } from '@lindo/i18n'
import { observe } from 'mobx'
import { EventManager } from '../helpers'
import { Mod } from '../mod'

export class JobXPMod extends Mod {
  private xpRestanteText?: HTMLDivElement
  private eventManager = new EventManager()
  private settingDisposer: () => void

  constructor(wGame: DofusWindow, rootStore: RootStore, LL: TranslationFunctions) {
    super(wGame, rootStore, LL)
    this.settingDisposer = observe(
      this.rootStore.optionStore.gameJob,
      'xpRemainingBeforeLevelUp',
      () => {
        if (this.rootStore.optionStore.gameJob.xpRemainingBeforeLevelUp) this.start()
        else this.stop()
      },
      true
    )
  }

  private start(): void {
    console.info('- enable Jobsxp')
    const jobsXPBarCssCheck = this.wGame.document.getElementById('jobsxpbarCss')
    const remainingXpIdCheck = this.wGame.document.getElementById('xpRestanteId')
    if (jobsXPBarCssCheck && jobsXPBarCssCheck.parentElement) {
      jobsXPBarCssCheck.parentElement.removeChild(jobsXPBarCssCheck)
    }
    if (remainingXpIdCheck && remainingXpIdCheck.parentElement) {
      remainingXpIdCheck.parentElement.removeChild(remainingXpIdCheck)
    }

    const jobsXPBarCss = document.createElement('style')
    jobsXPBarCss.id = 'jobsxpbarCss'
    jobsXPBarCss.innerHTML = `
            .xpRestanteText {
                box-sizing: border-box;
                overflow: hidden;
                font-size: 11px;
                position: absolute;
                color: white;
                margin-right: 10px;
                margin-top: 10px;
                text-shadow: 0 0 5px rgba(0, 0, 0, 0.9);
                right: 10px;
                pointer-events: none;
                padding: 5px 16px;
                top: 0;
            }

            .xpRestanteText::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-image-source: url(./assets/ui/container.png);
                border-image-slice: 63;
                border-image-width: 37px;
                border-radius: 10px;
                border-style: solid;
                background-color: #2e2d28;
                z-index: -1;
                box-sizing: border-box;
                opacity: 0.8;
            }

            .xpRestanteText .job {
                display: flex;
                margin: 8px;
                align-items: center;
            }

            .xpRestanteText img {
                flex-grow: 0;
                flex-shrink: 0;
                width: 50px;
                height: 50px;
                margin-left: 10px;
            }

            .xpRestanteText .description {
                flex-grow: 1;
                width: 120px;
                text-align: right;
            }

            .xpRestanteText .name {
                font-family: berlin_sans_fb_demibold;
                font-size: 1.6em;
                color: #ced0bb;
                text-shadow: 0 0 3px rgba(0, 0, 0, 0.9);
            }


            `
    this.wGame.document.getElementsByTagName('head')[0].appendChild(jobsXPBarCss)

    this.create()
    this.updateJob()
    this.setFightStart()
    this.stopOnFightEnd()
    this.stopOnFightStop()
  }

  private create(): void {
    setTimeout(() => {
      if (this.wGame.gui.playerData && this.wGame.gui.playerData.jobs && this.wGame.gui.playerData.jobs.list) {
        const jobs = this.wGame.gui.playerData.jobs.list
        const jobKeys = Object.keys(jobs)
        if (jobKeys.length > 0 && !jobs[jobKeys[0]].experience) this.create()
        else {
          this.clean()
          this.xpRestanteText = document.createElement('div')
          this.xpRestanteText.id = 'xpRestanteId'
          this.xpRestanteText.className = 'xpRestanteText'
          this.xpRestanteText.style.visibility = 'visible'
          this.xpRestanteText.innerHTML = ''
          for (const id in jobs) {
            const job = jobs[id]
            if (job.experience?.jobXpNextLevelFloor) {
              const xpToWin = job.experience.jobXpNextLevelFloor - job.experience.jobXP
              const html = `
                <div class="job">
                    <div class="description">
                        <div class="name">${job.info.nameId}</div>
                        <div class="text">
                            ${this.LL.mod.jobXP.xpMissing({
                              xp: xpToWin,
                              nextLevel: job.experience.jobLevel + 1
                            })}
                        </div>
                    </div>
                    ${this.getIconHTML(job)}
                </div>
              `

              this.xpRestanteText.insertAdjacentHTML('beforeend', html)
            }
          }
          if (this.xpRestanteText.innerHTML !== '') {
            this.wGame.foreground.rootElement.appendChild(this.xpRestanteText)
          }
        }
      } else this.create()
    }, 500)
  }

  private setFightStart(): void {
    this.eventManager.on<ConnectionManagerEvents, 'GameFightStartingMessage'>(
      this.wGame.dofus.connectionManager,
      'GameFightStartingMessage',
      () => {
        try {
          this.clean()
        } catch (ex) {
          console.error(ex)
        }
      }
    )
  }

  private stopOnFightEnd(): void {
    this.eventManager.on<ConnectionManagerEvents, 'GameFightEndMessage'>(
      this.wGame.dofus.connectionManager,
      'GameFightEndMessage',
      () => {
        try {
          this.create()
        } catch (ex) {
          console.error(ex)
        }
      }
    )
  }

  private stopOnFightStop(): void {
    this.eventManager.on<ConnectionManagerEvents, 'GameFightLeaveMessage'>(
      this.wGame.dofus.connectionManager,
      'GameFightLeaveMessage',
      () => {
        try {
          this.create()
        } catch (ex) {
          console.error(ex)
        }
      }
    )
  }

  private clean(): void {
    if (this.xpRestanteText && this.xpRestanteText.parentElement) {
      this.xpRestanteText.style.visibility = ''
      this.xpRestanteText.innerHTML = ''
      this.xpRestanteText.parentElement.removeChild(this.xpRestanteText)
    }
  }

  private updateJob(): void {
    this.eventManager.on<ConnectionManagerEvents, 'JobExperienceUpdateMessage'>(
      this.wGame.gui,
      'JobExperienceUpdateMessage',
      (e) => {
        try {
          if (e.experiencesUpdate.jobXpNextLevelFloor) {
            this.create()
          }
        } catch (ex) {
          console.error(ex)
        }
      }
    )
  }

  private getIconHTML(job: Job): string {
    const src = this.wGame.Config.assetsUrl + '/gfx/jobs/' + job.info.iconId + '.png'
    return '<img src="' + src + '"  alt=""/>'
  }

  private stop() {
    this.eventManager.close()
    const jobsxpbarCss = this.wGame.document.getElementById('jobsxpbarCss')
    if (jobsxpbarCss && jobsxpbarCss.parentElement) {
      jobsxpbarCss.parentElement.removeChild(jobsxpbarCss)
    }
    if (this.xpRestanteText && this.xpRestanteText.parentElement) {
      this.xpRestanteText.parentElement.removeChild(this.xpRestanteText)
    }
  }

  destroy(): void {
    this.stop()
    this.settingDisposer()
  }
}
