import { Mod } from "../mod";

export class AddCss extends Mod {

    startMod() {
        if (!this.wGame.document.getElementById('componentDtCss')) {
            const componentCss = document.createElement('style');
            componentCss.id = 'componentDtCss';
            componentCss.innerHTML = `
            .menu {
                width: 100%;
                max-height: inherit;
            }
            .menu .listItem.selected {
                border-image: url(./assets/ui/table/tableHighlight.png) 0 fill / 1 / 0 stretch;
            }
            .menu .listItem {
                box-sizing: border-box;
                width: 100%;
                height: 40px;
                padding: 11px;
                border-width: 1px;
                border-style: solid;
                border-color: transparent;
            }
            .menu .listItem.odd {
                background-color: rgb(43, 44, 39);
            }

            .customCol {
                overflow: hidden;
                text-overflow: ellipsis;
            }
            `;

            this.wGame.document.head.appendChild(componentCss);
        }
        if (!this.wGame.document.getElementById('inputDtCss')) {
            const inputCss = document.createElement('style');
            inputCss.id = 'inputDtCss';
            inputCss.innerHTML = `
                .customScrollerContent {
                    overflow-y: scroll;
                    margin-right: 0 !important;
                    height: inherit;
                    max-height: inherit;
                }
                .customScrollerContent::-webkit-scrollbar {
                    width: 2px;
                }
                .customScrollerContent::-webkit-scrollbar-track {
                    background-color: black;
                }
                .customScrollerContent::-webkit-scrollbar-thumb,
                .customScrollerContent::-webkit-scrollbar-thumb:hover {
                    background: #a3d52e;
                    border-radius: 2px;
                }
                /* Custom input */
                input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
                }
                .customNumber {
                    width: 45px;
                }
                /* DofusTouch icon button */
                .centerButton {
                    width: 35px;
                    height: 40px;
                    background-image: url(./assets/ui/worldmap/btn_center.png);
                    background-position: 50% 30%;
                    background-size: 33px 33px;
                    background-repeat: no-repeat;
                }
            `;

            this.wGame.document.querySelector('head').appendChild(inputCss);
        }
        if (!this.wGame.document.getElementById('windowContentCss')) {
            const windowContentCss = document.createElement('style');
            windowContentCss.id = 'windowContentCss';
            windowContentCss.innerHTML = `
                .scrollableContent {
                    overflow-y: scroll;
                    overflow-x: hidden;
                    width: calc(100% - 14px);
                    padding: 0 7px;
                    margin-right: 0 !important;
                }
                .scrollableContent::-webkit-scrollbar {
                    width: 2px;
                }
                .scrollableContent::-webkit-scrollbar-track {
                    background-color: transparent;
                }
                .scrollableContent::-webkit-scrollbar-thumb,
                .scrollableContent::-webkit-scrollbar-thumb:hover {
                    background: #a3d52e;
                    border-radius: 2px;
                }

                .customContent {
                    box-sizing: border-box;
                    position: relative;
                    padding: 10px 7px;
                    max-height: 100%;
                    display: flex;
                    width: 100%;
                    min-height: 48px;
                }
                .customContent::before {
                    content: "";
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    z-index: -1;
                    top: 0;
                    left: 0;
                    border-style: solid;
                    border-width: 24px;
                    border-image: url(../game/assets/ui/containerBg.png) 48 fill;
                    box-sizing: border-box;
                }
            `;

            this.wGame.document.querySelector('head').appendChild(windowContentCss);
        }
    }
}