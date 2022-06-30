## declare PHONY
.PHONY: build test all
MAKEFLAGS += --silent

all:
	make lint &&\
		make typecheck &&\
		make format-check &&\
		make test &&\
		make build

NODE_BIN=node_modules/.bin/

## install
install:
	yarn install --frozen-lockfile

## tsc
tsc:
	$(NODE_BIN)tsc -p tsconfig.json $(arguments) 

pre-transpile:
	rm -rf dist

## type check
typecheck-watch:
	make tsc arguments=--noEmit --w

typecheck:
	make tsc arguments=--noEmit

electron=$(NODE_BIN)electron

## start
start: 
	make tsc && $(electron) .

## format
prettier=$(NODE_BIN)prettier

format:
	$(prettier) --write src/

format-check:
	$(prettier) --check src/

## lint
lint:
	$(NODE_BIN)eslint src/** -f='stylish' --color
