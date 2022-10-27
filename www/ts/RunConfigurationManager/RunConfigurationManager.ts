enum RunConfigurationType {
    Run = "Run",
    Test = "Test",
}

class RunConfigurationManager {
    private static readonly QUERY_PARAM_NAME = "runConfiguration"
    private static readonly LOCAL_STORAGE_KEY = "run-configuration"

    private readonly queryParams: QueryParams
    private currentConfiguration: RunConfigurationType = RunConfigurationType.Run
    private fromQueryParam: boolean = false

    private readonly runButton = document.querySelector(".js-playground__action-run")
    private readonly runButtonLabel = document.querySelector(".js-playground__action-run .label")
    private readonly openRunButton = document.querySelector(".js-open-run-select")
    private readonly configurationsList = document.querySelector(".js-run-configurations-list")
    private readonly configurations = document.querySelectorAll(".js-configuration");

    private onChange: (RunConfigurationType) => void
    private onSelect: (RunConfigurationType) => void

    constructor(queryParams: QueryParams) {
        this.queryParams = queryParams

        this.mount()
    }

    public registerOnChange(callback: (RunConfigurationType) => void): void {
        this.onChange = callback
    }

    public registerOnSelect(callback: (RunConfigurationType) => void): void {
        this.onSelect = callback
    }

    public toggleConfigurationsList() {
        this.configurationsList.classList.toggle("hidden")
    }

    public setupConfiguration() {
        const configurationFromQuery = this.queryParams.params[RunConfigurationManager.QUERY_PARAM_NAME] as string
        if (configurationFromQuery !== null && configurationFromQuery !== undefined) {
            this.fromQueryParam = true
            this.useConfiguration(RunConfigurationType[configurationFromQuery])
            return
        }

        const configurationFromLocalStorage = window.localStorage.getItem(RunConfigurationManager.LOCAL_STORAGE_KEY)
        if (configurationFromLocalStorage !== null && configurationFromLocalStorage !== undefined) {
            this.useConfiguration(RunConfigurationType[configurationFromLocalStorage])
            return
        }

        this.useConfiguration(RunConfigurationType.Run)
    }

    private useConfiguration(runConfigurationType: RunConfigurationType) {
        this.currentConfiguration = runConfigurationType
        this.onChange(runConfigurationType)

        const runConfigurationAsString = RunConfigurationType[runConfigurationType]
        this.runButton.setAttribute("data-type", runConfigurationAsString)
        this.runButtonLabel.textContent = runConfigurationAsString

        if (!this.fromQueryParam) {
            // Don't update saved theme state if we're loading from query param.
            window.localStorage.setItem(RunConfigurationManager.LOCAL_STORAGE_KEY, runConfigurationAsString)
        }

        if (this.fromQueryParam) {
            // We update the query param only if we loaded from it.
            // If we don't change, then the user can change the configuration and then reload the page.
            // In this case, the page will load with the configuration from the URL, and the user
            // will think that his configuration change has not been saved (and will not be saved
            // until he removes the configuration from the URL).
            // To avoid this, we update the URL if the user changes configuration.
            this.queryParams.updateURLParameter(RunConfigurationManager.QUERY_PARAM_NAME, runConfigurationAsString)
        }
    }

    private mount() {
        this.openRunButton.addEventListener("click", () => {
            this.toggleConfigurationsList()
        })

        this.configurations.forEach(configuration => {
            configuration.addEventListener("click", () => {
                const configurationTypeString = configuration.getAttribute("data-type")
                const configurationType = RunConfigurationType[configurationTypeString]
                this.useConfiguration(configurationType)
                this.onSelect(configurationType)
            })
        })
    }
}
