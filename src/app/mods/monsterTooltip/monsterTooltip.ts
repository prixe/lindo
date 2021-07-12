import { Mod } from "../mod";

type TooltipData = {
    id: number;
    groupLevel: number;
    yellowStarsCount: number;
    redStarsCount: number;
    soloXp: number;
    partyXp: number;
    bonusPackActive: boolean;
    monsters: any[];
};

/*
Original work from : https://github.com/arcln/lindo/blob/master/src/app/core/mods/monsterTooltip/monsterTooltip.ts
*/

export class MonsterTooltip extends Mod {

    private visible = false;
    private monsterGroups = [];

    public startMod(): void {
        this.params = this.settings.option.vip.general;

        if (this.params.monster_tooltip) {

            Logger.info('- Enabled MonsterTooltip');

            this.wGame.addEventListener("keydown", e => this.onKeyEvent(e));
            this.wGame.addEventListener("keyup", e => this.onKeyEvent(e));

            const monsterTooltipCss = document.createElement('style');
            monsterTooltipCss.id = 'monsterTooltipCss';
            monsterTooltipCss.innerHTML = `
                .mtt-bossLine {
                    color: #A69FFF;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .mtt-bossIcon {
                    background-image: url('./assets/ui/bossIcon.png');
                    background-size: 17px 12px;
                    width: 17px;
                    height: 12px;
                }
            `;
            this.wGame.document.getElementsByTagName('head')[0].appendChild(monsterTooltipCss);

            this.on(this.wGame.dofus.connectionManager, "MapComplementaryInformationsDataMessage", ({ actors }) => {
                this.monsterGroups = actors.filter(actor => actor._type === "GameRolePlayGroupMonsterInformations");
                this.update();
            });

            this.on(this.wGame.dofus.connectionManager, "GameMapMovementMessage", ({ actorId, keyMovements }) => {
                const group = this.monsterGroups.find(group => group.contextualId === actorId);
                if (group) {
                    group.disposition.cellId = keyMovements[keyMovements.length - 1];
                    this.update();
                }
            });

            this.on(this.wGame.dofus.connectionManager, "GameContextRemoveElementMessage", ({ id }) => {
                const groupIndex = this.monsterGroups.findIndex(group => group.contextualId === id);
                if (groupIndex > -1) {
                    this.monsterGroups.splice(groupIndex, 1);
                    this.update();
                }
            });

            this.on(this.wGame.dofus.connectionManager, "GameRolePlayShowActorMessage", ({ informations }) => {
                if (informations._type === "GameRolePlayGroupMonsterInformations") {
                    this.monsterGroups.push(informations);
                    this.update();
                }
            });

            this.on(this.wGame.dofus.connectionManager, "GameFightStartingMessage", () => this.hide());
        }
    }

    public reset() {
        this.wGame.removeEventListener("keydown", this.onKeyEvent);
        this.wGame.removeEventListener("keyup", this.onKeyEvent);
        this.hide();
        super.reset();
    }

    private show() {
        if (this.visible || this.wGame.gui.fightManager.fightState != -1) return;

        const padding = 10;
        const { clientWidth, clientHeight } = this.wGame.document.body;
        for (const group of this.monsterGroups) {
            const tooltip = this.injectTooltip(this.getTooltipData(group));
            const scenePos = this.wGame.isoEngine.mapRenderer.getCellSceneCoordinate(group.disposition.cellId);
            const pixelPos = this.wGame.isoEngine.mapScene.convertSceneToCanvasCoordinate(scenePos.x, scenePos.y);

            pixelPos.x -= tooltip.clientWidth / 2;
            pixelPos.y -= tooltip.clientHeight + 40;

            if (pixelPos.x < padding) pixelPos.x = padding;
            if (pixelPos.y < padding) pixelPos.y = padding;

            const maxX = clientWidth - tooltip.clientWidth - padding;
            if (pixelPos.x > maxX) pixelPos.x = maxX;

            const maxY = clientHeight - tooltip.clientHeight - padding;
            if (pixelPos.y > maxY) pixelPos.y = maxY;

            tooltip.setAttribute("style", `left: ${pixelPos.x}px; top: ${pixelPos.y}px`);
        }

        this.visible = true;
    }

    private hide() {
        if (!this.visible) return;

        const tooltips = this.wGame.document.getElementsByClassName("lindo__TooltipBox");
        while (tooltips.length > 0) {
            tooltips[0].parentNode.removeChild(tooltips[0]);
        }

        this.visible = false;
    }

    private injectTooltip(data: TooltipData): HTMLElement {
        const target = this.wGame.document.getElementsByClassName("foreground")[0];
        const levelLabel = this.translate.instant("app.option.vip.monstertooltip.level");
        const groupLabel = this.translate.instant("app.option.vip.monstertooltip.group");

        // Stuff needs to be one lined, otherwise the game will display spaces and newlines
        let tooltip = `<div id="lindo__TooltipBox${data.id}" class="TooltipBox lindo__TooltipBox"><div class="content" style="position: relative"><div class="sceneTooltip monsterInfoTooltip"><div class="level">${levelLabel} ${data.groupLevel}</div><div class="StarCounter" style="width: 100% !important; min-width: 100px">`;

        let starIndex = 0;
        for (; starIndex < data.redStarsCount; starIndex += 1) {
            tooltip += `<div class="star level2"></div>`;
        }
        for (; starIndex < data.redStarsCount + data.yellowStarsCount; starIndex += 1) {
            tooltip += `<div class="star level1"></div>`;
        }
        for (; starIndex < 5; starIndex += 1) {
            tooltip += `<div class="star"></div>`;
        }

        if (data.bonusPackActive) {
            tooltip += `<div class="bonusContainer bonusPackActive"><div class="bonusContainerPlus">+</div><div class="bonusStar star1"></div><div class="bonusStar star2"></div><div class="bonusStar star3"></div><div class="linkToShop Button"></div></div>`;
        } else {
            tooltip += `<div class="bonusContainer"><div class="bonusContainerPlus">+</div><div class="bonusStar star1"></div><div class="bonusStar star2"></div><div class="bonusStar star3"></div><div class="linkToShop Button"></div></div>`;
        }

        tooltip += `</div><div class="xpPreview"><div>${this.formatNumber(data.soloXp)} XP</div>`;
        if (data.partyXp > -1) {
            tooltip += `<div>${this.formatNumber(data.partyXp)} XP (${groupLabel})</div>`;
        }
        tooltip += `</div>`;

        for (const monster of this.getReduceAndSortMonsters(data.monsters)) {
            if (monster.isBoss) {
                tooltip += `<div class="mtt-bossLine"> <div class="mtt-bossIcon"></div> ${monster.name} (${monster.level})</div>`
            } else {
                tooltip += `<div>${monster.name} (${monster.level}) ` + (monster.quantity > 1 ? `x${monster.quantity}` : '') + `</div>`;
            }
        }

        tooltip += `</div></div></div></div>`;
        target.insertAdjacentHTML("beforeend", tooltip);
        return this.wGame.document.getElementById(`lindo__TooltipBox${data.id}`);
    }

    private getReduceAndSortMonsters(monsters: any): Monster[] {
        const result: Monster[] = new Array();

        monsters.forEach(monster => {
            const m: Monster = {name: monster.staticInfos.nameId, level: monster.staticInfos.level, quantity: 1, isBoss: monster.staticInfos.isBoss};
            const monsterFind: Monster = result.find(r => r.name === m.name && r.level === m.level);

            if (monsterFind != null) monsterFind.quantity += 1;
            else result.push(m);
        });

        result.sort((a,b) => b.level - a.level);

        return result;
    }

    // FIXME Problems with formula 
    private getTooltipData(group: any): TooltipData {
        // General data
        const { partyData, characterBaseInformations } = this.wGame.gui.playerData;
        const allMonsters: any[] = [group.staticInfos.mainCreatureLightInfos, ...group.staticInfos.underlings];
        const starsCount = Math.min(Math.round(group.ageBonus / 20), 10);
        const redStarsCount = Math.max(starsCount - 5, 0);
        const yellowStarsCount = Math.min(starsCount, 5) - redStarsCount;
        const alternatives: Map<number, any> = new Map();
        let monsters: any[] = new Array();
        let playerCount: number = 1;
        // Party data
        let party, partyLevels, partyLevel, highestPartyLevel, partySizeExcludingLowLevels, partySizeModifier;
        let partyXp = -1;


        // Update party data if player has party
        if (Object.keys(partyData._partyFromId).length > 0) {
            party = partyData._partyFromId[Object.keys(partyData._partyFromId)[0]];
            partyLevels = [characterBaseInformations.level, ...Object.keys(party._members).map(id => party._members[id].level)];
            partyLevel = partyLevels.reduce((total, level) => total + level);
            highestPartyLevel = partyLevels.slice().sort((a, b) => a < b ? -1 : 1).pop();
            partySizeExcludingLowLevels = partyLevels.filter(level => level >= highestPartyLevel / 3).length;
            partySizeModifier = MonsterTooltip.partySizeModifier[partySizeExcludingLowLevels];
            playerCount = partyLevels.length;
        }

        // Get alternatives
        if (group.staticInfos.alternatives != null) {
            group.staticInfos.alternatives.forEach(alternative => alternatives.set(alternative.playerCount, alternative));

            const alternativesMonster: any[] = alternatives.get(MonsterTooltip.alternativeModifier[playerCount]).monsters;
            alternativesMonster.forEach(monster => {
                const tempMonster = allMonsters.find(m => m.creatureGenericId == monster.creatureGenericId);
                allMonsters.splice(allMonsters.indexOf(tempMonster), 1);
                monsters.push(tempMonster);
            });
        } else {
            monsters = allMonsters;
        }
        
        const groupLevel = monsters.reduce((level, monster) => level + monster.staticInfos.level, 0);
        const monstersXp = monsters.reduce((xp, monster) => xp + monster.staticInfos.xp, 0);
        const highestMonsterLevel = monsters.slice().sort((a, b) => a.staticInfos.level - b.staticInfos.level).pop();

        if (Object.keys(partyData._partyFromId).length > 0) {
            partyXp = this.calculateXp(
                monstersXp,
                characterBaseInformations.level,
                partyLevel,
                groupLevel,
                highestMonsterLevel,
                group.ageBonus,
                partySizeModifier,
            );
        }

        const soloXp = this.calculateXp(
            monstersXp,
            characterBaseInformations.level,
            characterBaseInformations.level,
            groupLevel,
            highestMonsterLevel,
            group.ageBonus,
        );

        const bonusPackActive = this.wGame.gui.playerData.identification.subscriptionEndDate > Date.now();
        return {
            id: group.contextualId,
            monsters,
            groupLevel,
            yellowStarsCount,
            redStarsCount,
            soloXp,
            partyXp,
            bonusPackActive,
        }
    }

    private calculateXp(
        monstersXp: number,
        playerLevel: number,
        partyLevel: number,
        groupLevel: number,
        highestMonsterLevel: number,
        ageBonus: number,
        partySizeModifier: number = 1,
    ): number {
        let modifier = 1;
        if (groupLevel > partyLevel + 10) {
            modifier = (partyLevel + 10) / groupLevel;
        }
        else if (partyLevel > groupLevel + 5) {
            modifier = groupLevel / partyLevel;
        }
        else if (partyLevel > highestMonsterLevel * 2.5) {
            modifier = Math.floor(highestMonsterLevel * 2.5) / partyLevel;
        }

        const { _base, _additionnal, _objectsAndMountBonus } = this.wGame.gui.playerData.characters.mainCharacter.characteristics.wisdom;
        const wisdom = _base + _additionnal + _objectsAndMountBonus;
        const wisdomModifier = 1 + wisdom / 100;
        const ageModifier = 1 + ageBonus / 100;
        const bonusModifier = 1 + this.wGame.gui.playerData.experienceFactor / 100;
        const contributionModifier = playerLevel / partyLevel;

        return Math.floor(
            bonusModifier * Math.floor(
                partySizeModifier * Math.round(
                    contributionModifier * Math.floor(
                        wisdomModifier * Math.floor(
                            ageModifier * Math.floor(
                                monstersXp * modifier,
                            ),
                        ),
                    ),
                ),
            ),
        );
    }

    private update() {
        if (!this.visible) return;

        this.hide();
        this.show();
    }

    private onKeyEvent(event: any) {
        if (event.key == this.params.monster_tooltip_shortcut) {
            if (event.type === "keydown") this.show();
            else if (event.type === "keyup") this.hide();
        }
    }

    private formatNumber(n: number): string {
        return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    private static partySizeModifier = {
        1: 1,
        2: 1.1,
        3: 1.5,
        4: 2.3,
        5: 3.1,
        6: 3.6,
        7: 4.2,
        8: 4.7,
    }

    private static alternativeModifier = {
        1: 1,
        2: 1,
        3: 1,
        4: 1,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
    }

}

export interface Monster {
    name: string;
    level: number;
    quantity: number;
    isBoss: boolean;
}