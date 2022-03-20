export function neoGlassThemeWhite(): string {
    let theme = neoGlass;

    themeVariableWhite.forEach(v => {
      theme = theme.split(v.id).join(v.value);
    });

    return theme;
}
export function neoGlassThemeBlack(): string {
  let theme = neoGlass;

  themeVariableBlack.forEach(v => {
    theme = theme.split(v.id).join(v.value);
  });

  return theme;
}
const themeVariableBlack = [
  {id:'%primary%',      value:'rgb(0,0,0)'},
  {id:'%primary_a70%', value:'rgba(0,0,0,0.7)'},
  {id:'%primary_a50%', value:'rgba(0,0,0,0.5)'},
  {id:'%primary_a40%', value:'rgba(0,0,0,0.4)'},
  {id:'%primary_a30%', value:'rgba(0,0,0,0.3)'},
  {id:'%primary_a20%', value:'rgba(0,0,0,0.2)'},
  {id:'%primary_a15%', value:'rgba(0,0,0,0.4)'},

  {id:'%text_primary%',   value:'#ffffff'},
  {id:'%text_secondary%', value:'#c1c1c1'},

  {id:'%title_color%',    value:'#ffffff'},
  {id:'%link_color%',     value:'#9a077f'},
  {id:'%bonus_color%',    value:'#a8f928'},
  {id:'%malus_color%',    value:'#a51919'},
  {id:'%gold_color%',     value:'gold'},

  {id:'%btn_color%', value:''},
  {id:'%blur%', value:'blur(5px)'},
];

const themeVariableWhite = [
  {id:'%primary%',      value:'rgb(255,255,255)'},
  {id:'%primary_a70%', value:'rgba(255,255,255,0.7)'},
  {id:'%primary_a50%', value:'rgba(255,255,255,0.5)'},
  {id:'%primary_a40%', value:'rgba(255,255,255,0.4)'},
  {id:'%primary_a30%', value:'rgba(255,255,255,0.3)'},
  {id:'%primary_a20%', value:'rgba(255,255,255,0.2)'},
  {id:'%primary_a15%', value:'rgba(255,255,255,0.15)'},

  {id:'%text_primary%',   value:'#3d3d3d'},
  {id:'%text_secondary%', value:'#5c5c5c'},

  {id:'%title_color%',    value:'#3d3d3d'},
  {id:'%link_color%',     value:'#a7238f'},
  {id:'%bonus_color%',    value:'#486b11'},
  {id:'%malus_color%',    value:'#d01d1d'},
  {id:'%gold_color%',     value:'#b58109'},

  {id:'%btn_color%', value:'filter: saturate(0.1) brightness(1.5);'},
  {id:'%blur%', value:'blur(5px)'},
  {id:'%invert%', value:'invert(1)'},
];

const neoGlass = `
        .windowsContainer {
          background: grey;
        }
        /*******************************************************************
        *   Home Screen                                                    *
        *******************************************************************/

        /*  General window                *
        **********************************/
        /* Container */
        #dofusBody .loginScreen .frame.frame2,
        #dofusBody .loginScreen .frame.frame1,
        #dofusBody .loginScreen .rightColumn .formBtn,
        #dofusBody .loginScreen .rightColumn .formBtn2, #dofusBody .loginScreen .rightColumn .formBtn3 {
          border: 1px solid %primary%;
          border-radius: 7px;
          background: %primary_a30%;
          backdrop-filter: %blur%;
          color: %text_primary%;
          box-shadow: 3px 3px 7px #0000004f;
        }
        
        .RetractableBlock {
          margin-bottom: 10px;
        }

        #dofusBody .loginScreen .topButtons {
          background-color: %primary_a50%;
          border: 1px solid %primary%;
          border-width: 0 0 1px 1px;
        }

        
        /*  Login form                    *
        **********************************/
        /* Container */
        #dofusBody .loginScreen .frame.frame1,
        #dofusBody .loginScreen .rightColumn .formBtn,
        #dofusBody .loginScreen .rightColumn .formBtn2, #dofusBody .loginScreen .rightColumn .formBtn3 {
          border: 1px solid %primary%;
          border-radius: 7px;
          background: %primary_a50%;
          backdrop-filter: %blur%;
        }
        /* Text color */
        #dofusBody .loginScreen .LoginForm,
        #dofusBody .loginScreen .TokenForm .introText,
        #dofusBody .loginScreen .ForumBlock .content .forumNewsMargin .forumNews {
          color: %text_primary%;
        }
        #dofusBody .loginScreen .ForumBlock .content .forumNewsMargin .forumNews h2 {
          color: #b58109;
        }
        /* Login input */
        .InputBox .domInputBox.whiteStyle {
          border-image: none;
          color: %text_primary%;
        }
        /* Play button */
        #dofusBody .loginScreen .buttonPlay {
          color: %text_primary%;
        }
        /* Options buttons */
        #dofusBody .loginScreen .ConnectionOptions .bottomLinks .forgottenPassword,
        #dofusBody .loginScreen .ConnectionOptions .bottomLinks .connectionOptions {
          color: %text_secondary%;
        }
        /* Button Register & others */
        #dofusBody .loginScreen .rightColumn .formBtn,
        #dofusBody .loginScreen .rightColumn .formBtn2, #dofusBody .loginScreen .rightColumn .formBtn3 {
          padding: 5px;
        }
        #dofusBody .loginScreen .rightColumn .formBtn {
          bottom: -49px;
        }
        #dofusBody .loginScreen .rightColumn .formBtn2 {
          bottom: -95px;
        }


        /* News window                    *
        **********************************/
        /* Title and date */
        #dofusBody .loginScreen .NewsBlock .content .bannerTitle,
        #dofusBody .loginScreen .NewsBlock .content .date {
          color: %text_primary%;
        }
        #dofusBody .loginScreen .NewsBlock .dotsWrapper .dot.selected {
          %btn_color%
        }
        /* Carousel button */
        .Carousel .rightArrow, .Carousel .leftArrow {
          background-image: none;
          height: 76%;
          top: 0;
          width: 21px;
          margin: 0;
          padding: 0 10px 0 15px;
        }
        .Carousel .rightArrow:hover, .Carousel .leftArrow:hover {
          background: rgb(140 140 140 / 30%);
        }
        .Carousel .rightArrow:after, .Carousel .leftArrow:after {
          content: " ";
          position: absolute;
          top: calc(50% - 10px);
        }
        .Carousel .rightArrow:after,
        .Carousel .leftArrow:after,
        .Carousel .rightArrow:hover:after,
        .Carousel .leftArrow:hover:after {
          border-top: 20px solid transparent;
          border-bottom: 20px solid transparent;
        }
        .Carousel .rightArrow:after {
          border-left: 20px solid %primary_a50%;
        }
        .Carousel .leftArrow:after {
          border-right: 20px solid %primary_a50%;
        }
        .Carousel .rightArrow:hover:after {
          border-left: 20px solid %primary%;
        }
        .Carousel .leftArrow:hover:after {
          border-right: 20px solid %primary%;
        }


        /*  Changelog                     *
        **********************************/
        #dofusBody .loginScreen .RetractableBlock .content .titleBox .subTitle {
          color: %text_primary%;
        }
        /* Fix size of expand button */
        #dofusBody .loginScreen .RetractableBlock .content .titleBox .expandButton {
          min-height: 35px;
        }


        /*******************************************************************
        *   Game server                                                    *
        *******************************************************************/
        
        .window.ServerSelectionWindow .windowBody .arrowRight,
        .window.ServerSelectionWindow .windowBody .arrowLeft {
          %btn_color%
        }

        /*  Select server                 *
        **********************************/
        /* Container */
        .ServerDetails .content .top .details,
        .window.ServerListSelectionWindow .windowBody .middleDiv .leftFrame .serverList,
        .ServerDetails .content .bottom .bottomContent {
          background: %primary_a40%;
          border: 1px solid %primary%;
          border-radius: 7px;
        }
        /* Fix border radius for details server container */
        .window.ServerListSelectionWindow .windowBody .middleDiv .rightFrame .ServerDetails .content .bottom .bottomContent {
          border-radius: 0 7px 7px 7px;
        }
        /* Remove padding for server list container */
        .window.ServerListSelectionWindow .windowBody .middleDiv .leftFrame .serverList {
          padding: 0;
        }
        /* Tab details */
        .ServerDetails .content .bottom .descBtn.selected, .ServerDetails .content .bottom .rulesBtn.selected {
          background: %primary%;
        }
        .ServerDetails .content .bottom .descBtn, .ServerDetails .content .bottom .rulesBtn {
          border: 2px solid %primary%;
        }

        /* Server list table              *
        **********************************/
        .window.ServerListSelectionWindow .windowBody .middleDiv .leftFrame .serverList .div-table,
        .window.ServerListSelectionWindow .windowBody .middleDiv .leftFrame .serverList .listHead .listHeadBox {
          border: 1px solid %primary%;
        }
        .window.ServerListSelectionWindow .windowBody .middleDiv .leftFrame .serverList .listHead.odd {
          background: %primary_a70%;
        }
        .ServerRow .listBox {
          border-left: 1px solid %primary%;
          border-right: 1px solid %primary%;
        }
        .ServerRow.odd {
          background-color: %primary_a50%;
        }
        .ServerRow.selected {
          background-color: rgb(149 195 30 / 50%);
        }
        .window.ServerListSelectionWindow .windowBody .findFriendDiv .okBtn,
        .window.ServerListSelectionWindow .windowBody .findFriendDiv .clearBtn {
          %btn_color%
        }

        /* Select player                  *
        **********************************/
        .window.CharacterSelectionWindow .windowBody .leftColumn .characterTable:before {
          border: 1px solid %primary%;
          border-radius: 7px;
          background: %primary_a30%;
        }



        /*******************************************************************
        *   General                                                        *
        *******************************************************************/

        /*  BlackStripe Color             *
        **********************************/
        .blackStripe {
          background: rgb(35 37 33);
        }


        /*  Text Color                    *
        **********************************/
        .windowBody,
        .infoText {
          color: %text_primary%;
        }
        .link,
        #dofusBody a {
          color: %link_color% !important;
        }
        .title {
          color: %title_color% !important;
        }
        .malus {
          color: %malus_color% !important;
        }
        .bonus {
          color: %bonus_color% !important;
        }



        /*******************************************************************
        *   Contextual Menu                                                *
        *******************************************************************/

        /*  Header                        *
        **********************************/
        .ContextualMenu .contextHeader {
          border: 1px solid %primary_a70%;
          border-radius: 7px 7px 0 0;
        }
        .ContextualMenu .contextHeader:before {
          border: none;
        }


        /*  Title                         *
        **********************************/
        .ContextualMenu .title:before {
          background: none;
          border: none;
        }
        .ContextualMenu .title {
            background: %primary_a70%;
            border: 1px solid %primary%;
            margin-left: -1px;
            width: calc(100% + 4px);
            box-sizing: border-box;
        }


        /*  Content                       *
        **********************************/
        .ContextualMenu .contextHeader,
        .ContextualMenu .contextContent .contentScroller {
          border-color: %primary_a70%;
          background-color: %primary_a70%;
          color: %text_primary%;
          backdrop-filter: %blur%;
        }
        

        /*  Separator                     *
        **********************************/
        .ContextualMenu .separator,
        .ContextualMenu .group {
          border-bottom: 1px solid %primary% !important;
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
        .log.Scroller,
        .PerceptorBoostPanel .leftPanel .perceptorCharacteristicsTable:before,
        .window.characUpdateWindow .containerBlock:before,
        .window.PartyInviteDetailsWindow .container:before {
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
        .window.LevelUpWindow .info .spellBlock:before,
        .window .DailyQuestTab .mainProgressPart:before,
        .window .DailyQuestTab .dailyPart:before,
        .window.characteristics .panels::before,
        .HelpWindow .helpBody .col1::before,
        .window.ToaWindow .panels .panel .contentBlock::before,
        .window.ToaWindow .panels .panel .unscrollableContentBlock::before,
        .window.FightEndWindow .summaryBlock:before,
        .window.PartyInviteDetailsWindow .container:before {
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
          color: %text_primary%;
        }


        /* SearchBox                      *
        **********************************/
        .InputBox .domInputBox {
          border: none;
          color: %text_primary%;
          padding-left: 4px;
        }
        .searchBox .inputFrame .cancelBtn {
          top: -2px;
        }
        .searchBox .inputFrame .cancelBtn .btnIcon {
          filter: %invert%;
        }
        .searchBox .searchBtn .btnIcon {
          %btn_color%
        }
        .searchBox .searchBtn {
          top: -8px;
          right: 14px;
        }
        /* Fix size */
        .subFiltersBox .searchBox .inputFrame .InputBox {
          width: auto;
        }


        /* Filter tag                     *
        **********************************/
        .filterTagButton .btnBackground {
          background: white;
        }


        /* CheckBox                       *
        **********************************/
        .CheckboxLabel,
        .AchievementsWindow .objective {
          background-image: none;
          position: relative;
          color: %text_primary%;
        }
        .CheckboxLabel::before,
        .AchievementsWindow .objective::before {
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
        /* Fix checkbox position in filter */
        .filterCheckboxes .CheckboxLabel.on::before {
          left: 2px;
          top: 2px;
        }
        .CheckboxLabel.on,
        .AchievementsWindow .objective.completed {
          background-image: none;
        }
        /* Add check icon */
        .CheckboxLabel.on::after,
        .AchievementsWindow .objective.completed::after {
          content: " ";
          background: url(./assets/ui/tick_large.png) 0 0 no-repeat;
          background-position: 2px -2px;
          background-size: 18px 18px;
          position: absolute;
          height: 20px;
          width: 20px;
          left: 6px;
          top: 3px;
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
          color: %text_primary%;
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
          box-shadow: none;
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
        .Button.button,
        .Button.greenButton,
        .Button.secondaryButton,
        .Button.specialButton,
        .ItemBox .actionContainer .actionButton,
        .fightBtn.Button {
          border: 1px solid %primary%;
          border-radius: 7px;
          color: %text_primary%;
          background: %primary_a50%;
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
        .window.CraftersListWindow .Table .col:nth-child(7) .Button,
        .window .QuestsWindow .locateButton, .window .QuestsWindow .followedQuestButton,
        .ItemBox .actionContainer .destroyButton,
        .ItemBox .actionContainer .recipeButton,
        .ItemBox .infoContainer .topLeftInfoContainer .itemContainer .itemImage .recipeButton,
        .window.BidHouseShopWindow .backButton,
        .drillDownList .breadcrumb .btnIcon,
        #dofusBody .MountDetails .tinyBtn,
        .GuildMembers .TableV2 .buttons .rowButton.rights,
        .GuildMembers .TableV2 .buttons .rowButton.deletion,
        .GuildMemberRightsWindow .upperPanel .container .setXpButton,
        .minMaxSelector .confirmBtn,
        .minMaxSelector .closeBtn,
        .minMaxSelector .arrow,
        .PaginationUI .arrow.next,
        .PaginationUI .arrow.previous,
        .window.padLockWindow .container .leftPanel .resetButton .resetButtonIcon,
        .window.characUpdateWindow .minusButton
        {
          %btn_color%
        }


        /* ProgressBar                    *
        **********************************/
        .ProgressBar,
        .ProgressBarMultiple {
          overflow: hidden;
          border: 2px solid %primary%;
          border-radius: 20px;
          height: 13px;
          width: calc(100% - 4px);
        }
        .ProgressBar .barBg,
        .ProgressBarMultiple .barBg {
          border: none;
          background: %primary_a50%;
        }
        .ProgressBar .barColor
        .ProgressBarMultiple .barColor {
          border: none;
          background: #00b5ff;
        }
        .ProgressBar.blue .barColor,
        .ProgressBarMultiple .extraXp,
        .ProgressBarMultiple .oldXp,
        .ProgressBarMultiple .gainXp {
          background: #00b5ff;
        }
        .ProgressBar.red .barColor {
          background: red;
        }
        .ProgressBar.green .barColor {
          background: #28c700;
        }
        .ProgressBar.jobExpBar .barColor {
          background: #ffb100;
        }
        .ProgressBar.light-orange .barColor {
          background: #ffb13b;
        }
        .ProgressBar.pink .barColor {
          background: #f7507e;
        }
        .ProgressBar.aqua .barColor {
          background: #48d6c3;
        }
        .ProgressBar.purple .barColor {
          background: #d66dfc;
        }
        .ProgressBar.orange .barColor {
          background: #ff821f;
        }
        .ProgressBar.yellow .barColor {
          background: #feed02;
        }
        .ProgressBar.blue .barColor,
        .ProgressBar.red .barColor,
        .ProgressBar.green .barColor,
        .ProgressBar.jobExpBar .barColor,
        .ProgressBar.light-orange .barColor,
        .ProgressBar.pink .barColor,
        .ProgressBar.aqua .barColor,
        .ProgressBar.purple .barColor,
        .ProgressBar.orange .barColor,
        .ProgressBar.yellow .barColor,
        .ProgressBarMultiple .oldXp {
          border: none;
          background-image: linear-gradient(to bottom, rgb(255 255 255 / 30%), rgb(0 0 0 / 10%));
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
        .TableV2 .tableContent .row,
        .ListV2 .listItem,
        .sublist .label .text {
          background-color : transparent;
          color: %text_primary% !important;
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
        .window .OrnamentsWindow .col1 .ListV2 .listItem.odd,
        .window .QuestsWindow .col1 .ListV2 .listItem.odd > .label,
        .window .BestiaryWindow .col1 .SingleSelectionList .listItem.selected > .sublist > .label:nth-child(2n+1),
        .window .BestiaryWindow .col1 .SingleSelectionList .listItem:nth-child(2n+1) > .label,
        .window.FightEndWindow .TableV2 .row.title,
        .compositionTab .unscrollableContentBlock .compositionContent .col1 .SingleSelectionList .listItem.selected>.sublist>.label:nth-child(odd) {
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
        .Table .container.content .row.highlight,
        .window .BestiaryWindow .sublist .label.selected,
        .HelpWindow .helpBody .col1 .sublist .label.selected,
        .compositionTab .unscrollableContentBlock .compositionContent .col1 .sublist .label.selected,
        .compositionTab .unscrollableContentBlock .compositionContent .col1 .SingleSelectionList .listItem.selected>.label {
          position: relative;
          border-image: none !important;
          webkit-border-image: none !important;
          background-color: transparent !important;
          color: white !important;
          text-shadow: none;
        }

        .TableV2 .tableContent .row.selected:before,
        .ListV2 .listItem.selected > .label::before,
        .window .AchievementsWindow .col1 .scroll .tree .listItem.selected>.label:before,
        .window .BestiaryWindow .col1 .SingleSelectionList .listItem.selected>.label:before,
        .window .BestiaryWindow .sublist .label.selected:before,
        .Table .container.content .row.highlight:before,
        .window .QuestsWindow .sublist .label.selected::before,
        .window.OptionsWindow .wrapper .menuCol .menu .listItem.selected::before,
        .HelpWindow .helpBody .col1 .sublist .label.selected::before,
        .compositionTab .unscrollableContentBlock .compositionContent .col1 .sublist .label.selected:before,
        .compositionTab .unscrollableContentBlock .compositionContent .col1 .SingleSelectionList .listItem.selected>.label:before {
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


        /* Fix list problems              *
        **********************************/
        .ListV2.tree .listItem .label {
          position: relative;
        }
        /* Fix color when sublist item is selected */
        .window .QuestsWindow .sublist .label.selected .text,
        .window .BestiaryWindow .sublist .label.selected .text {
          color: %primary% !important;
        }
        /* Fix background style when selected */
        .window .QuestsWindow .sublist .label.selected,
        .HelpWindow .helpBody .col1 .SingleSelectionList .listItem.selected>.label,
        .HelpWindow .helpBody .col1 .sublist .label.selected {
          border-image: none;
          text-shadow: none;
          background-color: transparent;
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
            color: %text_primary%;
        }
        .tabs .tab.on,
        .SwipingTabs .swipeHeader .swipeTabBtn.on {
          background-color : %primary_a70%;
          color: %text_secondary%;
        }


        /*******************************************************************
        *   Items slot                                                     *
        *******************************************************************/
        .window .QuestsWindow .rewardSlot,
        .window .jobsWindow .skillsBlock .skillsList .label .skillRight .Slot,
        .window .jobsWindow .job .Slot,
        .RecipeList .ingredientsList .ItemSlot,
        .RecipeList .recipeTitle .ItemSlot,
        .window .AchievementsWindow .col2 .achievementsScroll .achievementsList .achievement .Slot,
        .BestiaryWindow .monster .Slot,
        .StorageViewer .slotBox .slots,
        .StorageViewer .slotBox .slots .ItemSlot,
        .ToaWindow .rewardsDisplay .Slot,
        .PresetsBox .setSlotsBox .Slot,
        .window.FightEndWindow .TableV2 .row .col .dropRow .ItemSlot,
        .window.padLockWindow .codeContainer .codeDigitContainer,
        .TradeSpace .slotBox .slots,
        .numberInputPad .displayContainer .digitBox {
          background: none;
        }
        .window .QuestsWindow .rewardSlot::before,
        .window .jobsWindow .skillsBlock .skillsList .label .skillRight .Slot::before,
        .window .jobsWindow .job .Slot::before,
        .RecipeList .ingredientsList .ItemSlot::before,
        .RecipeList .recipeTitle .ItemSlot::before,
        .window .AchievementsWindow .col2 .achievementsScroll .achievementsList .achievement .Slot::before,
        .BestiaryWindow .monster .Slot::before,
        .StorageViewer .slotBox .slots .ItemSlot::before,
        .ItemBox .infoContainer .topLeftInfoContainer .itemContainer .itemImage:before,
        .ToaWindow .rewardsDisplay .Slot::before,
        .PresetsBox .setSlotsBox .Slot::before,
        .window.FightEndWindow .TableV2 .row .col .dropRow .ItemSlot::before,
        .window.padLockWindow .codeContainer .codeDigitContainer::before,
        .TradeSpace .slotBox .slots .Slot::before,
        .numberInputPad .displayContainer .digitBox::before {
          content: " ";
          z-index: -1;
          position: absolute;
          top: 1px;
          left: 0;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          border: 2px solid %primary_a40%;
          border-radius: 7px;
          background-color: %primary_a30%;
        }



        /*******************************************************************
        *   Items Box                                                      *
        *******************************************************************/

        /* Container                      *
        **********************************/
        .window.FeedWindow .itemBox .ItemBox::before,
        .EquipmentDrawer .drawerContent .ItemBox::before,
        .ItemBox::before {
          margin: 2px 2px;
          width: calc(100% - 4px);
          height: calc(100% - 4px);
        }

        
        /* Informations Tabs              *
        **********************************/
        .ItemBox .infoContainer .topRightInfoContainer .tabs {
          margin-top: 2px;
        }

        
        /* Informations container         *
        **********************************/
        .ItemBox .infoContainer .topRightInfoContainer .itemInfoPanels {
          margin-left: 6px;
          width: calc(100% - 6px);
        }
        .ItemBox .infoContainer .topRightInfoContainer .itemInfoPanels::before {
          border-radius: 0 0 7px 7px;
        }


        /* Descriptions container         *
        **********************************/
        .ItemBox .itemDescriptionContainer .scrollerContent .category {
          color: %text_primary%;
        }
        .ItemBox .itemDescriptionContainer .scrollerContent .description {
          color: %text_secondary%;
        }


        .window.FeedWindow .quantityBox {
          margin-top: 10px;
        }
        


        /*******************************************************************
        *   Status indicator                                               *
        *******************************************************************/

        .FriendsWindow .mainPanel .Table .container .row .col:nth-child(1) .onlineStatusIcon,
        .GuildMembers .TableV2 .tableContent .row .col:nth-child(1) .onlineStatusIcon,
        .chat .statusButton,
        .ContextualMenuUserStatus li.available::after,
        .ContextualMenuUserStatus li.away::after,
        .ContextualMenuUserStatus li.private::after,
        .ContextualMenuUserStatus li.solo::after,
        .pmomStatus {
          border-radius: 50%;
          background-image: linear-gradient(to bottom, rgb(255 255 255 / 30%), rgb(0 0 0 / 10%)) !important;
        }

        .FriendsWindow .mainPanel .Table .container .row .col:nth-child(1) .onlineStatusIcon.status10,
        .GuildMembers .TableV2 .tableContent .row .col:nth-child(1) .onlineStatusIcon.status10,
        .chat .statusButton.available,
        .ContextualMenuUserStatus li.available::after,
        .pmomOnMap {
          background: green;
        }
        .FriendsWindow .mainPanel .Table .container .row .col:nth-child(1) .onlineStatusIcon.status21,
        .GuildMembers .TableV2 .tableContent .row .col:nth-child(1) .onlineStatusIcon.status21,
        .chat .statusButton.away,
        .ContextualMenuUserStatus li.away::after {
          background: #cacaca;
        }
        .FriendsWindow .mainPanel .Table .container .row .col:nth-child(1) .onlineStatusIcon.status30,
        .GuildMembers .TableV2 .tableContent .row .col:nth-child(1) .onlineStatusIcon.status30,
        .chat .statusButton.private,
        .ContextualMenuUserStatus li.private::after,
        .pmomNotInMap {
          background: #d00000;
        }
        .FriendsWindow .mainPanel .Table .container .row .col:nth-child(1) .onlineStatusIcon.status40,
        .GuildMembers .TableV2 .tableContent .row .col:nth-child(1) .onlineStatusIcon.status40,
        .chat .statusButton.solo,
        .ContextualMenuUserStatus li.solo::after {
          background: #f78900;
        }



        /*******************************************************************
        *   Scroller                                                       *
        *******************************************************************/
        .Scroller.scrollBgVisible .iScrollVerticalScrollbar, .Scroller.scrollBgVisible .iScrollHorizontalScrollbar {
          background-color: %primary_a50%;
        }
        .Scroller .iScrollIndicator {
          background-color: %text_primary%;
        }
        


        /*******************************************************************
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

        /* Fix color link for chat */
        .message .link {
          color: gold !important;
        }

        /* Fix Dialog title color */
        #dofusBody .speechBubble .title {
          color: white !important;
        }

        /* Fix link color on login screen */
        #dofusBody .loginScreen .footer .link {
          color: white !important;
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


        /* TooltipBox                     *
        **********************************/
        .TooltipBox {
          background: %primary_a70%;
          color: %text_primary%;
          backdrop-filter: %blur%;
        }
        .ItemDescription .description {
          color: %text_secondary%;
        }


        /* Grip Handler                   *
        **********************************/
        .Timeline .infoAndFighters,
        .Party {
          box-sizing: border-box;
          background: %primary_a50%;
          border: 1px solid %primary%;
          backdrop-filter: %blur%;
          color: %text_primary%;
        }

        /* Fighting timeLine */
        div#chronometerContainer {
          color: %text_primary% !important;
        }
        .window.FightEndWindow .TableV2 {
          margin-top: 3px;
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
          background: %primary_a50%;
          backdrop-filter: %blur%;
          border: 1px solid %primary_a50%;
          border-radius: 4px;
          text-shadow: none;
        }
        /* Status icon */
        .chat .statusButton {
          min-height: 16px;
          height: 16px;
          width: 16px;
          min-width: 16px;
          margin: 10px 9px;
        }


        /* Contextual menu user           *
        *  Status Icon                    *
        **********************************/
        .ContextualMenuUserStatus li {
          background: none !important;
          position: relative;
        }
        .ContextualMenuUserStatus li.available::after,
        .ContextualMenuUserStatus li.away::after,
        .ContextualMenuUserStatus li.private::after,
        .ContextualMenuUserStatus li.solo::after {
          content: " ";
          position: absolute;
          top: 11px;
          left: 6px;
          width: 14px;
          height: 14px;
        }


        /*  Contextual Menu Monster       *
        **********************************/
        .ContextualMenuMonster {
          background: none;
        }
        .ContextualMenuMonster .monsterInfosContainer .xp {
          color: %text_secondary%;
        }
        .ContextualMenuMonster .contextContent .contentScroller .monstersList {
          color: %text_primary%;
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


        /* Confirm trade                  *
        **********************************/
        .window.TradeItemConfirmWindow .leftCol .itemContainer .itemImg:before {
          border: 2px solid %primary_a40%;
          border-radius: 7px;
          background-color: %primary_a20%;
        }


        /* House code                     *
        **********************************/
        .window.padLockWindow .codeContainer .codeDigitContainer.highlight {
          border: 3px solid %primary%;
          border-radius: 7px;
          width: calc(100% - 6px);
          height: calc(100% - 6px);
          background: none;
        }


        /* Trade / Exchange               *
        **********************************/
        .TradeSpace .slotBox,
        .TradeGold .kamaContent {
          background: %primary_a30%;
          border: 1px solid %primary_a30%;
        }
        .TradeGold .kamaContent .kamaInput input {
          height: 100%;
        }


        /* Number Input Pad               *
        **********************************/
        .numberInputPad .titleBar .title {
          font-weight: bold;
          background: none;
          border: none;
          margin-top: -3px;
        }
        .numberInputPad .displayContainer .digitBox {
          color: %text_primary%;
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
        /* Fix text visible with button transparency */
        .window.globalWindow .selectorContent.Button {
          color: transparent;
        }


        /* Options                        *
        **********************************/
        .window.OptionsWindow .wrapper .settingsCol .settings .optionSection .header {
          color: %text_primary%;
        }


        /* Characteristics                *
        **********************************/
        .window.characteristics .panels::before {
          border-radius: 0px 0 7px 7px;
        }
        .window.characteristics .panel {
          left: 0;
          width: 100%;
        }
        /* Alignment box */
        .window.characteristics .logoWrapper {
          background-color: %primary_a30%;
        }
        /* Player name */
        .window.characteristics .playerName {
          color: %title_color%;
        }

        /* Characteristics Update         *
        **********************************/
        .characUpdateWindow .container.content {
          overflow: hidden;
          margin: 0;
        }
        .characUpdateWindow .Table {
          width: calc(100% - 2px);
        }


        /* Mount                          *
        **********************************/
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
          position: absolute;
          opacity: 0.35;
        }
        /* Fix container display */
        #dofusBody .MountDetails .panel::before {
          border-radius: 0 0 7px 7px;
          box-shadow: none;
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
        /* Fix Container size */
        .FriendsWindow .mainPanel::before {
          margin: 0;
          border-radius: 0 7px 7px 7px;
          width: 100%;
          box-shadow: none;
        }
        .Table .container.content .row.offline {
          color: %text_primary%;
        }
        .FriendsWindow .mainPanel .Table .container .row.offline .col:nth-child(2) {
          color: %text_secondary%;
        }
        


        /* Almanax                        *
        **********************************/
        /* Change background of almanax quest images */
        .window .AlmanaxTab .col2 .questBlock .questContent .dolmanaxBg,
        .window .AlmanaxTab .col2 .saintBlock .saintBg {
          background-image: none;
          border: 1px solid %primary_a30%;
          border-radius: 25px;
          background-color: %primary_a30%;
          box-shadow: inset %primary% 0px -5px 10px;
        }
        /* Date block */
        .window .AlmanaxTab .col1 .dateBlock .dayBg {
          background: %primary_a40%;
          border: 1px solid %primary%;
          color: %text_secondary%;
        }
        .window .AlmanaxTab .col2 .questBlock .questContent .progression .questProgressTitle {
          color: %title_color% !important;
        }

        /* Daily Quest                    *
        **********************************/
        /* Separate the two content container */
        .window .DailyQuestTab .dailyPart:before {
          margin-top: 5px;
        }
        /* Quest informations */
        .window .DailyQuestTab .dqList .slot,
        .window .DailyQuestTab .dailyHeader .rerollCounter .wrapper {
          background-color: %primary_a40%;
          border: 1px solid %primary_a50%;
          box-sizing: border-box;
          color: %text_primary%;
        }


        /* Grimoire Icon                  *
        **********************************/
        .window.GrimoireWindow .windowBody .tab:nth-child(1)::before,
        .window.GrimoireWindow .windowBody .tab:nth-child(2)::before,
        .window.GrimoireWindow .windowBody .tab:nth-child(3)::before,
        .window.GrimoireWindow .windowBody .tab:nth-child(4)::before,
        .window.GrimoireWindow .windowBody .tab:nth-child(5)::before,
        .window.GrimoireWindow .windowBody .tab:nth-child(6)::before,
        .window.GrimoireWindow .windowBody .tab:nth-child(7)::before,
        .window.GrimoireWindow .windowBody .tab:nth-child(8)::before {
            background-position : 30% 50%;
        }


        /* Spells                         *
        **********************************/
        /* SpellWindow */
        .window .SpellsWindow .col2 .panel .header .panelTop {
          background : none;
        }
        .window .SpellsWindow .col1::before {
          border-image : none;
          border : 2px solid %primary_a30%;
          border-radius : 8px;
        }
        /* Tab right */
        .window .SpellsWindow .col2 .panel {
          border: 2px solid %primary_a30%;
          border-radius: 0 7px 7px;
          background-color: %primary_a20%;
          margin: 0;
          padding: 10px 5px 5px;
          box-sizing: border-box;
          color: %text_primary%;
        }
        /* Spell title */
        .window .SpellsWindow .col2 .panel .header .panelTop {
          background: %primary_a70%;
          border: 1px solid %primary%;
          border-left: none;
          box-sizing: border-box;
          color: %text_primary%;
        }
        /* Add button */
        .window .SpellsWindow .col1 .TableV2 .row .col:nth-child(4) .button {
          height: 35px !important;
        }
        /* Text */
        .EffectDescription .effectTitle,
        .window .SpellsWindow .col2 .panel .header .panelTop .minPlayerLevel {
          color: %text_secondary%;
        }
        .SpellDescription .description,
        .window .SpellsWindow .col1 {
          color: %text_primary%;
        }


        /* Quests                         *
        **********************************/
        .window .QuestsWindow .objectiveList .objectiveRow:nth-child(odd) {
          background-color: %primary_a30%;
        }
        /* Hidde item default items slots */
        .window .QuestsWindow .rewardList {
          background: none;
        }
        .window .QuestsWindow .rewardSlot {
          margin-right: 2px;
        }


        /* Alignment                      *
        **********************************/
        .window .AlignmentWindow .leftColumn .topRow .CharacterDisplay {
          border-color: %primary_a70%;
        }


        /* Jobs                           *
        **********************************/
        /* Craft recipe title */
        .RecipeList .recipeTitle {
          background-color: %primary_a40%;
        }
        /* Color text recipe skill */
        .RecipeList .recipeTitle .recipeLeft .recipeSkillName {
          color: %text_secondary%;
        }
        /* Craft recipe ingredient list */
        .RecipeList .ingredientsList {
          border: 2px solid %primary_a50%;
          box-sizing: border-box;
        }
        /* Bonus xp text */
        .window .jobsWindow .bonusXP {
          font-weight: bold;
          color: %color_link%;
        }
        /* HightLight selected job */
        .Slot.selected .slotIconBorder:after {
          border: 3px solid %primary%;
          border-radius: 7px;
          width: calc(100% - 6px);
          height: calc(100% - 6px);
          background: none;
        }


        /* Achivements                    *
        **********************************/
        /* Change icon color */
        .window .AchievementsWindow .col1 .scroll .tree .listItem .icon {
          filter: brightness(0) invert(1) drop-shadow(1px 2px 0px grey);
        }
        /* Achievement details */
        .window .AchievementsWindow .col2 .achievementsScroll .achievementsList .achievement .infos {
            background-color : %primary_a30%;
            color: %text_secondary%;
        }
        .window .AchievementsWindow .col2 .achievementsScroll .achievementsList .achievement .more .rewards {
          color: %text_primary%;
        }
        .AchievementsWindow .achievement .points {
          background: %primary_a40%;
          box-sizing: border-box;
          border: 1px solid %primary_a40%;
          border-radius: 7px;
          color: %text_primary%;
        }
        /* Achievement details completed */
        .window .AchievementsWindow .col2 .achievementsScroll .achievementsList .achievement.completed .infos {
          background: %primary_a50%;
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
          filter: grayscale(1) brightness(1.7);
        }
        .AchievementsWindow .objective.completed {
          color: %text_secondary%;
        }
        .AchievementsWindow .objective .text {
          margin-left: 5px;
        }


        /* Bestiary                       *
        **********************************/
        .window .BestiaryWindow .col1::before {
          content: none;
        }
        .window .BestiaryWindow .col1 .SingleSelectionList::before {
          content: " ";
          border: 2px solid %primary_a40%;
          border-top: none;
          border-radius: 0 0 5px 5px;
          position: absolute;
          height: 100%;
          width: 100%;
          box-sizing: border-box;
        }
        /* Monsters details */
        .BestiaryWindow .monster .infos,
        .compositionTab .unscrollableContentBlock .compositionContent .col2 .monster .infos {
          background-color: %primary_a30%;
          border-color: %primary_a30%;
        }
        .window .BestiaryWindow .sublist .label {
          margin : 0 2px;
        }
        .listItem.monster.selected .infos {
          color: %text_primary%;
          border-color: %primary%;
        }
        /* MiniBoss icon */
        .BestiaryWindow .monster .name.miniBoss,
        .BestiaryWindow .monster .name.boss,
        .BestiaryWindow .monster .name.questMonster {
          background: none;
          position: relative;
        }
        .BestiaryWindow .monster .name.miniBoss::after {
          content: " ";
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          position: absolute;
          filter: drop-shadow(1px 2px 3px grey);
          background: url(./assets/ui/icons/miniBoss.png) 0 50% no-repeat;
        }
        .BestiaryWindow .monster .name.boss::after {
          content: " ";
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          position: absolute;
          filter: drop-shadow(1px 2px 3px grey);
          background: url(./assets/ui/icons/boss.png) 0 50% no-repeat;
        }
        .BestiaryWindow .monster .name.questMonster::after {
          content: " ";
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          position: absolute;
          filter: drop-shadow(1px 2px 3px grey);
          background: url(./assets/ui/icons/questMonster.png) 0 50% no-repeat;
        }
        /* Details more */
        .BestiaryWindow .monster .more,
        .compositionTab .unscrollableContentBlock .compositionContent .col2 .monster .more {
          background-color: %primary_a30%;
          border-color: %primary_a30%;
          border-top: none;
          color: %text_primary%;
        }
        /* Monster stats */
        .BestiaryWindow .monster .stat,
        .compositionTab .unscrollableContentBlock .compositionContent .col2 .monster .stat {
          background: none;
        }
        .BestiaryWindow .monster .stat:nth-child(2n+1),
        .compositionTab .unscrollableContentBlock .compositionContent .col2 .monster .stat:nth-child(2n+1) {
          background-color: %primary_a30%;
        }
        /* Items drop slots */
        .BestiaryWindow .monster .Slot.rareDrop,
        .BestiaryWindow .monster .Slot.okDrop,
        .BestiaryWindow .monster .Slot.special {
          border: none;
          background: none;
        }
        .BestiaryWindow .monster .Slot.rareDrop::before {
          border-color: gold;
        }
        .BestiaryWindow .monster .Slot.okDrop::before {
          border-color: %text_primary%;
        }


        /* Map                            *
        **********************************/
        .window.WorldMapWindow .buttonBox {
          background-color: %primary_a70%;
        }


        /* Guild                          *
        **********************************/
        /* Members rights window */
        .GuildMemberRightsWindow .upperPanel:before {
          border: 1px solid %primary%;
          border-radius: 7px;
          background: %primary_a30%;
        }
        /* Fix button height */
        .GuildMemberRightsWindow .upperPanel .container .setXpButton {
          height: 20px !important;
        }
        /* Fix content container */
        .GuildWindow .SwipingTabs .swipeTabContent:before {
          margin: 0;
          width: 100%;
          box-shadow: none;
          border-radius: 0 0 7px 7px;
        }
        .GuildHousesWindow .Table:before,
        .GuildPerceptorsWindow .tableContainer:before {
          margin: 0;
          width: 100%;
          border-radius: 0;
        }
        /* Social message */
        .socialInfoEditor {
          background-color: %primary_a30%;
          color: %text_primary%;
          box-shadow: 3px 3px 7px #0000004f;
        }
        .placeholderFrame {
          border-color: %primary%;
        }
        .placeholderFrame .placeholderText {
          color: %text_primary%;
        }
        /* Perceptor fix */
        .PerceptorBoostPanel .leftPanel .perceptorCharacteristicsTable:before {
          box-shadow: none;
        }
        .PerceptorBoostPanel .leftPanel .characterImage {
          border-color: %primary_a70%;
        }


        /* Help window                    *
        **********************************/
        .HelpWindow .helpBody h1,
        .HelpWindow .helpBody h2,
        .HelpWindow .helpBody h3,
        .HelpWindow .helpBody h4,
        .HelpWindow .helpBody h5,
        .HelpWindow .helpBody h6 {
          color: %title_color%;
        }
        .HelpWindow .helpBody strong {
          color: %text_primary% !important;
        }
        /* Fix content size */
        .HelpWindow .helpBody .col2::before {
          margin: 0;
          width: 100%;
          box-shadow: none;
        }


        /* Ascension                      *
        **********************************/
        /* List composition */
        .compositionTab .unscrollableContentBlock .compositionContent .col1:before {
          border: none;
        }
        .window.ToaWindow .panels .panel .contentBlock::before,
        .window.ToaWindow .panels .panel .unscrollableContentBlock::before {
          border-radius: 0 7px 7px 7px;
          box-shadow: none;
        }
        .window.ToaWindow h1,
        .window.ToaWindow h2,
        .window.ToaWindow h3,
        .window.ToaWindow h4,
        .window.ToaWindow h5,
        .window.ToaWindow h6 {
          color: %title_color%;
        }
        .window.ToaWindow .panels .panel .contentBlock .separator,
        .compositionTab .unscrollableContentBlock .compositionContent .col2 .separator {
          background: %primary%;
        }
        /* Info block */
        .generalTab .generalContent .introBlock .col2 .scoreBoxHeaderContentBlock,
        .generalTab .generalContent .introBlock .col2 .localisationBox,
        .compositionTab .unscrollableContentBlock .compositionContent .col2 .statBlock .scoreBlock .scoreBoxHeaderContentBlock,
        .compositionTab .unscrollableContentBlock .compositionContent .col2 .statBlock .scoreBlock .floorScoreBoxHeaderContentBlock {
          background: %primary_a40%;
          border: 1px solid %primary%;
          color: %text_secondary%;
          border-radius: 7px;
        }


        /* BidHouse Shop                  *
        **********************************/
        .drillDownList {
          background: %primary_a30%;
          border-color: %primary_a30%;
        }
        .drillDownList .subitemList .subitem,
        .bidHouseCategories .listItem.selected .text {
          color: %text_primary%;
        }
        .drillDownList .breadcrumb,
        .drillDownList .subitemList .subitem.selected {
          border-color: %primary%;
        }
        .BidHouseBuyerBox .row .col .icon .quantity {
          color: white;
        }
        .window.TradeItemConfirmWindow .leftCol .itemContainer .itemQuantity {
          text-shadow: none;
        }
        /* Sell window */
        .window.tradeItemWindow .windowBody .minPrice .valueBox .title,
        .window.tradeItemWindow .windowBody .minPrice .valueBox .value {
          border-color: %primary%;
          background: %primary_a30%;
        }
        .window.tradeItemWindow .windowBody .minPrice .valueBox:first-child .title,
        .window.tradeItemWindow .windowBody .minPrice .valueBox:first-child .value {
          border-left: 1px solid %primary%;
        }
        /* Currency */
        .wallet .currency .text {
          border: 1px solid %primary_a30%;
          border-radius: 0 13px 13px 0;
          background: %primary_a30%;
          color: %text_primary%;
        }
        /* Fix Button */
        .window.BidHouseShopWindow .sellModeBtn,
        .window.BidHouseShopWindow .buyModeBtn {
          height: 30px;
        }
        .window.BidHouseShopWindow .sellModeBtn .btnIcon,
        .window.BidHouseShopWindow .buyModeBtn .btnIcon {
          top: -7px;
          left: -7px;
        }
        .window.tradeItemWindow .windowBody .buyHardSoftButtons {
          max-height: 39px;
          min-height: 30px;
        }
        .window.TradeItemConfirmWindow .rightCol .btnAndFee .buyBtn .btnLabel {
          color: %text_primary%;
        }


        /* Inventory                      *
        **********************************/
        .PresetsBox .setItemSlotsBox:before {
          border: 1px solid %primary_a40%;
          border-radius: 7px;
          background: %primary_a30%;
          box-shadow: 3px 3px 7px #0000004f;
        }
        /* HightLight cosmetic Item */
        .StorageViewer .slotBox .slots .cosmeticSlot {
          position: relative;
        }
        .StorageViewer .slotBox .slots .cosmeticSlot::after {
          border: 2px solid #23bdbd;
          border-radius: 7px;
          content: " ";
          position: absolute;
          top: 0;
          left: 0;
          height: calc(100% - 4px);
          width: calc(100% - 4px);
        }
        /* Categories buttons */
        .ItemFilters .filters .content {
          border: none;
        }
        .ItemFilters .filters .filter {
          background-image: none;
          position: relative;
        }
        .ItemFilters .filters .filter::before {
          content: " ";
          position: absolute;
          width: 37px;
          height: 100%;
          display: inline-block;
          background-size: 100% 100%;
          margin: 0 1px;
          background-image: url(./assets/ui/inventory/tabOff.png);
          filter: invert(1);
          z-index: -1;
          top: 0;
          left: 0;
        }


        /* FightEnd                       *
        **********************************/
        /* Color gain xp */
        .window.FightEndWindow .xpBox .gainedXpText {
          color: #167da8;
        }
        /* Color bonus pack xp disabled */
        .window.FightEndWindow .xpBox .extraXpDiv .ifBonusPack {
          color: %text_secondary%;
        }
        .StarCounter .starContainer, .StarCounter .bonusContainer {
          background: %primary_a30%;
          border: 1px solid %primary%;
        }


        /* CraftMagus                     *
        **********************************/
        /* Fix Space between button */
        .CraftMagusWindow .Button {
          margin-bottom: 4px;
        }
        .window.CraftMagusWindow .craftingBoxContainer:before {
          border: 1px solid %primary_a40%;
          border-radius: 7px;
          background: %primary_a30%;
        }


        /* Market                         *
        **********************************/
        .box .priceButtonsBox .priceButtons .priceButton {
          width: 100%;
          height: 100% !important;
        }
        .MarketWindow .title,
        .MarketWindow p,
        .MarketWindow li,
        .MarketWindow .details,
        .MarketWindow .weight,
        .MarketWindow .text,
        .MarketWindow .placeholder.row {
          color: white !important;
        }


        /* Group invitation details       *
        **********************************/
        .window.PartyInviteDetailsWindow .container .character .background {
          background: %primary_a50%;
        }
        .window.PartyInviteDetailsWindow .container .character .background.guestFrame {
          border: 2px solid %primary%;
        }
        .window.PartyInviteDetailsWindow .container .character .name {
          color: %text_primary%;
          font-weight: bold;
        }

        
        /* Group Handler                  *
        **********************************/
        div#party-info-container {
          background: %primary_a50% !important;
          box-shadow: none !important;
          border: 1px solid %primary_a50%;
          color: %text_primary% !important;
        }
        .Party .partyBoxes .partyBox .member {
          background: %primary_a30%;
          border-color: %primary%;
        }
        .Party .partyBoxes .partyBox .member .CharacterDisplay {
          background: %primary_a70%;
        }
        .Party .partyBoxes .partyBox .member .hpBar .hp {
          background-color: #d02830;
        }



        /*******************************************************************
        *   Mods                                                           *
        *******************************************************************/


        /* Jobs xp                        *
        **********************************/
        .xpRestanteText {
          margin-right: 0;
          padding: 0;
        }
        .xpRestanteText::after {
          border: none;
          background: none;
        }
        .xpRestanteText .job {
          background: %primary_a40%;
          border: 1px solid %primary_a40%;
          backdrop-filter: %blur%;
          color: %text_primary%;
          text-shadow: none;
        }
        .xpRestanteText .name {
          text-shadow: none;
          color: %text_secondary%;
        }


        /* Party Member On Map            *
        **********************************/
        .pmomStatus {
          height: 15px;
          bottom: 3px;
        }
`;

// filter: saturate(0.1) brightness(1.5);