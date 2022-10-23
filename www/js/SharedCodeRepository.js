/**
 * Shared code repository using the server side SQL storage.
 * @extends CodeRepository
 */
class SharedCodeRepository {
    hash = null

    constructor(hash) {
        this.hash = hash
    }

    saveCode(code) {
        // nothing to do
    }

    getCode(onReady) {
        if (this.hash === null) {
            return null
        }
        return this.#getSharedCode(onReady)
    }

    #getSharedCode(onReady) {
        const data = new FormData()
        data.append("hash", this.hash)

        fetch("/query", {
            method: "post",
            body: data
        })
            .then(resp => resp.text())
            .then(data => {
                onReady(data)
            })
            .catch(err => {
                console.log(err);
            })
    }
}
