class ExamplesManager {
    constructor(editor) {
        this.editor = editor
    }

    initListeners() {
        const examplesSelectList = document.querySelector('.js-examples-select .select-box__list');
        const examplesSelectBox = document.querySelector('.js-examples-select .select-box__current');
        if (examplesSelectList !== null) {

            examples.forEach(function (example, index) {
                examplesSelectList.innerHTML += ExamplesManager.exampleElementListTemplate(example.name, index)
                examplesSelectBox.innerHTML += ExamplesManager.exampleElementTemplate(example.name, index)
            })
        }

        const selectOptions = document.querySelectorAll('.select-box__option');

        selectOptions.forEach( (option) => {
            option.addEventListener('click',  () => {
                const exampleName = option.innerText
                const example = examples.find(function (example) {
                    return example.name === exampleName
                })
                this.editor.setCode(example.code)
            })
        })
    }

    static exampleElementTemplate = function (name, index) {
        let checked = "";
        if (index === 0) {
            checked = 'checked="checked"'
        }
        return `
<div class="select-box__value">
    <input class="select-box__input" type="radio" id="__select-id-${index}" value="1" name="Some" ${checked}/>
    <p class="select-box__input-text">${name}</p>
</div>
`
    }
    static exampleElementListTemplate = function (name, index) {
        return `
<li>
    <label class="select-box__option" for="__select-id-${index}" aria-hidden="true">${name}</label>
</li>
`
    }
}
