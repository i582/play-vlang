
/**
 * CodeRepositoryManager is responsible for managing the code repositories.
 */
class CodeRepositoryManager {

    /**
     * Base on `params` tries to select the appropriate repository to get the code.
     *
     * @param params The query parameters.
     * @returns {CodeRepository}
     */
    static selectRepository(params: QueryParams): CodeRepository {
        const repository = new LocalCodeRepository()
        const hash = params.params[SharedCodeRepository.QUERY_PARAM_NAME]
        if (hash !== null && hash !== undefined) {
            return new SharedCodeRepository(hash)
        }
        return repository
    }
}
