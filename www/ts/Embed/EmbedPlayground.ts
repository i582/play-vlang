class EmbedPlayground {
    constructor(private element: HTMLElement, private config: PlaygroundConfig) {
    }

    public mount() {
        this.element.innerHTML = embedTemplate()
        this.config.embed = true

        const editorElement = this.element.querySelector(".js-playground") as HTMLTextAreaElement
        const playground = new Playground(editorElement)

        playground.registerAction(PlaygroundDefaultAction.RUN, () => {
            playground.runCode()
        })
    }
}
