node=$(shell which node)
npm=$(shell which npm)
credential=./credentials/development

install:
	$(npm) install

start:
	./bin/hubot-slack $(credential)


run:
	$(node) ./resources/main.js
