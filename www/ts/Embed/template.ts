const embedTemplate = () =>  `
<div class="js-playground v-playground">
    <div class="editor">
        <textarea></textarea>

        <button class="js-playground__action-run run">
            <span class="icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_1_5)">
                        <path class="run-icon" d="M14.4657 8.20966L2.4657 15.1379L2.4657 1.28145L14.4657 8.20966Z"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_1_5">
                            <rect width="16" height="16" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>
            </span>
        </button>

        <div class="js-terminal terminal">
            <button class="js-terminal__close terminal__close-button">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect class="close-terminal-button-rect" x="1" y="8" width="13" height="1"/>
                </svg>
            </button>
            <pre class="js-terminal__output terminal__output"></pre>
        </div>
    </div>
    
    <a class="playground-link" href="#">Open in Playground →</a>
</div>
`