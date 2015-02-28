
MODS=' react react/addons async immutable'

X_MODS=`echo ${MODS} | sed -e 's/ / -x /g'`
R_MODS=`echo ${MODS} | sed -e 's/ / -r /g'`
OPTS=${X_MODS} -d -t [ babelify --experimental ]

inject: inject-js inject-css

inject-watch:
	watchify -v ${OPTS} -x dexie src/inject/inject.js -o build/inject.js

inject-js:
	browserify ${OPTS} -x dexie src/inject/inject.js -o build/inject.js

inject-css:
	lessc src/inject/run.less > build/inject.css



dashboard: dashboard-js dashboard-css

dashboard-watch:
	watchify -v ${OPTS} -x dexie src/dashboard/run.js -o build/dashboard.js

dashboard-js:
	browserify ${OPTS} -x dexie src/dashboard/run.js -o build/dashboard.js

dashboard-css:
	lessc src/dashboard/run.less > build/dashboard.css



background:
	browserify ${OPTS} src/background/run.js -o build/background.js

background-watch:
	watchify -v ${OPTS} src/background/run.js -o build/background.js



lib-test:
	browserify -r dexie -o build/lib-test.js

lib:
	browserify ${R_MODS} -r dexie -o build/lib.js

.PHONY: lib inject lib-test dashboard dashboard-js dashboard-watch
