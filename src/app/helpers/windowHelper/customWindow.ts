import { Button } from "./inputs/button";

export class CustomWindow {
    public wGame: any|Window;

    private newDragPosX = 0;
    private newDragPosY = 0;
    private currentDragPosX = 0;
    private currentDragPosY = 0;
    private resizePosX = 0;
    private resizePosY = 0;
    private isCustomElmnt: boolean = false;

    private haveFullScreen: boolean = false;
    private oldState: {posX: any, posY: any, width: any, height: any};

    private window: HTMLDivElement;
    private windowTitle;
    private windowBody;
    private closeButton;

    private constructor(wGame: any|Window) {
        this.wGame = wGame;
    }

    /**
     * Use custom html div element
     * @param elmnt The window element
     */
    public static createCustomWindow(wGame: any|Window, elmnt: HTMLDivElement): CustomWindow {
        const instance: CustomWindow = new CustomWindow(wGame);

        instance.isCustomElmnt = true;
        instance.window = elmnt;
        return instance;
    }

    /**
     * Create a basic window with dofus style but without define size.
     * Auto insert in DOM (windowsContainer)
     * @param {string} title Title will show to user
     * @param {string} id The id of that window
     */
    public static createDofusWindow(wGame: any|Window, title: string, id: string, options?: {customClassBody?: string}): CustomWindow {
        const instance: CustomWindow = new CustomWindow(wGame);

        instance.window = instance.wGame.document.createElement('div');
        instance.window.className = "window";
        instance.window.id = id;

        const content = `<div class="windowBorder"></div>
            <div class="windowContent">
                <div class="windowHeadWrapper">
                    <div class="windowTitle">${title}</div>
                    <div class="closeButton Button scaleOnPress"></div>
                </div>
                <div class="windowBodyWrapper">
                    <div class="windowBody"></div>
                </div>
            </div>`;

        instance.window.insertAdjacentHTML("afterbegin", content);
        instance.wGame.document.getElementsByClassName("windowsContainer")[0].appendChild(instance.window);

        instance.closeButton = instance.window.children[1].children[0].children[1];
        instance.windowTitle = instance.window.children[1].children[0].children[0];
        instance.windowBody = instance.window.children[1].children[1].children[0];

        if (options && options.customClassBody) instance.windowBody.classList.add(options.customClassBody);

        instance.closeButton.addEventListener('click', () => instance.window.style.display = "none");

        return instance;
    }

    /**
     * Add content to the dofus window
     * @param content Content to add
     */
    public addContent(content: HTMLElement): CustomWindow {
        if (!this.isCustomElmnt) this.windowBody.appendChild(content);
        else throw new Error('Can\'t add content on custom window');
        
        return this;
    }

    /**
     * Add a button to the right of the header
     * @param {Button} button The div button to add
     */
    public addButtonToRightToHeader(button: Button): CustomWindow {
        this.windowTitle.insertAdjacentElement('afterend', button.getHtmlElement());
        return this;
    }

    /**
     * Add a button to the left of the header
     * @param {Button} button The div button to add
     */
    public addButtonToLeftToHeader(button: Button): CustomWindow {
        this.windowTitle.insertAdjacentElement('beforebegin', button.getHtmlElement());
        return this;
    }

    /**
     * Add button to display window in fullscreen
     */
    public addFullScreenButton(): CustomWindow {
        this.haveFullScreen = true;

        const foreground = this.wGame.document.getElementsByClassName('foreground')[0];

        const extendBtn: Button = Button.createIconButton(this.wGame, this.window.id + '-fs-extend-btn', {icon: 'plusButton'});
        const reduceBtn: Button = Button.createIconButton(this.wGame, this.window.id + '-fs-reduce-btn', {icon: 'minusButton'});
        reduceBtn.getHtmlElement().style.display = 'none';

        let extendWindow = () => {
            extendBtn.getHtmlElement().style.display = 'none';
            reduceBtn.getHtmlElement().style.display = '';

            this.oldState = {
                posX: this.window.style.left,
                posY: this.window.style.top,
                width: this.window.style.width,
                height: this.window.style.height
            }

            this.window.style.top = '0';
            this.window.style.left = '0';
            this.window.style.width = (foreground.offsetLeft + foreground.offsetWidth) + 'px';
            this.window.style.height = (foreground.offsetTop + foreground.offsetHeight) + 'px';
        };

        let reduceWindow = () => {
            reduceBtn.getHtmlElement().style.display = 'none';
            extendBtn.getHtmlElement().style.display = '';

            this.window.style.top = this.oldState.posY;
            this.window.style.left = this.oldState.posX;
            this.window.style.width = this.oldState.width;
            this.window.style.height = this.oldState.height;
        };

        this.addButtonToRightToHeader(extendBtn);
        this.addButtonToRightToHeader(reduceBtn);

        extendBtn.addEvent(extendWindow);
        reduceBtn.addEvent(reduceWindow);

        return this;
    }

    /**
     * Make the window draggable
     * @param draggableAnchor Use if is custom window
     */
    public makeDraggable(draggableAnchor?: HTMLElement): CustomWindow {
        const container: any = this.wGame.document.getElementsByClassName('gameGuiContainer')[0];

        let dragMouseDown = (event: TouchEvent) => {
            const e = event.touches[0];
            this.currentDragPosX = e.clientX;
            this.currentDragPosY = e.clientY;

            this.wGame.document.addEventListener('touchend', closeDragElement);
            this.wGame.document.addEventListener('touchmove', elementDrag);
        };

        let elementDrag = (event: TouchEvent) => {
            const e = event.touches[0];
            // calculate the new cursor position
            this.newDragPosX = this.currentDragPosX - e.clientX;
            this.newDragPosY = this.currentDragPosY - e.clientY;
            this.currentDragPosX = e.clientX;
            this.currentDragPosY = e.clientY;

            // check if window is in the container and set new X pos
            if (this.window.offsetLeft < 0) this.window.style.left = '0px';
            else if (this.window.offsetLeft + this.window.offsetWidth > container.offsetWidth) this.window.style.left = container.offsetWidth - this.window.offsetWidth + 'px';
            else this.window.style.left = (this.window.offsetLeft - this.newDragPosX) + "px";
            
            // check if window is in the container and set new Y pos
            if (this.window.offsetTop < 0) this.window.style.top = '0px';
            else if (this.window.offsetTop + this.window.offsetHeight > container.offsetHeight) this.window.style.top = container.offsetHeight - this.window.offsetHeight + 'px';
            else this.window.style.top = (this.window.offsetTop - this.newDragPosY) + "px";
        };

        let closeDragElement = () => {
            this.wGame.document.removeEventListener('touchend', closeDragElement);
            this.wGame.document.removeEventListener('touchmove', elementDrag);
        };

        if (this.isCustomElmnt) {
            if (draggableAnchor) draggableAnchor.addEventListener('touchstart', dragMouseDown);
            else console.error('You must specify an HTMLElement for make draggable a custom window');
        } else {
            this.windowTitle.addEventListener('touchstart', dragMouseDown);
        }

        return this;
    }

    /**
     * Make the window abble to resize
     * @param resizeAnchor Use if is a custom window
     */
    public makeResizable(resizeAnchor?: HTMLElement): CustomWindow {
        let resizeHandle: HTMLElement;

        if (!this.isCustomElmnt) {
            resizeHandle = this.wGame.document.createElement('div');
            resizeHandle.className = 'resizeHandle';
            this.window.insertAdjacentElement("beforeend", resizeHandle);
        }

        let resizeMouseDown = (event: TouchEvent) => {
            if (this.haveFullScreen) {
                this.wGame.document.getElementById(this.window.id + '-fs-extend-btn').style.display = '';
                this.wGame.document.getElementById(this.window.id + '-fs-reduce-btn').style.display = 'none';
            }

            const e = event.touches[0];
            this.resizePosX = e.clientX;
            this.resizePosY = e.clientY;

            this.wGame.document.addEventListener('touchend', closeResizeElement);
            this.wGame.document.addEventListener('touchmove', elementResize);
        };

        let elementResize = (event: TouchEvent) => {
            const e = event.touches[0];
            this.resizePosX = e.clientX;
            this.resizePosY = e.clientY;

            this.window.style.width = (this.resizePosX - this.window.offsetLeft) + "px";
            this.window.style.height = (this.resizePosY - this.window.offsetTop) + "px";
        };

        let closeResizeElement = () => {
            this.wGame.document.removeEventListener('touchend', closeResizeElement);
            this.wGame.document.removeEventListener('touchmove', elementResize);
        };

        if (this.isCustomElmnt && resizeAnchor) {
            if (resizeAnchor) {
                resizeAnchor.addEventListener('touchstart', resizeMouseDown);
                resizeAnchor.style.position = 'absolute';
                resizeAnchor.style.bottom = '0';
                resizeAnchor.style.right = '0';
            } else {
                console.error('You must specify an HTMLElement for make resizable a custom window');
            }
        } else {
            resizeHandle.addEventListener('touchstart', resizeMouseDown);
        }

        return this;
    }

    public show(): CustomWindow {
        this.window.style.display = '';
        return this;
    }

    public hide(): CustomWindow {
        this.window.style.display = 'none';
        return this;
    }

    public isVisible(): boolean {
        return this.window.style.display !== 'none';
    }

    public get getHtmlElement(): HTMLDivElement {
        return this.window;
    }

    public destroy() {
        try {
            this.window.remove();
        } catch (ex) {
            console.error(ex);
        }
    }
}