# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm ci
```

## Running docker container

```
docker-compose up
```
Wait several minutes untill you will see `server-app` logs:
```
server-app  | [Nest] 123  - 11/18/2024, 4:57:24 PM     LOG [RouterExplorer] Mapped {/album/:id, PUT} route +1ms
server-app  | [Nest] 123  - 11/18/2024, 4:57:24 PM     LOG [RouterExplorer] Mapped {/album/:id, DELETE} route +2ms
server-app  | [Nest] 123  - 11/18/2024, 4:57:24 PM     LOG [RoutesResolver] FavoritesController {/favs}: +1ms
server-app  | [Nest] 123  - 11/18/2024, 4:57:24 PM     LOG [RouterExplorer] Mapped {/favs, GET} route +0ms
server-app  | [Nest] 123  - 11/18/2024, 4:57:24 PM     LOG [RouterExplorer] Mapped {/favs/track/:id, POST} route +1ms
server-app  | [Nest] 123  - 11/18/2024, 4:57:24 PM     LOG [RouterExplorer] Mapped {/favs/track/:id, DELETE} route +1ms        
server-app  | [Nest] 123  - 11/18/2024, 4:57:24 PM     LOG [RouterExplorer] Mapped {/favs/album/:id, POST} route +0ms
server-app  | [Nest] 123  - 11/18/2024, 4:57:24 PM     LOG [RouterExplorer] Mapped {/favs/album/:id, DELETE} route +1ms        
server-app  | [Nest] 123  - 11/18/2024, 4:57:24 PM     LOG [RouterExplorer] Mapped {/favs/artist/:id, POST} route +0ms
server-app  | [Nest] 123  - 11/18/2024, 4:57:24 PM     LOG [RouterExplorer] Mapped {/favs/artist/:id, DELETE} route +0ms       
server-app  | [Nest] 123  - 11/18/2024, 4:57:25 PM     LOG [NestApplication] Nest application successfully started +80ms  
```

## After it successfully install and run all images we can check tests, that should be passed

```
npm run test
```

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
