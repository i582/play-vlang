const editorElement = document.querySelector('.place-for-playground')
const playground = new EmbedPlayground(editorElement, {
    theme: new Light(),
    code: 'println("Hello World")'
})

playground.mount()

