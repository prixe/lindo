export function neoGlassTheme(): string {
    let theme = neoGlass;

    themeVariable.forEach(v => {
      theme = theme.split(v.id).join(v.value);
    });

    return theme;
}

const themeVariable = [
  {id:'%primary%',      value:'rgb(255,255,255)'},
  {id:'%primary_a70%', value:'rgba(255,255,255,0.7)'},
  {id:'%primary_a50%', value:'rgba(255,255,255,0.5)'},
  {id:'%primary_a40%', value:'rgba(255,255,255,0.4)'},
  {id:'%primary_a30%', value:'rgba(255,255,255,0.3)'},
  {id:'%primary_a20%', value:'rgba(255,255,255,0.2)'},
  {id:'%primary_a15%', value:'rgba(255,255,255,0.15)'},

  {id:'%text_primary%',   value:'#3d3d3d'},
  {id:'%text_secondary%', value:'#5c5c5c'},
  {id:'%text_success%',   value:'#295c0c'},
  {id:'%text_danger%',    value:'#a91212'},
  {id:'%text_warning%',   value:'#0f557f'},

  {id:'%btn_color%', value:'filter: saturate(0.1) brightness(1.5);'},
  {id:'%blur%', value:'blur(5px)'},
];

const neoGlass = `
        /*  BlackStripe Color             *
        **********************************/
        .blackStripe {
          background: rgb(35 37 33);
        }

        /*******************************************************************
        *   Windows                                                        *
        *******************************************************************/

        /*  Window Title                  *
        **********************************/
        .windowHeadWrapper,
        .numberInputPad .titleBar {
            margin: 1px;
            padding: 4px 7px 0 7px;
            border-radius: 7px 7px 0 0;
            background: %primary_a40%;
            border-bottom: 1px solid %primary_a30%;
        }

        .windowTitle {
            color: %text_primary%;
            font-size: 20px;
        }
        .windowTitle::before {
            border-image: none;
            border: none;
        }

        /*  Window Container              *
        **********************************/
        .window .windowBorder,
        .numberInputPad:before,
        .chat .logWrapper:before {
            border-image : none;
            border : 1px solid %primary_a30%;
            border-radius : 7px;
            background-color : %primary_a15%;
            backdrop-filter: %blur%;
        }
        
        /*  Window content container      *
        **********************************/
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
        .window .AlmanaxTab .col2 .block:before,
        .ItemBox .infoContainer .topRightInfoContainer .itemInfoPanels::before,
        .CraftActorBox::before,
        .CraftResultBox::before,
        .EquipmentDrawer .characterBox::before,
        .mountBox,
        #dofusBody .MountDetails .panel::before,
        #dofusBody .MountDetails .mainContainer::before,
        .window.LevelUpWindow .info .pointBlock:before,
        .window.LevelUpWindow .info .spellBlock:before,
        .log.Scroller {
            border-image: none;
            border: 1px solid %primary_a20%;
            border-radius: 7px;
            background-color: %primary_a20%;
            margin: 4px 0 0 4px;
            width: calc(100% - 10px);
            box-shadow: 3px 3px 7px #0000004f;
        }

        /*  Window content container      *
        *   (without margin & width fix)  *
        **********************************/
        .ItemBox .infoContainer .topRightInfoContainer .itemInfoPanels::before,
        .CraftActorBox::before,
        .CraftResultBox::before,
        .EquipmentDrawer .characterBox::before,
        .mountBox,
        #dofusBody .MountDetails .panel::before,
        #dofusBody .MountDetails .mainContainer::before,
        .window.LevelUpWindow .info .pointBlock:before,
        .window.LevelUpWindow .info .spellBlock:before {
            margin: 0;
            width: 100%;
        }

        /*  Window content container      *
        *   in container  *
        **********************************/
        .window .AlignmentWindow .leftColumn .pvpBox .pvpContainer .Table::before,
        .window .AlignmentWindow .rightColumn .Table::before,
        .window .AlignmentWindow .rightColumn .Table::before,
        .placeholderFrame {
            border-image: none;
            border: 1px solid %primary_a30%;
            border-radius: 7px;
            background: none
        }


        /*******************************************************************
        *   Inputs                                                         *
        *******************************************************************/
        /* InputBox                       *
        **********************************/
        .InputBox,
        .NumberInputBox {
          border: 2px solid %primary_a30%;
          border-radius: 7px;
          background: %primary_a50%;
          color: %text_primary%;
        }
        .chat .inputChat_InputBox {
          opacity: 1;
        }

        /* Input Text                     *
        **********************************/
        #dofusBody .MountDetails .mountName {
          border: 1px solid %primary_a30%;
          color: #3d3d3d;
        }

        /* SearchBox                      *
        **********************************/
        .InputBox .domInputBox {
          border: none;
          color: #3d3d3d;
          padding-left: 4px;
        }
        .searchBox .inputFrame .cancelBtn {
          top: -2px;
        }
        .searchBox .inputFrame .cancelBtn .btnIcon {
          filter: invert(1);
        }
        .searchBox .searchBtn .btnIcon {
          %btn_color%
        }
        .searchBox .searchBtn {
          top: -8px;
          right: 14px;
        }

        /* CheckBox                       *
        **********************************/
        .CheckboxLabel {
          background-image: none;
          position: relative;
          color: %text_primary%;
        }
        .CheckboxLabel::after {
          content: " ";
          background: %primary_a30%;
          border: 1px solid %primary%;
          border-radius: 4px;
          position: absolute;
          height: 16px;
          width: 16px;
          left: 6px;
          top: 3px;
        }
        .CheckboxLabel.on {
          background-image: none;
        }
        .CheckboxLabel.on::after {
          background-color: green; /*TODO Add image*/
        }

        /* CheckBox Label                 *
        **********************************/
        .RecipeList .searchBar .CheckboxLabel {
          border: 1px solid %primary_a30%;
          border-radius: 4px;
          margin-right: 1px;
          background-image: none;
          background-color: %primary_a30%;
          color: %text_primary%;
        }
        .RecipeList .searchBar .CheckboxLabel.on {
          background-image: none;
          background-color: %primary%;
        }
        .RecipeList .searchBar .CheckboxLabel::after,
        .RecipeList .searchBar .CheckboxLabel.on::after {
          content: none !important;
        }

        /* Select                         *
        **********************************/
        .Selector .selectorContent {
          background-color: %primary_a30%;
          border-radius: 7px;
          border: 1px solid %primary_a50%;
          color: %text_primary%;
        }
        .dropDown .entryContainer .entryList {
          background-color: %primary_a50%;
          border: solid 1px %primary_a30%;
          overflow: hidden;
          border-width: 1px;
          border-radius: 7px 7px 7px 7px;
          color: %text_primary%;
          backdrop-filter: %blur%;
        }
        .selectorContent .buttonOpen {
          %btn_color%
        }

        /* Button                         *
        **********************************/
        .Button.button, .Button.greenButton, .Button.secondaryButton, .Button.specialButton {
          border: 1px solid %primary%;
          border-radius: 7px;
          color: #3d3d3d;
          background: rgb(255 255 255);
          padding: 5px 15px;
          height: auto !important;
        }
        /* Change color of button by white */
        .NotificationDialog .closeBtn,
        .resizeHandle,
        .arrowBtnBg,
        .closeButton,
        .plusButton,
        .conquestButton,
        .optionButton,
        .listItem .arrow,
        .upgradeButton,
        .buttonOpen,
        .add .Button,
        .mapLocationBtn,
        .List.tree li .arrow,
        .FriendsWindow .mainPanel .Table .container .row .col:nth-child(7) .Button,
        .rerollButton,
        #dofusBody .MountDetails .buttons,
        .ItemFilters .switchBtn,
        #dofusBody .MountDetails .rideButton,
        #dofusBody .MountDetails .renameBtn,
        .ShortcutBar.top.spell .spellBtn,
        .ShortcutBar.top .buttonBox .itemBtn,
        .ShortcutBar.top .buttonBox .lockBtn,
        .chat .chatCloseButton,
        .chat .historyButton,
        .chat .sendButton .btnIcon,
        .window.CraftersListWindow .Table .col:nth-child(7) .Button
         {
          %btn_color%
          /*
          filter: saturate(0.1) brightness(1.5);
          */
        }

        /* ProgressBar                    *
        **********************************/
        .ProgressBar {
          overflow: hidden;
          border: 2px solid %primary%;
          border-radius: 20px;
          height: 13px;
          width: calc(100% - 4px);
        }
        .ProgressBar .barBg {
          border: none;
          background: %primary_a50%;
        }
        .ProgressBar .barColor {
          border: none;
          background: skyblue;
        }
        .ProgressBar.red .barColor {
          border: none;
          background: red;
        }
        .ProgressBar.green .barColor {
          border: none;
          background: yellowgreen;
        }
        .ProgressBar.jobExpBar .barColor {
          border: none;
          background: yellow;
        }


        /*******************************************************************
        *   Table                                                          *
        *******************************************************************/
        .TableV2 .placeholderFrame {
          width: calc(100% - 4px);
        }

        /* Header                         *
        **********************************/
        .TableV2 .tableHeader {
            margin: 0 2px;
        }

        .TableV2 .tableHeader,
        .window .QuestsWindow .header::before,
        .Table .container.header,
        .window.characteristics tr td.tableTitle::before,
        .HelpWindow .helpBody .col1 .col1Header::before,
        .ItemBox .itemBox-title::before {
            border-image: none;
            border: 2px solid %primary_a30%;
            border-radius: 7px 7px 0 0;
            background-color: %primary_a50%;
            color: %text_primary%;
        }

        /* Column                         *
        **********************************/
        .TableV2 .row .col {
          border-right: solid 2px %primary_a30%;
        }
        .Table .container .row .col {
          border-right: solid 2px %primary_a30%;
          border-left: solid 2px %primary_a30%;
        }

        /* Row                            *
        **********************************/
        .Table .tableContent .row,
        .TableV2 .tableContent .row {
          background-color : transparent;
          color: %text_primary%;
        }

        /* Row Odd                        *
        **********************************/
        .window .QuestsWindow .sublist .label.odd,
        .Table .container.content .odd,
        .TableV2 .tableContent .row.odd,
        .window .AchievementsWindow .col1 .scroll .tree .listItem:nth-of-type(2n) > .label,
        .List li:nth-child(2n+1) > .label,
        .window.characteristics tr:nth-child(2n+1) td,
        .HelpWindow .helpBody .col1 .SingleSelectionList .listItem:nth-child(2n+1) > .label,
        .HelpWindow .helpBody .col1 .SingleSelectionList .listItem.selected > .sublist > .label:nth-child(2n+1),
        .window.OptionsWindow .wrapper .menuCol .menu .listItem.odd,
        .drillDownList .listItem.odd,
        .window .OrnamentsWindow .col1 .ListV2 .listItem.odd {
            background-color : %primary_a30%;
        }

        /* Row Selected                   *
        **********************************/
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
          color: %primary%;
        }

        .TableV2 .tableContent .row.selected:before,
        .ListV2 .listItem.selected:before,
        .window .AchievementsWindow .col1 .scroll .tree .listItem.selected>.label:before,
        .window .BestiaryWindow .col1 .SingleSelectionList .listItem.selected>.label:before,
        .window .BestiaryWindow .sublist .label.selected:before,
        .Table .container.content .row.highlight:before {
          content: " ";
          z-index: -1;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 2px solid;
          border-radius: 5px;
          box-sizing: border-box;
          background-color: #5c5c5c9c;
        }


        /*******************************************************************
        *   Scroller                                                       *
        *******************************************************************/
        .Scroller .scrollerContent {
          margin : 0;
        }
        .Scroller .scrollerContent {
          margin-right: 2px; /* Same result with 2px or 5px */
        }


        /*******************************************************************
        *   Tabs & Swipes                                                  *
        *******************************************************************/
        .tabs .tab:before,
        .tabs .tab.on:before,
        .SwipingTabs .swipeHeader .swipeTabBtn:before,
        .SwipingTabs .swipeHeader .swipeTabBtn.on:before {
            border: none;
            background-image: none !important;
        }
        .tabs .tab,
        .SwipingTabs .swipeHeader .swipeTabBtn {
            background-color: %primary_a40%;
            border-radius: 10px 10px 0 0;
            border: 1px solid %primary_a30%;
            border-bottom: none;
            color: #4a4a4a;
        }
        .tabs .tab.on,
        .SwipingTabs .swipeHeader .swipeTabBtn.on {
          background-color : %primary_a70%;
        }






        /* BlackBox */
        .window .AlmanaxWindow .col1 .dateBlock .dayBg,
        .generalTab .generalContent .introBlock .col2 .scoreBoxHeaderContentBlock,
        .generalTab .generalContent .introBlock .col2 .localisationBox {
            background-color : #00000087;
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


        /*******************************************************************
        *   Special Window/Component                                       *
        *******************************************************************/

        /* GameMenu down                  *
        **********************************/
        .MenuDrawer .drawerBackground {
          border: 1px solid %primary_a30%;
          background-color: %primary_a15%;
          backdrop-filter: %blur%;
        }
        .MenuDrawer.top .drawerContent .topBorder,
        .MenuDrawer.left .drawerContent .topBorder {
          display: none;
        }
        .MenuDrawer.MenuBar .iconBox {
          border-radius: 50%;
          background: none;
        }
        .ShortcutBar .Slot {
          background: none;
        }
        .ShortcutBar .Slot::after {
          content: " ";
          position: absolute;
          border: 2px solid %primary_a50%;
          border-radius: 7px;
          width: calc(100% - 6px);
          height: calc(100% - 6px);
          top: 1px;
          left: 1px;
        }

        /* Notifications                  *
        **********************************/
        .NotificationBar .container {
          background-color: %primary_a15%;
          backdrop-filter: %blur%;
          border: 1px solid %primary_a30%;
          border-bottom: none;
        }
        .NotificationBar .counter {
          background-color: %primary_a15%;
          backdrop-filter: %blur%;
          color: %text_primary%;
          border: 1px solid %primary_a30%;
          border-top: none;
        }
        .NotificationBar .container .notificationButton.opened {
          background-color: transparent;
        }
        .NotificationDialog {
          background: %primary_a15%;
          border: 1px solid %primary_a30%;
          backdrop-filter: %blur%;
          color: %text_secondary%;
        }

        /* Chat channels list             *
        **********************************/
        .chat .channelsLists .channelsList {
          background: %primary_a30%;
          backdrop-filter: %blur%;
          border: 1px solid %primary_a30%;
          border-radius: 4px;
        }

        /* Side tabs menu                 *
        **********************************/
        .WindowSideTabs {
          width: 48px;
          border-radius: 12px 0 0 12px;
          background-color: %primary_a15%;
          overflow: hidden;
          backdrop-filter: %blur%;
          border: 1px solid %primary_a30%;
          border-right: none;
          top: -2px;
        }
        .WindowSideTabs .tab {
            background-image : none;
            width : 52px;
        }
        .WindowSideTabs .tab.on {
            background-image : none;
            background : radial-gradient(circle at center, white 0%, rgba(255, 255, 255, 0.51) 24%, rgba(0, 0, 0, 0.01) 60%);
        }

        /* Npc Dialog                     *
        **********************************/
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


        /*******************************************************************
        *   Rules by window                                                *
        *******************************************************************/

        /* Menu Echap                     *
        **********************************/
        /* Fix space between button */
        .globalWindow .windowBody .Button.button {
          margin: 3px 0;
        }

        /* Characteristics                *
        **********************************/
        .window.characteristics .panels::before {
            margin: 0;
            width: 100%;
            border-radius: 0px 0 7px 7px;
        }
        .window.characteristics .panel {
          left: 0;
          width: 100%;
          color: %text_secondary%;
        }

        /* Breeding                       *
        **********************************/
        .BreedingWindow .mountBox {
          width: 162px;
          margin: 4px;
        }

        /* Friends                        *
        **********************************/
        /* Fix table width */
        .FriendsWindow .mainPanel .Table {
          margin: 0 7px 0 5px;
        }
        /* Fix cross btn height */
        .FriendsWindow .mainPanel .Table .container .row .col:nth-child(7) .Button {
          height: 30px !important;
        }

        /*TODO NumberInput pad*/
`;

// filter: saturate(0.1) brightness(1.5);