class HelpManager {
    static helpOverlay = document.getElementsByClassName('js-help-overlay')[0];
    static showHelpButton = document.getElementsByClassName('js-show-help')[0];
    static closeHelpButton = document.getElementsByClassName('js-close-help')[0];
    static isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    initListeners() {
        if (HelpManager.showHelpButton !== undefined) {
            HelpManager.showHelpButton.addEventListener('click', () => {
                this.toggleHelp();
            })
        }

        if (HelpManager.helpOverlay !== undefined) {
            HelpManager.helpOverlay.addEventListener('click', () => {
                this.toggleHelp();
            })
        }

        if (HelpManager.closeHelpButton !== undefined) {
            HelpManager.closeHelpButton.addEventListener('click', () => {
                this.toggleHelp();
            })
        }

        // Replace shortcut with understandable for OS user:
        //  - macOS: ⌃
        //  - Windows/Linux: Ctrl
        if (!HelpManager.isMac) {
            const shortcuts = document.querySelectorAll('.js-shortcut-value')
            shortcuts.forEach(function (shortcut) {
                shortcut.innerText = shortcut.innerText.replace('⌃', 'Ctrl')
            })
        }
    }

    closeHelp() {
        if (!HelpManager.helpOverlay.classList.contains('opened')) {
            return
        }
        this.toggleHelp()
    }

    toggleHelp() {
        const help = document.getElementsByClassName('js-help')[0];
        help.classList.toggle('opened')
        HelpManager.helpOverlay.classList.toggle('opened')
    }
}
