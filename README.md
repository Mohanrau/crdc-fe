## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

## Absolute Paths

``` bash
    quasar: path.resolve(__dirname, '../node_modules/quasar-framework/'),
    src: path.resolve(__dirname, '../src'),
    assets: path.resolve(__dirname, '../src/assets'),
    components: path.resolve(__dirname, '../src/components'),
    app: path.resolve(__dirname, '../src/app')
    
    e.g *import global components or quasar components
    
    relative path
    import gHeader from '../../../global/common/headers/header'
    
    Absolute Path
    import gHeader from 'appRoot/global/common/headers/header'
```

## .env Setup

```bash
# Rename .env.example to .env
.env

# Change APP_PORT and BACKEND_URL

// App settings
APP_PORT = 8080
BACKEND_URL = http://projectm.dev/api/v1
APP_STORAGE_URL = http://projectm.dev/
STORAGE_PATH = public/storage/
```
## Modules List
```
Name || Alias
* Products Module @ products
* E-Commerce Module @ ecommerce
* Generals @ generals
* Members Module @ members
* Bonus Module @ bonus
* Sales Module @ sales
* Authorization and Permissions @ auth
```
## Branch Naming Convention
### Standard
Please follow Module alias (**do not create new or custom names**)  

**feature/{DEVELOPER_NAME}.{MODULE_ALIAS}**  

e.g - feature/mohan.products

### Special
hotfix-{BRANCH_VERSION} with increament

**{hotfix-{BRANCH_VERSION_WITH_INCREAMENT}}** 

e.g - hotfix-0.1 -> hotfix-0.1.1

## Versioning
X.Y.Z - SemVer  

##### Realease Life Cycle

**alpha - Internal Testing**  
**beta - QA & External Testing**  
**release-{NUMBER} - Final Release**  

**{BRANCH_VERSION}**  
```
e.g - v0.1
e,g - v0.1.1
```

## Git Workflow

**After PR Merged**
```
-- INITIAL SETUP --

git checkout dev
git checkout -b { feature/name.module }
git push origin { feature/name.module }
            

-- AFTER PULL REQUEST MERGED --

git checkout dev
git pull origin dev
git checkout { feature/name.module }
git rebase dev

-- NORMAL COMMIT FLOW
git add .
git commit -am "COMMIT MESSAGE"
git push origin { feature/name.module }

```
<hr color="orange" />
Note:- <span style=“color:red;”> After PR merged feature branch `{ feature/name.module }` will be removed to maintain consistency.if any error accrued while pushing new commits onto feature branch `{ feature/name.module }` please contact branch admin (Mohan)</span> :+1:




