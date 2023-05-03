let index = null
let query = null
let size = 500
let cpt = 0
let client = null

function init(options) {
    client = options.client
    index = options.index
    query = options.query
    size = options.size
}

async function elasticSearcher(scroll_id) {
    if (scroll_id) {
        const { body } = await client.scroll({
            scroll_id,
            scroll: '30s',
        })
        return body
    }

    const { body } = await client.search({
        index,
        size: size,
        scroll: '30s',
        body: {
            query: query,
        },
    })
    return body
}

function* resultGenerator(condition = null, scroll_id = null) {
    if (scroll_id && condition) {
        while (condition) {
            yield elasticSearcher(scroll_id)
        }
    } else {
        if (!scroll_id) yield elasticSearcher()
    }
}

async function scrollOverIndex(options = { client: null, index: '', query: {}, size: 500 }, cb) {
    init(options)
    const generator = resultGenerator()
    let result = await generator.next().value
    cpt += result.hits.hits.length
    await cb(result)
    if (result.hits.total.value > cpt && result._scroll_id) {
        const resultIterator = resultGenerator(result.hits.total.value > cpt, result._scroll_id)
        let iteratorResult = resultIterator.next()
        while (!iteratorResult.done && cpt < result.hits.total.value) {
            result = await iteratorResult.value
            cpt += result.hits.hits.length
            await cb(result)
            iteratorResult = resultIterator.next()
        }
    } else return
}

modules.exports = scrollOverIndex
