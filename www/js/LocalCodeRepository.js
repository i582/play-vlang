/**
 * Local code repository using the browser's local storage.
 * @extends CodeRepository
 */
class LocalCodeRepository {
    saveCode(code) {
        window.localStorage.setItem("code", code)
    }

    getCode(onReady) {
        const localCode = window.localStorage.getItem("code");
        if (localCode === null || localCode === undefined) {
            return welcomeCode
        }
        onReady(localCode)
    }
}
