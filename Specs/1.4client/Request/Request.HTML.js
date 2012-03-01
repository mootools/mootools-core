/*
---
name: Request.HTML Specs
description: n/a
requires: [Core/Request.HTML]
provides: [Request.HTML.Specs]
...
*/

describe('Request.HTML', function(){

    beforeEach(function(){
        this.spy = jasmine.createSpy();
        this.xhr = sinon.useFakeXMLHttpRequest();
        var requests = this.requests = [];
        this.xhr.onCreate = function(xhr){
            requests.push(xhr);
        };
    });

    afterEach(function(){
        this.xhr.restore();
    });

    it('should create an ajax request and overriden options should be used to correctly update an element with the response', function(){

        var response = '<span>text</span>';

        this.spy.identity = 'Request.HTML onComplete update element';
        new Element('div', {'id': 'update', 'html': '<div>some</div>'}).inject(document.body);
        this.request = new Request.HTML({
            url: '../Helpers/request.php',
            onComplete: this.spy
        }).send({
            update: 'update'
        });

        this.requests[0].respond(200, {'Content-Type': 'text/html'}, response);

        expect(this.spy.wasCalled).toBe(true);

        var update = $('update');
        expect(update.getChildren().length).toEqual(1);
        expect(update.getFirst().get('tag')).toEqual('span');
        expect(update.getFirst().get('text')).toEqual('text');
        update.dispose();

    });

    it('should create an ajax request and overriden options should be used to correctly append the response to an element', function(){

        var response = '<div><span>text</span><p>paragraph</p></div>';

        new Element('div', {'id': 'update', 'html': '<div>some</div>'}).inject(document.body);
        this.spy.identity = 'Request.HTML onComplete ajax append';
        this.request = new Request.HTML({
            url: '../Helpers/request.php',
            onComplete: this.spy
        }).send({
            append: 'update'
        });

        this.requests[0].respond(200, {'Content-Type': 'text/html'}, response);

        expect(this.spy.wasCalled).toBe(true);

        var update = $('update');
        expect(update.getChildren().length).toEqual(2);
        expect(update.getFirst().get('tag')).toEqual('div');
        expect(update.getFirst().get('text')).toEqual('some');
        var div = update.getFirst().getNext();
        expect(div.get('tag')).toEqual('div');
        expect(div.getFirst().get('tag')).toEqual('span');
        expect(div.getFirst().get('text')).toEqual('text');
        expect(div.getLast().get('tag')).toEqual('p');
        expect(div.getLast().get('text')).toEqual('paragraph');
        update.dispose();

    });

    it('should create an ajax request and overriden options should be used to correctly filter it by the passed selector', function(){

        var response = '<span>text</span><a>aaa</a>';

        this.spy.identity = 'Request.HTML onComplete filter';
        var request = new Request.HTML({
            url: '../Helpers/request.php',
            onComplete: this.spy
        }).send({
            filter: 'a'
        });

        this.requests[0].respond(200, {'Content-Type': 'text/html'}, response);
        expect(this.spy.wasCalled).toBe(true);

        var onCompleteArgs = this.spy.argsForCall[0];
        expect(onCompleteArgs[0].length).toEqual(1);
        expect(onCompleteArgs[0][0].get('tag')).toEqual('a');
        expect(onCompleteArgs[0][0].get('text')).toEqual('aaa');

    });

    it('should create an ajax request and overriden options should be used to filter the response and update the target', function(){

        var response = '<div>text<p><a>a link</a></p></div>';

        this.spy.identity = 'Request.HTML onComplete update and filter';
        new Element('div', {'id': 'update', 'html': '<div>some</div>'}).inject(document.body);
        this.request = new Request.HTML({
            url: '../Helpers/request.php',
            onComplete: this.spy
        }).send({
            update: 'update',
            filter: 'a'
        });

        this.requests[0].respond(200, {'Content-Type': 'text/html'}, response);
        expect(this.spy.wasCalled).toBe(true);

        var update = $('update');
        expect(update.getChildren().length).toEqual(1);
        expect(update.getFirst().get('tag')).toEqual('a');
        expect(update.getFirst().get('text')).toEqual('a link');
        update.dispose();

    });

    it('should create an ajax request  and overriden options should be used to filter the response and append to the target', function(){

        var response = '<div>text<p><a>a link</a></p></div>';

        new Element('div', {'id': 'update', 'html': '<div>some</div>'}).inject(document.body);
        this.spy.identity = 'Request.HTML onComplete append and filter';
        this.request = new Request.HTML({
            url: '../Helpers/request.php',
            onComplete: this.spy
        }).send({
            append: 'update',
            filter: 'a'
        });

        this.requests[0].respond(200, {'Content-Type': 'text/html'}, response);
        expect(this.spy.wasCalled).toBe(true);

        var update = $('update');
        expect(update.getChildren().length).toEqual(2);
        expect(update.get('html').toLowerCase()).toEqual('<div>some</div><a>a link</a>');
        update.dispose();

    });
});