# sparql-named-query

This repository contains polyfill code for a SPARQL Named Query feature.

## Usage

The SPARQL Named Query feature allows to store the result of a sub-query into a variable that can be imported again.
A new `QUERY` keyword is introduced to define a Named Query.
`VALUES` is extended with the `FROM` keyword to refer to a Named Query.
Here is a simple example:

```sparql
BASE <http://example.org/>

SELECT * WHERE {
  QUERY ?q1 {
    SELECT * WHERE {
      VALUES (?a ?b) {
        (<a1> <b1>)
        (<a2> <b2>)
        (<a3> <b3>)
      }

      FILTER(?a IN (<a1>, <a2>))
    }
  }

  VALUES (?a ?b) FROM ?q1
}
```

The code in this library will run the sub-query and replace the `VALUES FROM` with a standard `VALUES` statement that contains the result of the sub-query.

More examples can be found in the `examples` folder and the `test/assets` folder.

### Web Interface

This repository contains code for a Web Interface.
You can build it with:

```bash
npm run build
```

All artifacts are stored in the `docs` folder.
Use an http server like `http-server` to host the files on your local machine and access them on the shown URL:

```bash
npx http-server docs
```

### Command Line Tool

The command line tool requires the URL of the SPARQL endpoint and the filename of the query.
Use the `-v` flag to enable logging of the generated sub-queries.
The following line will use the pathway example query included in this repository:

```bash
./bin/sparql-named-query.js https://query.wikidata.org/sparql examples/pathway.sparql -v > result.json
```
