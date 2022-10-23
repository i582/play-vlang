class ThemeManager {
    static html = document.querySelector("html");
    static params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    editor

    constructor() {
    }

    static changeThemeButton = document.getElementsByClassName('js-change-theme')[0];

    onLoad() {
        const themeFromQuery = ThemeManager.params.theme
        if (themeFromQuery !== null) {
            this.turnTheme(themeFromQuery)
            return
        }

        const themeFromLocalStorage = window.localStorage.getItem('theme')
        if (themeFromLocalStorage !== null) {
            this.turnTheme(themeFromLocalStorage)
        }
    }

    turnTheme(name) {
        let icon = moonIcon;
        if (name === 'dark') {
            icon = sunIcon
        }
        // if not embedded, change the theme button
        if (ThemeManager.changeThemeButton !== undefined) {
            ThemeManager.changeThemeButton.innerHTML = icon
        }

        this.editor.editor.setOption('theme', name)
        ThemeManager.html.setAttribute('data-theme', name)
        window.localStorage.setItem('theme', name);
    }

    turnDarkTheme() {
        this.turnTheme('dark')
    }

    turnLightTheme() {
        this.turnTheme('light')
    }

    initListeners() {
        ThemeManager.changeThemeButton.addEventListener('click', () => {
            const theme = this.editor.editor.getOption('theme')

            if (theme === 'light') {
                this.turnDarkTheme();
            } else {
                this.turnLightTheme();
            }
        })
    }
}
