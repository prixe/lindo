export const neoDark = `
        /******************************************************************
        *   Game                                                           *
        *******************************************************************/

        /* Main container */
        .window .windowBorder {
            border-image : none;
            border : 2px solid transparent;
            border-radius : 7px;
            background-color : rgba(0,0,0,0.8);
            box-shadow : inset 0px 0px 20px -2px rgba(140,140,140,0.8);
        }

        /* Container */
        .window .OrnamentsWindow .col2::before,
        .window .OrnamentsWindow .col1::before,
        .window .QuestsWindow .col1::before,
        .window .QuestsWindow .col2::before,
        .window .AchievementsWindow .col1::before,
        .window .AlignmentWindow .leftColumn .pvpBox::before,
        .window .AlignmentWindow .rightColumn::before,
        .window .jobsWindow .jobsList::before,
        .window .jobsWindow .jobExpBlock::before,
        .window .jobsWindow .skillsBlock::before,
        .RecipeList::before,
        .FriendsWindow .mainPanel::before,
        .FellowPagesWindow .SwipingTabs .swipeTabContent::before,
        .window.characteristics .panels::before,
        .window.ArenaWindow .wrapper::before,
        .window.ArenaWindow .wrapper::before,
        .window.ToaWindow .panels .panel .contentBlock::before,
        .window.ToaWindow .panels .panel .unscrollableContentBlock::before,
        .HelpWindow .helpBody .col1::before,
        .HelpWindow .helpBody .col2::before,
        .window.OptionsWindow .wrapper .settingsCol::before,
        .window.OptionsWindow .wrapper .menuCol::before,
        .minMaxSelector::before,
        .ItemBox::before,
        .window.tradeItemWindow .windowBody .settingBox::before,
        .window.padLockWindow .container .keypadContainer::before,
        .window.padLockWindow .codeContainer::before,
        .window.BreedingWindow .rightCol .roomBoxes .roomBoxWrapper::before,
        .window.FightListWindow .colsWrapper .colTeam:before,
        .window.FightEndWindow .summaryBlock:before,
        .SpouseWindow .col1 .info:before,
        .SpouseWindow .col2:before,
        .GuildWindow .SwipingTabs .swipeTabContent:before,
        .GuildHousesWindow .Table:before,
        .GuildPerceptorsWindow .tableContainer:before,
        .AllianceTab .SwipingTabs .swipeTabContent:before,
        .window.JobOptionsWindow .container:before,
        .window.EstateForSellWindow .wrapper:before,
        .window.SocialGroupCreationWindow .swipeTabContent:before,
        .window .DailyQuestTab .mainProgressPart:before,
        .window .DailyQuestTab .dailyPart:before,
        .window .AlmanaxTab .col1 .dateBlock:before,
        .window .AlmanaxTab .col2 .block:before,
        .window .AlmanaxTab .col2 .block:before,
        .window .AlmanaxTab .col2 .block:before {
            border-image : none;
            border : 1px solid rgba(0,0,0,0.6);
            border-radius : 7px;
            background-color : rgba(0,0,0,0.4);
            box-shadow : inset 0px 0px 20px -2px rgba(140,140,140,0.8);
        }

        /* ContainerN3 */
        .window .AlignmentWindow .leftColumn .pvpBox .pvpContainer .Table::before,
        .window .AlignmentWindow .rightColumn .Table::before,
        .window .AlignmentWindow .rightColumn .Table::before,
        .placeholderFrame {
            border-image : none;
            border : 1px solid rgba(0,0,0,0.6);
            border-radius : 7px;
            background-color : rgba(0,0,0,0);
            box-shadow : inset 0px 0px 20px -2px rgba(140,140,140,0.8);
        }

        /* ContainerVariantLight */
        .ItemBox .infoContainer .topRightInfoContainer .itemInfoPanels::before,
        .CraftActorBox::before,
        .CraftResultBox::before,
        .EquipmentDrawer .characterBox::before,
        .mountBox,
        #dofusBody .MountDetails .panel::before,
        #dofusBody .MountDetails .mainContainer::before,
        .window.LevelUpWindow .info .pointBlock:before,
        .window.LevelUpWindow .info .spellBlock:before {
            border-image : none;
            border : 1px solid rgba(0,0,0,0.6);
            border-radius : 7px;
            background-color : rgba(60, 60, 60, 0.3);
            box-shadow : inset 0px 0px 20px -5px rgba(140,140,140,0.8);
        }

        /* Input */
        .InputBox,
        .NumberInputBox {
          opacity: 0.7;
        }
        .chat .inputChat_InputBox {
          opacity: 1;
        }
        .Selector .selectorContent {
          background-color: rgb(33 33 29 / 50%);
          border-radius: 7px;
        }

        /* Table */
        .TableV2 .tableHeader {
          margin: 0 2px;
        }
        .TableV2 .placeholderFrame {
          width: calc(100% - 4px);
        }
        .TableV2 .tableContent .row {
          background-color : rgba(0,0,0,0.15);
        }
        .TableV2 .tableContent .row.odd {
          background-color : rgba(0,0,0,0.35);
        }
        /* Select Table/List */
        .TableV2 .tableContent .row.selected,
        .ListV2 .listItem.selected,
        .window .OrnamentsWindow .col1 .ListV2 .listItem.selected,
        .window.OptionsWindow .wrapper .menuCol .menu .listItem.selected,
        .window .AchievementsWindow .col1 .scroll .tree .listItem.selected>.label,
        .window .BestiaryWindow .col1 .SingleSelectionList .listItem.selected>.label,
        .window .BestiaryWindow .sublist .label.selected,
        .Table .container.content .row.highlight {
          position: relative;
          border-image: none !important;
          webkit-border-image: none !important;
          background-color: transparent !important;
        }
        .TableV2 .tableContent .row.selected:before,
        .ListV2 .listItem.selected:before,
        .window .AchievementsWindow .col1 .scroll .tree .listItem.selected>.label:before,
        .window .BestiaryWindow .col1 .SingleSelectionList .listItem.selected>.label:before,
        .window .BestiaryWindow .sublist .label.selected:before,
        .Table .container.content .row.highlight:before {
          content: ' ';
          border-image: url(./assets/ui/table/tableHighlight.png) 20 20 20 20 fill / 10px 10px 10px 10px;
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          z-index: -1;
          opacity: 0.5;
        }

        /* Scroller */
        .Scroller .scrollerContent {
          margin : 0;
        }
        .Scroller .scrollerContent {
          margin-right: 2px; /* Same result with 2px or 5px */
        }

        /* Tabs & swipe */
        .tabs .tab,
        .SwipingTabs .swipeHeader .swipeTabBtn {
          background-color : #2d2d2d;
          border-radius : 10px 10px 0 0;
          border: 1px solid hsl(0 2% 15% / 1);
          border-bottom: none
        }
        .tabs .tab.on,
        .SwipingTabs .swipeHeader .swipeTabBtn.on {
          background-color : #8fcc3f;
        }

        /* GeneralHeader */
        .TableV2 .tableHeader,
        .window .QuestsWindow .header::before,
        .Table .container.header,
        .window.characteristics tr td.tableTitle::before,
        .HelpWindow .helpBody .col1 .col1Header::before,
        .ItemBox .itemBox-title::before {
            border-image : none;
            border : 2px solid #3c403b;
            border-radius : 10px 10px 0 0;
            background-color : #3c403bc4;
        }

        /* ListOdd */
        .window .QuestsWindow .sublist .label.odd,
        .TableV2 .tableContent .row.odd,
        .window .AchievementsWindow .col1 .scroll .tree .listItem:nth-of-type(2n) > .label,
        .List li:nth-child(2n+1) > .label,
        .window.characteristics tr:nth-child(2n+1) td,
        .HelpWindow .helpBody .col1 .SingleSelectionList .listItem:nth-child(2n+1) > .label,
        .HelpWindow .helpBody .col1 .SingleSelectionList .listItem.selected > .sublist > .label:nth-child(2n+1),
        .window.OptionsWindow .wrapper .menuCol .menu .listItem.odd,
        .drillDownList .listItem.odd,
        .window .OrnamentsWindow .col1 .ListV2 .listItem.odd {
            background-color : rgba(43, 44, 39, 0.5);
        }

        /* BlackBox */
        .window .AlmanaxWindow .col1 .dateBlock .dayBg,
        .generalTab .generalContent .introBlock .col2 .scoreBoxHeaderContentBlock,
        .generalTab .generalContent .introBlock .col2 .localisationBox {
            background-color : #00000087;
        }

        /* Dialog */
        .npcDialogUi .frame,
        .npcDialogUi .frame .closeBtn {
          border-image: none;
        }
        .npcDialogUi .frame:before {
          content: ' ';
          width: 100%;
          height: 100%;
          margin: auto;
          box-sizing: border-box;
          padding: 5px 5px 22px;
          text-align: center;
          border-image: url(./assets/ui/bubble/npc_reply_bg.png) 17 20 36 45 fill / 17px 20px 36px 45px;
          position: absolute;
          top: 0;
          left: 0;
          opacity: 0.8;
        }

        /* Menu down */
        .MenuDrawer .drawerBackground,
        .MenuDrawer.MenuBar .iconBox {
          opacity: 0.6;
        }
        .MenuDrawer .drawerContent .topBorder {
          opacity: 0;
        }
        .blackStripe {
          background: rgb(35 37 33);
        }
        .Slot.ItemSlot.ShortcutSlot {
          background: none;
        }
        .Slot.ItemSlot.ShortcutSlot:before {
          content: ' ';
          position: absolute;
          background: url(./assets/ui/slot.png) 50% 50% no-repeat;
          width: 50px;
          height: 50px;
          background-size: 100% 100%;
          -moz-box-sizing: border-box;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          z-index: -1;
          opacity: 0.6;
        }

        /* GrimoireIcon */
        .window.GrimoireWindow .windowBody .tab:nth-child(1)::before,
        .window.GrimoireWindow .windowBody .tab:nth-child(2)::before,
        .window.GrimoireWindow .windowBody .tab:nth-child(3)::before,
        .window.GrimoireWindow .windowBody .tab:nth-child(4)::before,
        .window.GrimoireWindow .windowBody .tab:nth-child(5)::before,
        .window.GrimoireWindow .windowBody .tab:nth-child(6)::before,
        .window.GrimoireWindow .windowBody .tab:nth-child(7)::before,
        .window.GrimoireWindow .windowBody .tab:nth-child(8)::before {
            background-position : 70% 50%;
        }

        /* AlmanaxWindow */
        .window .AlmanaxTab .col2 .questBlock .questContent .dolmanaxBg,
        .window .AlmanaxTab .col2 .saintBlock .saintBg {
            background-image : none;
            border : 1px solid #333333;
            border-radius : 25px;
            background-color : #00000057;
            box-shadow : inset #545454 0px -5px 10px;
        }

        /* DailyQuestWindow */
        .window .DailyQuestTab .dqList .slot {
          background-color: rgb(72 72 72 / 44%);
        }
        .window .DailyQuestTab .dailyHeader .rerollCounter .wrapper {
          background: rgb(72 72 72 / 44%);
        }

        /* SideTabs */
        .WindowSideTabs {
            width : 48px;
            border-radius : 12px 0 0 12px;
            background-color : rgba(0,0,0,0.8);
            overflow : hidden;
        }
        .WindowSideTabs .tab {
            background-image : none;
            width : 52px;
        }
        .WindowSideTabs .tab.on {
            background-image : none;
            background : radial-gradient(circle at center, white 0%, rgba(255, 255, 255, 0.51) 24%, rgba(0, 0, 0, 0.01) 60%);
        }

        /* SpellWindow */
        .window .SpellsWindow .col2 .panel .header .panelTop {
            background : none;
        }
        .window .SpellsWindow .col1::before {
            border-image : none;
            border : 2px solid rgba(0, 0, 0, 0.21);
            border-radius : 8px;
        }

        /* QuestWindow */
        .window .QuestsWindow .objectiveList .objectiveRow:nth-child(2n+1) {
            background-color : #0000004d;
        }
        .window .QuestsWindow .col1 .ListV2 .listItem.odd > .label {
            background-color : rgba(32, 33, 29, 0.7);
        }

        /* BestiaryWindow */
        .window .BestiaryWindow .col1::before {
            border-image : none;
            border : 2px solid black;
            border-radius : 8px;
        }
        .BestiaryWindow .monster .infos {
            border-image : none;
            background-color : #2b2b2b9c;
            border : 2px solid black;
            border-radius : 8px;
            box-shadow : inset 0px 0px 20px -2px rgba(140,140,140,0.8);
        }
        .window .BestiaryWindow .sublist .label {
            margin : 0 2px;
        }
        .window .BestiaryWindow .col1 .SingleSelectionList .listItem.selected > .sublist > .label:nth-child(2n+1) {
            background-color : rgba(30, 31, 28, 0.6);
        }
        .window .BestiaryWindow .col1 .SingleSelectionList .listItem:nth-child(2n+1) > .label {
            background-color : rgba(0, 0, 0, 0.46);
        }
        .BestiaryWindow .monster .more {
            background-color : #2d2c2a9c;
            box-shadow : inset 0px -2px 10px -2px rgba(140,140,140,0.8);
        }
        .BestiaryWindow .monster .stat {
            background-color :rgb(83 88 60 / 20%);
        }
        .BestiaryWindow .monster .stat:nth-child(2n+1) {
            background-color : rgba(32,32,27,0.4);
        }

        /* AchievementWindow */
        .window .AchievementsWindow .col2 .achievementsScroll .achievementsList .achievement .infos {
            background-color : rgba(62, 63, 57, 0.5);
        }
        .window .AchievementsWindow .col2 .achievementsScroll .achievementsList .achievement.completed .infos {
          background: none;
          position: relative;
        }
        .window .AchievementsWindow .col2 .achievementsScroll .achievementsList .achievement.completed .infos::before {
          content: ' ';
          width: 100%;
          height: 100%;
          position: absolute;
          opacity: 0.3;
          background: url(./assets/ui/diagonal_stripe.png) 0 0 repeat;
          top: 0;
          left: 0;
        }

        /* JobsWindow */
        .RecipeList .recipeTitle {
            background-color : rgba(125, 125, 98, 0.3);
        }
        .RecipeList .ingredientsList {
            box-shadow : inset 0px -1px 7px #ffffff42;
        }

        /* FriendsWindow */
        .Table .container.content .odd {
            background-color : rgb(63 66 57 / 41%);
        }

        /* FellowWindow */
        .Button.secondaryButton {
            background-color : #1d1d1d;
        }

        /* BidHouseWindow */
        .drillDownList {
            background-color : transparent;
        }

        /* BreedingWindow */
        .tileRoom .fg {
            background-color : transparent;
        }
        .window.BreedingWindow .focusedTile {
            background-color : rgba(125, 125, 125, 0.3);
        }

        /* StorageWindow */
        .StorageViewer .slotBox .slots .Slot,
        .StorageViewer .slotBox .slots {
          background-image: none;
        }
        .StorageViewer .slotBox .slots .Slot:before {
          content: ' ';
          position: absolute;
          background: url(./assets/ui/slot.png) 50% 50% no-repeat;
          background-size: 100% 100%;
          width: 40px;
          height: 40px;
          -moz-box-sizing: border-box;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          z-index: -1;
          opacity: 0.4;
        }
        .StorageViewer .slotBox .slots .cosmeticSlot {
          border-radius: 5px;
          box-shadow: inset 0px 0px 20px -3px #00d0ff;
        }

        /* MountBox Window */
        .window.BreedingWindow .neutralTile {
          background-color: rgb(29 30 26 / 0.6);
          box-shadow: inset 0px 0px 20px -5px rgba(140,140,140,0.8);
        }

        /* CraftMagusWindow */
        .window.CraftMagusWindow .craftingBoxContainer:before {
          opacity: 0.6;
        }

        /* TradeWindow */
        .window.tradeItemWindow .windowBody .minPrice .valueBox .title {
          background-color: #7171717d;
        }
        .window.tradeItemWindow .windowBody .minPrice .valueBox .value {
          background-color: #33333387;
        }

        /* windowTitle */
        .windowTitle:after {
            content: ' ';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: calc(100% - 3px);
            border-image : linear-gradient(to right, #00000000 0%, #78A739 35%, #78A739 50%, #78A739 65%, #00000000 100%) 1 !important;
            border-radius : 7px;
            border-bottom : 1px inset;
        }

        /* windowTitleBefore */
        .windowTitle::before {
            -webkit-border-image: none;
            border-image: none;
            border : 1px solid black;
            border-radius : 7px;
            background-color : #3a3a3a85;
            box-shadow : inset 0px 0px 10px 0px black;
        }

        /* FightEndWindow */
        .window.FightEndWindow .summaryBlock {
          height: 47px;
        }
        .window.FightEndWindow .TableV2 .row.title {
          background-color: rgb(97 107 87 / 65%);
        }

        /* GuildWindow */
        .socialInfoEditor {
          background-color: rgb(60 62 55 / 65%);
        }
        .socialInfoEditor .textDiv, .socialInfoEditor .editDiv {
          background-color: transparent;
          border: 1px solid #131313bf;
        }

        /* AllianceWindow */
        /* Fix alignement of conquest Table */
        .ConquestsTab .TableV2 .row .col.subArea {
          flex: 5;
        }
        .ConquestsTab .TableV2 .row .col.nextVulnerabilityDate {
          flex: 1.5;
        }

        /* MountFamilyTreeWindow */
        .window.FamilyTreeWindow .tree {
          background: none;
        }
        .window.FamilyTreeWindow .tree:before {
          content: ' ';
          background: url(./assets/ui/familyTree.png) 50% 50% no-repeat;
          background-size: 100% 100%;
          width: 97%;
          height: 95.6%;
          /* background: red; */
          position: absolute;
          opacity: 0.6;
        }


        /******************************************************************
        *   Fix bug                                                        *
        *******************************************************************/

        /* Fix background transparency for darkness windows */
        .FriendsWindow .mainPanel::before,
        .FellowPagesWindow .SwipingTabs .swipeTabContent::before,
        .window.BreedingWindow .rightCol .roomBoxes .roomBoxWrapper::before {
          background-color: rgba(0,0,0,0) !important;
        }

        /* Fix opacity */
        .FellowAlliancesWindow .filterBox.disabled .filterIcon, .FellowGuildsWindow .filterBox.disabled .filterIcon,
        .FellowAlliancesWindow .filterBox.disabled .searchBox, .FellowGuildsWindow .filterBox.disabled .searchBox {
            opacity : 1;
        }

        /* Disabled border */
        .mountBox,
        .window.CharacterOrientationWindow .characterBox:before {
          border: none;
        }

        /* Not applied selected style on child list */
        .window .AchievementsWindow .col1 .scroll .tree .listItem.selected:before,
        .window .BestiaryWindow .col1 .SingleSelectionList .listItem.selected:before,
        .listItem.monster.selected:before,
        .QuestsWindow .listItem.selected:before,
        .bidHouseCategories .listItem.selected:before {
          content: none;
        }

        /* Center item name in hdv */
        .ShopViewer .TableV2 .tableContent .col.name {
          display: flex;
          justify-content: start;
        }
`;