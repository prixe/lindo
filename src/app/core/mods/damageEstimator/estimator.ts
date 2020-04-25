import { Logger } from "app/core/electron/logger.helper";

interface IEstimation {
    element: string;
    max: number;
    min: number;
    isHeal: boolean;
}

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

        let fighter = this.wGame.gui.fightManager.getFighter(this.fighter.id);

        if (this.wGame.isoEngine.mapRenderer.isFightMode) {

            if (fighter.data.alive) {
                if (!this.estimatorContainer ) {
                    this.createEstimator();
                }

                let invisible = false;
                for (let idB in fighter.buffs) {
                    if (fighter.buffs[idB].effect.effectId == 150)
                        invisible = true;
                }

                let cellId = fighter.data.disposition.cellId;

                if (cellId && !invisible) {
                    let scenePos = this.wGame.isoEngine.mapRenderer.getCellSceneCoordinate(cellId);
                    let pos = this.wGame.isoEngine.mapScene.convertSceneToCanvasCoordinate(scenePos.x, scenePos.y);
                    this.estimatorContainer.style.left = (pos.x - 40) + 'px';
                    this.estimatorContainer.style.top = (pos.y - 80) + 'px';
                }
            }
        }
    }

    private createEstimator() {
        /* retrieve data */
        let cellId = this.fighter.data.disposition.cellId;
        let scenePos = this.wGame.isoEngine.mapRenderer.getCellSceneCoordinate(cellId);
        let pos = this.wGame.isoEngine.mapScene.convertSceneToCanvasCoordinate(scenePos.x, scenePos.y);

        /* estimatorContainer */
        if(this.wGame.document.getElementById('estimatorContainer' + this.fighter.id)){
            this.estimatorContainer = this.wGame.document.getElementById('estimatorContainer' + this.fighter.id);
        }else{
            this.estimatorContainer = document.createElement('div');
            this.estimatorContainer.id = 'estimatorContainer' + this.fighter.id;
        }

        this.estimatorContainer.style.cssText = 'padding:3px; box-sizing: border-box; border: 1px gray solid; background-color: #222;color: white; position: absolute; border-radius: 3px; overflow: hidden; transition-duration: 500ms;';
        this.estimatorContainer.style.left = (pos.x - 40) + 'px';
        this.estimatorContainer.style.top = (pos.y - 80) + 'px';
        this.estimatorContainer.innerHTML = '';

        let estimations = this.getEstimations(this.spell, this.fighter);

        estimations.forEach((estimation)=>{
            let displayDammage = document.createElement('div');
            displayDammage.innerHTML = `(${estimation.min} - ${estimation.max})`;


            switch(estimation.element){
                case 'water':
                    displayDammage.style.color = '#668cff';
                    break;
                case 'fire':
                    displayDammage.style.color = '#ff5c33';
                    break;
                case 'air':
                    displayDammage.style.color = '#00e68a';
                    break;
                case 'earth':
                    displayDammage.style.color = '#cc8800';
                    break;
                case 'heal':
                    displayDammage.style.color = '#cc0080';
                    break;
            }

            Logger.info(estimation.element);
            this.estimatorContainer.appendChild(displayDammage);
        });

        this.wGame.document.getElementById('damage-estimator').appendChild(this.estimatorContainer);
    }

    public destroy() {
        this.estimatorContainer.parentElement.removeChild(this.estimatorContainer);
    }

    //-------------------------------------------------------------------------------------------------

    //obtient les estimations de dégats
    private getEstimations(spell: any, fighter: any): IEstimation[] {
        let estimations : IEstimation[] = [];

        //pour chaque effet du sort
        for (var effectId in spell.spellLevel.effects) {
            let effect = spell.spellLevel.effects[effectId];

            //si effet direct
            if (effect._type == "EffectInstanceDice") {
                let element = this.effectIdToElement(effect.effectId);
                if (element != "undefined") {
                    let min = this.getMinDamageDealed(element, fighter, effect);
                    let max = this.getMaxDamageDealed(element, fighter, effect);
                    estimations.push({
                        element: element,
                        min: Math.max(0, min),
                        max: Math.max(0, max),
                        isHeal: false,
                    });
                }
            }
            else {
                Logger.info("Quel cet effet mystique ?" + effect._type);
                Logger.info(effect);
                Logger.info("De ce sort:");
                Logger.info(spell);
            }
        }

        return estimations;
    }

    /**
     * (info) Il s'agit d'un nombre qui, comme son nom l'indique, va être multiplié avec le jet. Il est composé d'une de vos caractéristique, selon l'élément de votre sort ou arme, ainsi que de votre puissance.
     *
     * Multiplicateur = (Puissance + Caractéristique+100)/100
     */
    private getFactor(element: string) {
        let carac = 0;
        switch (element) {
            case 'air':
                carac = this.getAgility();
                break;
            case 'fire':
                carac = this.getIntelligence();
                break;
            case 'earth':
            case 'neutral':
                carac = this.getStrength();
                break;
            case 'water':
                carac = this.getChance();
                break;

            default:
                break;
        }
        return (this.getPower() + carac + 100 ) / 100;
    }

    /**
     * Le fixe est un bonus qui s'ajoute aux dégâts indépendamment du jet. Cela vous permet d'assurer un minimum de dégâts à chaque attaque, même si le jet obtenu est faible.
     *
     * Fixe = Dommages + Dommages élémentaires (+ Dommages critiques si vous faites un Coup Critique)
     */
    private getFixDamages(element: string) {
        //TODO crit
        let elementalDamages = 0;
        switch (element) {
            case 'air':
                elementalDamages = this.getAirDamage();
                break;
            case 'fire':
                elementalDamages = this.getFireDamage();
                break;
            case 'earth':
                elementalDamages = this.getEarthDamage();
                break;
            case 'water':
                elementalDamages = this.getWaterDamage();
                break;
            case 'neutral':
                elementalDamages = this.getNeutralDamage();
                break;

            default:
                break;
        }
        return this.getFullCharaBonus(this.wGame.gui.playerData.characters.mainCharacter.characteristics.allDamagesBonus) + elementalDamages;
    }

    /**
     * Dégâts bruts = Partie entière[Multiplicateur x Jet + Fixe]
     *
     * effect: un des effets d'un sort
     */
    private getMinBrutDamages(element: string, effect: any) {
        //diceNume le jet minimum d'un sort
        return Math.trunc(this.getFactor(element) * effect.diceNum + this.getFixDamages(element));
    }

    private getMaxBrutDamages(element: string, effect: any) {
        //diceSide le jet maximum d'un sort
        return Math.trunc(this.getFactor(element) * effect.diceSide + this.getFixDamages(element));
    }

    private effectIdToElement(effectId: number) {
        switch (effectId) {
            case 96://dommages eau
            case 91://vol de vie eau
                return 'water';
            case 97://dommages terre
            case 92://vol de vie terre
                return 'earth';
            case 98://dommages air
            case 93://vol de vie air
                return 'air';
            case 99://dommages feu
            case 94://vol de vie feu
                return 'fire';
            case 100://dommages neutres
                return 'neutral';
            case 108://soins
                return 'heal';
            case 101: //retrait PA ??
            case 116: //perte PO
            default:
                Logger.info("effectId inconnu:" + effectId);
                return 'undefined';
        }
    }

    private getMaxDamageDealed(element: string, fighter: any, effect: any) {
        if (element != "heal")
            return Math.trunc((this.getMaxBrutDamages(element, effect) - this.getResFix(element, fighter)) * (100 - this.getPercentRes(element, fighter)) / 100);
        else
            return this.getMaxHeal(element, fighter, effect);
    }

    /**
     *
     * Dégâts subis = Partie entière([Dégâts bruts - ​Bonus fixes] * [100 - Résistance en %]/ 100)
     */
    private getMinDamageDealed(element: string, fighter: any, effect: any) {
        if (element != "heal")
            return Math.trunc((this.getMinBrutDamages(element, effect) - this.getResFix(element, fighter)) * (100 - this.getPercentRes(element, fighter)) / 100);
        else
            return this.getMinHeal(element, fighter, effect);
    }

    /**
     * Soins = Base * (100 + Intelligence ) / 100 + Soins
     */
    private getMaxHeal(element: string, fighter: any, effect: any){
        return Math.trunc(effect.diceSide * (100 + this.getIntelligence()) / 100 + this.getHealingBonus());
    }
    private getMinHeal(element: string, fighter: any, effect: any){
        return Math.trunc(effect.diceNum * (100 + this.getIntelligence()) / 100 + this.getHealingBonus());
    }

    private getHealingBonus(){
        let h = this.wGame.gui.playerData.characters.mainCharacter.characteristics.healBonus;
        return this.getFullCharaBonus(h);
    }

//retourne le montant total de la carac (bonus inclus)
    private getFullCharaBonus(characteristic: any) {
        let sum = 0;
        if (typeof characteristic.getBasePts() !== 'undefined') {
            sum += characteristic.getBasePts();
        }
        if (typeof characteristic.getContextModif() !== 'undefined') {
            sum += characteristic.getContextModif();
        }
        if (typeof characteristic.getEquipmentPts() !== 'undefined') {
            sum += characteristic.getEquipmentPts();
        }
        if (typeof characteristic.getAlignGiftPts() !== 'undefined') {
            sum += characteristic.getAlignGiftPts();
        }
        return sum;
    }

//puissance
    private getPower() {
        let d = this.wGame.gui.playerData.characters.mainCharacter.characteristics.damagesBonusPercent;
        //dafuq is that: permanentDamagePercent
        //let p = this.wGame.gui.playerData.characters.mainCharacter.characteristics.permanentDamagePercent;
        return this.getFullCharaBonus(d);// + this.getFullCharaBonus(p);
    }

// ---- éléments ----

    private getFullCharaBonusElement(characteristic:any){
        //si element < 0 alors = 0
        let total = this.getFullCharaBonus(characteristic);
        if (total < 0)
            total = 0;
        return total;
    }

    private getAgility() {
        let a = this.wGame.gui.playerData.characters.mainCharacter.characteristics.agility;
        return this.getFullCharaBonusElement(a);
    }

    private getChance() {
        let a = this.wGame.gui.playerData.characters.mainCharacter.characteristics.chance;
        return this.getFullCharaBonusElement(a);
    }

    private getIntelligence() {
        let a = this.wGame.gui.playerData.characters.mainCharacter.characteristics.intelligence;
        return this.getFullCharaBonusElement(a);
    }

    private getStrength() {
        let a = this.wGame.gui.playerData.characters.mainCharacter.characteristics.strength;
        return this.getFullCharaBonusElement(a);
    }

// ---- dommages élémentaires ---
    private getAirDamage() {
        let a = this.wGame.gui.playerData.characters.mainCharacter.characteristics.airDamageBonus;
        return this.getFullCharaBonus(a);
    }

    private getFireDamage() {
        let a = this.wGame.gui.playerData.characters.mainCharacter.characteristics.fireDamageBonus;
        return this.getFullCharaBonus(a);
    }

    private getEarthDamage() {
        let a = this.wGame.gui.playerData.characters.mainCharacter.characteristics.earthDamageBonus;
        return this.getFullCharaBonus(a);
    }

    private getWaterDamage() {
        let a = this.wGame.gui.playerData.characters.mainCharacter.characteristics.waterDamageBonus;
        return this.getFullCharaBonus(a);
    }

    private getNeutralDamage() {
        let a = this.wGame.gui.playerData.characters.mainCharacter.characteristics.neutralDamageBonus;
        return this.getFullCharaBonus(a);
    }

// --- resistances / faiblesses ---
    /**
     *
     * Bonus fixe = Résistance élémentaire fixe + Résistance fixe des sorts (+Résistance critique si le sort fait un coup critique)
     */
    private getResFix(element: string, fighter: any) {
        //TODO crit
        return this.getResFixElement(element, fighter) + this.getResFixSpell(element, fighter);
    }

//resistance élémentaire fixe
    private getResFixElement(element: string, fighter: any) {
        let stats = fighter.data.stats;
        let res = 0;
        switch (element) {
            case 'air':
                res = stats.airElementReduction;
                break;
            case 'fire':
                res = stats.fireElementReduction;
                break;
            case 'earth':
                res = stats.earthElementReduction;
                break;
            case 'water':
                res = stats.waterElementReduction;
                break;
            case 'neutral':
                res = stats.neutralElementReduction;
                break;

            default:
                break;
        }
        return res;
    }

//restance fixe des sorts (mot prev ...)
    private getResFixSpell(element: string, fighter: any) {
        let res = 0;

        for (var buff of fighter.buffs) {
            //si reduction de dégats
            let caster = this.wGame.gui.fightManager.getFighter(buff.source);
            let lvl = caster.level;
            if (buff.effect.effect.characteristic == 16) {
                switch (buff.castingSpell.spell.id){
                    case 1://armure incandescente
                        if(element = 'fire')
                            res += buff.effect.value * (100 + 5 * lvl) / 100;
                        break;
                    case 18://armure aqueuse
                        Logger.info("armure aqueuse: "+element);
                        if(element = 'water')
                            res += buff.effect.value * (100 + 5 * lvl) / 100;
                        break;
                    case 6:// armure terrestre
                        if(element = 'earth')
                            res += buff.effect.value * (100 + 5 * lvl) / 100;
                        break;
                    case 14:// armure venteuse
                        if(element = 'air')
                            res += buff.effect.value * (100 + 5 * lvl) / 100;
                        break;
                    case 5://trêve
                    case 127://mot de prévention
                        res += buff.effect.value * (100 + 5 * lvl) / 100;
                        break;
                    default:
                        Logger.info("Quel est ce buff: "+buff.effect.effectId+ " - "+buff.effect.description);
                        Logger.info("catégorie: "+buff.effect.effect.category);
                        break;
                }
                //res += buff.effect.value * (100 + 5 * lvl) / 100;
            }
        }
        return Math.trunc(res);
    }

//res en pourcents
    private getPercentRes(element: string, fighter: any) {
        let stats = fighter.data.stats;
        let res = 0;
        switch (element) {
            case 'air':
                res = stats.airElementResistPercent;
                break;
            case 'fire':
                res = stats.fireElementResistPercent;
                break;
            case 'earth':
                res = stats.earthElementResistPercent;
                break;
            case 'water':
                res = stats.waterElementResistPercent;
                break;
            case 'neutral':
                res = stats.neutralElementResistPercent;
                break;

            default:
                break;
        }
        //si c'est un joueur (pas une invoc ou créature) la res ne peux pas etre plus elevée que 50%
        if ((!fighter.isCreature) && res > 50)
            res = 50;
        return res;
    }
}
