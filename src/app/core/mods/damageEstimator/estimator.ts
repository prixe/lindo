import { Logger } from "app/core/electron/logger.helper";

// Data from 'script.js' line 33013 (Build Version: 1.49.8)
enum EffectCategory {
    undefined = -1,
    miscellaneous = 0,
    resistance = 1,
    damage = 2,
    special = 3
}

const SpellColor = {
    96: '#668cff', // Dommages Eau
    91: '#668cff', // Vol de vie eau
    97: '#cc8800', // Dommages Terre
    92: '#cc8800', // Vol de vie terre
    98: '#00e68a', // Dommages Air
    93: '#00e68a', // Vol de vie air
    99: '#ff5c33', // Dommages Feu
    94: '#ff5c33', // Vol de vie feu
    108: '#cc0080' // Soins
};

export class Estimator {

    private fighter: any;
    private spell: any;
    private wGame: any;

    private estimatorContainer: HTMLDivElement;

    constructor(fighter: any, spell: any, wGame: any | Window) {
        this.fighter = fighter;
        this.wGame = wGame;
        this.spell = spell;

        this.createEstimator();
    }

    public update(spell: any) {
        this.spell = spell;

        const fighter = this.wGame.gui.fightManager.getFighter(this.fighter.id);

        if (this.wGame.isoEngine.mapRenderer.isFightMode) {

            if (fighter.data.alive) {
                if (!this.estimatorContainer) {
                    this.createEstimator();
                }

                let invisible = false;
                for (const idB in fighter.buffs) {
                    if (fighter.buffs[idB].effect.effectId == 150)
                        invisible = true;
                }

                const cellId = fighter.data.disposition.cellId;

                if (cellId && !invisible) {
                    const scenePos = this.wGame.isoEngine.mapRenderer.getCellSceneCoordinate(cellId);
                    const pos = this.wGame.isoEngine.mapScene.convertSceneToCanvasCoordinate(scenePos.x, scenePos.y);
                    this.estimatorContainer.style.left = (pos.x - 40) + 'px';
                    this.estimatorContainer.style.top = (pos.y - 80) + 'px';
                }
            }
        }
    }

    private createEstimator() {
        // retrieve data
        const cellId = this.fighter.data.disposition.cellId;
        const scenePos = this.wGame.isoEngine.mapRenderer.getCellSceneCoordinate(cellId);
        const pos = this.wGame.isoEngine.mapScene.convertSceneToCanvasCoordinate(scenePos.x, scenePos.y);

        // estimatorContainer
        if (this.wGame.document.getElementById('estimatorContainer' + this.fighter.id)) {
            this.estimatorContainer = this.wGame.document.getElementById('estimatorContainer' + this.fighter.id);
        } else {
            this.estimatorContainer = document.createElement('div');
            this.estimatorContainer.id = 'estimatorContainer' + this.fighter.id;
        }

        this.estimatorContainer.style.cssText = 'padding:3px; box-sizing: border-box; border: 1px gray solid; background-color: #222;color: white; position: absolute; border-radius: 3px; overflow: hidden; transition-duration: 500ms;';
        this.estimatorContainer.style.left = (pos.x - 40) + 'px';
        this.estimatorContainer.style.top = (pos.y - 80) + 'px';
        this.estimatorContainer.innerHTML = '';

        const estimations = this.spell.isItem ?
            this.getWeaponEstimations(this.spell, this.fighter) :
            this.getEstimations(this.spell, this.fighter);

        for (const [effectId, min, max, criticalMin, criticalMax] of estimations) {
            const damage = document.createElement('div');
            const p1 = document.createElement('span');
            p1.textContent = "(";
            p1.style.color = "white";
            const p2 = document.createElement('span');
            p2.textContent = ")";
            p2.style.color = "white";
            const criticalDamage = document.createElement('span');
            criticalDamage.textContent = `${criticalMin} - ${criticalMax}`;
            damage.textContent = `${min} - ${max} `;
            damage.style.color = SpellColor[effectId] || '';
            damage.appendChild(p1);
            damage.appendChild(criticalDamage);
            damage.appendChild(p2);
            this.estimatorContainer.appendChild(damage);
        }
        this.wGame.document.getElementById('damage-estimator').appendChild(this.estimatorContainer);
    }

    public destroy() {
        this.estimatorContainer.parentElement.removeChild(this.estimatorContainer);
    }

    //-------------------------------------------------------------------------------------------------

    private getWeaponEstimations(spell: any, fighter: any) {
        const estimations: [number, number, number, number, number][] = [];

        for (const key in spell.effectInstances) {
            const { effect, effectId, min, max } = spell.effectInstances[key];
            const criticalHitBonus = spell._item.item.criticalHitBonus;

            if (this.isValidEffectId(effectId) && effect.category == EffectCategory.damage) {
                estimations.push([
                    effectId,
                    Math.max(0, this.getSpellEstimation(effectId, fighter, min)),
                    Math.max(0, this.getSpellEstimation(effectId, fighter, max)),
                    Math.max(0, this.getSpellEstimation(effectId, fighter, min + criticalHitBonus, true)),
                    Math.max(0, this.getSpellEstimation(effectId, fighter, max + criticalHitBonus, true))
                ]);
            }
        }
        return estimations;
    }

    private getEstimations(spell: any, fighter: any) {
        const estimations: [number, number, number, number, number][] = [];

        for (let i = 0; i < spell.spellLevel.effects.length; i++) {
            const { effectId, diceNum, diceSide } = spell.spellLevel.effects[i];
            const criticalEffect = spell.spellLevel.criticalEffect[i];

            if (!this.isValidEffectId(effectId)) {
                continue;
            }
            estimations.push([
                effectId,
                Math.max(0, this.getSpellEstimation(effectId, fighter, diceNum)),
                Math.max(0, this.getSpellEstimation(effectId, fighter, diceSide)),
                Math.max(0, this.getSpellEstimation(effectId, fighter, criticalEffect.diceNum, true)),
                Math.max(0, this.getSpellEstimation(effectId, fighter, criticalEffect.diceSide, true))
            ]);
        }
        return estimations;
    }

    private getSpellEstimation(effectId: number, fighter: any, spellDice: number, isCritical = false) {
        switch (effectId) {
            case 96: // Dommages Eau
            case 91: // Vol de vie eau
                return this.computeSpellEstimation(
                    spellDice,
                    isCritical,
                    this.getCharacterBaseStat("chance"),
                    this.getCharacterStat("waterDamageBonus"),
                    this.getSpellDamageModifier(fighter),
                    fighter.data.stats.waterElementReduction,
                    fighter.data.stats.criticalDamageFixedResist,
                    this.getElementResistPercent(fighter, "waterElementResistPercent")
                );
            case 100: // Dommages Neutre
                return this.computeSpellEstimation(
                    spellDice,
                    isCritical,
                    this.getCharacterBaseStat("strength"),
                    this.getCharacterStat("neutralDamageBonus"),
                    this.getSpellDamageModifier(fighter),
                    fighter.data.stats.neutralElementReduction,
                    fighter.data.stats.criticalDamageFixedResist,
                    this.getElementResistPercent(fighter, "neutralElementResistPercent")
                );
            case 97: // Dommages Terre
            case 92: // Vol de vie terre
                return this.computeSpellEstimation(
                    spellDice,
                    isCritical,
                    this.getCharacterBaseStat("strength"),
                    this.getCharacterStat("earthDamageBonus"),
                    this.getSpellDamageModifier(fighter),
                    fighter.data.stats.earthElementReduction,
                    fighter.data.stats.criticalDamageFixedResist,
                    this.getElementResistPercent(fighter, "earthElementResistPercent")
                );
            case 98: // Dommages Air
            case 93: // Vol de vie air
                return this.computeSpellEstimation(
                    spellDice,
                    isCritical,
                    this.getCharacterBaseStat("agility"),
                    this.getCharacterStat("airDamageBonus"),
                    this.getSpellDamageModifier(fighter),
                    fighter.data.stats.airElementReduction,
                    fighter.data.stats.criticalDamageFixedResist,
                    this.getElementResistPercent(fighter, "airElementResistPercent")
                );
            case 99: // Dommages Feu
            case 94: // Vol de vie feu
                return this.computeSpellEstimation(
                    spellDice,
                    isCritical,
                    this.getCharacterBaseStat("intelligence"),
                    this.getCharacterStat("fireDamageBonus"),
                    this.getSpellDamageModifier(fighter),
                    fighter.data.stats.fireElementReduction,
                    fighter.data.stats.criticalDamageFixedResist,
                    this.getElementResistPercent(fighter, "fireElementResistPercent")
                );
            case 108: // Soins
                return Math.trunc(spellDice * (100 + this.getCharacterBaseStat('intelligence')) / 100 + this.getCharacterStat("healBonus"));
            case 101: // Retrait PA
            case 116: // Retrait PO
            default:
                Logger.info("effectId inconnu:" + effectId);
                return 0;
        }
    }

    private isValidEffectId(id: number) {
        return [96, 91, 100, 97, 92, 98, 93, 99, 94, 108].includes(id);
    }

    private getElementResistPercent(fighter: any, key: string) {
        return !fighter.isCreature && fighter.data.stats[key] > 50 ? 50 : fighter.data.stats[key];
    }

    /**
     *
     * Dégâts subis = (((Puissance + Caractéristique + 100) / 100) - Résistances fixes) * (100 - % Résistances) / 100
     */
    private computeSpellEstimation(
        baseSpellDamage: number,
        isCritical: boolean,
        baseStat: number,
        fixDamages: number,
        spellDamageModifier: [number, number, number],
        fixResistances: number,
        criticalDamageFixedResist: number,
        percentResistances: number
    ) {
        const [baseDamageModifier, fixedDamageModifier, damageMultiplicator] = spellDamageModifier;
        const power = this.getCharacterStat("damagesBonusPercent");
        let possibleDamages = (((power * 0.8) + baseStat + 100) / 100) * (baseSpellDamage + baseDamageModifier) + this.getCharacterStat('allDamagesBonus') + fixDamages;

        if (isCritical) {
            possibleDamages += this.getCharacterStat("criticalDamageBonus") - criticalDamageFixedResist;
        }
        return Math.trunc((possibleDamages - fixResistances + fixedDamageModifier) * damageMultiplicator * (100 - percentResistances) / 100);
    }

    private getCharacterBaseStat(key: string) {
        return Math.max(
            0,
            this.getCharacterStat(key)
        );
    }

    private getCharacterStat(key: string) {
        const characteristic = this.wGame.gui.playerData.characters.mainCharacter.characteristics[key];
        let sum = 0;

        if (typeof characteristic.getBasePts === 'function') {
            sum += characteristic.getBasePts();
        }
        if (typeof characteristic.getContextModif === 'function') {
            sum += characteristic.getContextModif();
        }
        if (typeof characteristic.getEquipmentPts === 'function') {
            sum += characteristic.getEquipmentPts();
        }
        if (typeof characteristic.getAlignGiftPts === 'function') {
            sum += characteristic.getAlignGiftPts();
        }
        return sum;
    }

    // TODO: Incomplete spell list
    private getSpellDamageModifier(fighter: any) {
        let fixedDamageModifier = 0;
        let damageMultiplicator = 1;
        let baseDamageModifier = 0;

        for (var buff of fighter.buffs) {
            if (buff.effect.effect.characteristic != 16) {
                continue;
            }
            const caster = this.wGame.gui.fightManager.getFighter(buff.source);
            // 444 = Dérobade
            if (buff.castingSpell.spell.id == 444) {
                damageMultiplicator = 0; // This will turn the formula to zero
                break;
            }
            switch (buff.castingSpell.spell.id) {
                case 159: // Colère de Iop
                case 146: // Epée du destin
                case 167: // Flèche d'Expiation
                case 171: // Flèche Punitive
                    baseDamageModifier += buff.effect.value;
                    break;
                case 7: // Bouclier Féca
                case 4696: // Glyphe Agressif
                case 4684: // Flèche Analgésique
                    damageMultiplicator *= buff.effect.diceNum / 100;
                    break;
                case 4: // Barricade
                    if (this.isFighterNextToMe(fighter)) {
                        fixedDamageModifier += buff.effect.diceNum;
                    }
                    break;
                case 20: // Bastion
                    if (!this.isFighterNextToMe(fighter)) {
                        fixedDamageModifier += buff.effect.diceNum;
                    }
                    break;
                case 4690: // Chance d'Ecaflip
                    damageMultiplicator *= buff.duration == 1 ? 1.5 : 0.5;
                    break;
                case 4698: // Rempart
                case 5: // Trêve
                case 127: // Mot de prévention
                    fixedDamageModifier += buff.effect.diceNum * (100 + 5 * caster.level) / 100;
                    break;
                default:
                    Logger.info(`Quel est ce buff: ${buff.effect.effectId} - ${buff.effect.description}`)
                    Logger.info("catégorie: " + buff.effect.effect.category);
                    break;
            }
        }
        return [baseDamageModifier, Math.trunc(fixedDamageModifier), Math.trunc(damageMultiplicator)] as [number, number, number];
    }

    // TODO: Might not work when controlling a summon
    private isFighterNextToMe(fighter: any) {
        const currentCellId = this.wGame.gui.fightManager.getFighter(this.wGame.gui.playerData.id).data.disposition.cellId;
        const fighterCellId = fighter.data.disposition.cellId;
        const fighterPos = this.wGame.isoEngine.mapRenderer.grid.getCoordinateGridFromCellId(fighterCellId);
        const currentPos = this.wGame.isoEngine.mapRenderer.grid.getCoordinateGridFromCellId(currentCellId);
        const neighbours = [
            [currentPos.i, currentPos.j + 1],
            [currentPos.i, currentPos.j - 1],
            [currentPos.i + 1, currentPos.j],
            [currentPos.i - 1, currentPos.j],
            [currentPos.i + 1, currentPos.j + 1],
            [currentPos.i - 1, currentPos.j - 1],
            [currentPos.i + 1, currentPos.j - 1],
            [currentPos.i - 1, currentPos.j + 1]
        ];
        for (const [x, y] of neighbours) {
            if (fighterPos.i == x && fighterPos.j == y) {
                return true;
            }
        }
        return false;
    }
}
