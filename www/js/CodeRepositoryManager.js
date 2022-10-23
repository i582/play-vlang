class CodeRepositoryManager {
    static params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    static selectRepository() {
        let repository = new LocalCodeRepository()
        let hash = CodeRepositoryManager.params.query;
        if (hash !== null) {
            repository = new SharedCodeRepository(hash)
        }
        return repository
    }
}
