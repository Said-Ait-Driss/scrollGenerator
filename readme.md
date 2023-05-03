# Scroll Generator
    is lite and quick set up package to scroll over elastic search index built using built in node js generator
## How it work
    all you have to do to scroll over an index is to give two params and done
    - first import your elastic search client 
    example :
 ```js
    import client from '../libs/elasticsearch'
 ```
    - import scrollOverIndex :
 ```js
    import scrollOverIndex from 'scrollgenerator'
 ```

    - write your optional options parameter
 ```js
let options = {
    client: client,
    index: 'new_artists_matches',
    query: {
        "match_all": {}
    },
    size: 500,
}
 ```
 + note : All of these options are required exepct size (default = 500)

 - finally write executable code with the imported scrollOverIndex function and scrollRun callback
 ```js
 async function main() {
    await scrollOverIndex(options, scrollRun)
    console.log('scroll done : ', data.length)
  }

  main()
 ```
 - the scrollRun will run in evey batch of hits
 + example of scrollRun callback :
 ```js
    async function scrollRun(result) {
        for (let item of result.hits.hits) {
            console.log(`data length : ${data.length} || ${result.hits.total.value}`)
            console.log(item);
        }
        return
    }
 ```